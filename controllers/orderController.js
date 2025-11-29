/**
 * Order Controller - Order management operations
 * Handles: create orders, get orders, update status, cancel orders
 */
import asyncHandler from '../middlewares/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

/**
 * Create order from cart
 * @route POST /api/orders
 * @access Protected
 * @body {shippingAddress, paymentMethod, paymentDetails}
 */
export const createOrder = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { shippingAddress, paymentMethod, transactionId, notes } = req.body;

  // Validate required fields
  if (!shippingAddress) {
    throw new ApiError(400, 'Shipping address is required');
  }
  if (!paymentMethod) {
    throw new ApiError(400, 'Payment method is required');
  }

  // Validate shipping address completeness
  const requiredAddressFields = ['fullName', 'phone', 'email', 'addressLine1', 'city', 'state', 'postalCode'];
  const missingFields = requiredAddressFields.filter(field => !shippingAddress[field]);
  if (missingFields.length > 0) {
    throw new ApiError(400, `Missing address fields: ${missingFields.join(', ')}`);
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(shippingAddress.email)) {
    throw new ApiError(400, 'Invalid email address');
  }

  // Get user's cart
  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, 'Cart is empty');
  }

  // Verify stock availability and prepare order items
  const orderItems = [];
  const stockUpdates = [];

  for (const cartItem of cart.items) {
    const product = cartItem.product;

    // Check stock
    if (!product.stock || product.stock < cartItem.quantity) {
      throw new ApiError(
        400,
        `Product "${product.title}" has insufficient stock. Available: ${product.stock}, Requested: ${cartItem.quantity}`
      );
    }

    // Create order item
    orderItems.push({
      product: product._id,
      productTitle: product.title,
      productSku: product.sku || product._id.toString().slice(-8),
      quantity: cartItem.quantity,
      price: cartItem.price,
      discount: product.mrp && product.mrp > cartItem.price 
        ? parseFloat((product.mrp - cartItem.price).toFixed(2))
        : 0,
      total: parseFloat((cartItem.quantity * cartItem.price).toFixed(2)),
    });

    // Prepare stock update
    stockUpdates.push({
      productId: product._id,
      quantity: cartItem.quantity,
    });
  }

  // Calculate order totals
  const subtotal = parseFloat(cart.subtotal.toFixed(2));
  const shippingCost = subtotal > 500 ? 0 : 50; // Free shipping over ₹500
  const tax = parseFloat((subtotal * 0.05).toFixed(2)); // 5% tax
  const total = parseFloat((subtotal + shippingCost + tax).toFixed(2));

  // Create order
  const order = new Order({
    user: userId,
    items: orderItems,
    subtotal,
    shippingCost,
    tax,
    total,
    shippingAddress,
    paymentMethod,
    transactionId: transactionId || null,
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed',
    status: 'pending',
    notes: notes || '',
  });

  // Add initial status to history
  order.statusHistory.push({
    status: 'pending',
    timestamp: new Date(),
    changedBy: 'user',
    comment: 'Order created',
  });

  // Update product stock (atomic operation)
  try {
    for (const update of stockUpdates) {
      await Product.findByIdAndUpdate(
        update.productId,
        { $inc: { stock: -update.quantity } },
        { new: true }
      );
    }

    // Save order
    await order.save();

    // Clear cart
    cart.items = [];
    cart.subtotal = 0;
    cart.itemCount = 0;
    await cart.save();

    // Populate for response
    await order.populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order created successfully',
    });
  } catch (error) {
    // Rollback stock updates if order creation fails
    for (const update of stockUpdates) {
      await Product.findByIdAndUpdate(
        update.productId,
        { $inc: { stock: update.quantity } },
        { new: true }
      );
    }
    throw error;
  }
});

/**
 * Get user's orders with pagination
 * @route GET /api/orders
 * @access Protected
 * @query {page, limit, status, sortBy}
 */
export const getOrders = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { page = 1, limit = 10, status, sortBy = '-createdAt' } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const query = { user: userId };

  // Filter by status if provided
  if (status) {
    if (!['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      throw new ApiError(400, 'Invalid status');
    }
    query.status = status;
  }

  // Get total count
  const total = await Order.countDocuments(query);

  // Fetch orders
  const orders = await Order.find(query)
    .populate('user', 'name email phone')
    .populate('items.product', 'title thumbnail slug')
    .sort(sortBy)
    .limit(parseInt(limit))
    .skip(skip)
    .lean();

  res.status(200).json({
    success: true,
    data: orders,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalItems: total,
      itemsPerPage: parseInt(limit),
    },
    message: 'Orders retrieved successfully',
  });
});

/**
 * Get single order by ID
 * @route GET /api/orders/:id
 * @access Protected
 */
export const getOrderById = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;

  const order = await Order.findById(id)
    .populate('user', 'name email phone')
    .populate('items.product', 'title thumbnail slug price stock');

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  // Verify ownership
  if (order.user._id.toString() !== userId) {
    throw new ApiError(403, 'You do not have permission to view this order');
  }

  res.status(200).json({
    success: true,
    data: order,
    message: 'Order retrieved successfully',
  });
});

/**
 * Update order status (Admin only)
 * @route PUT /api/orders/:id/status
 * @access Admin
 * @body {status, comment}
 */
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, comment } = req.body;

  // Validate status
  const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!status || !validStatuses.includes(status)) {
    throw new ApiError(400, 'Invalid status');
  }

  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  // Validate status transition
  const currentStatus = order.status;
  const statusPriority = {
    pending: 0,
    confirmed: 1,
    processing: 2,
    shipped: 3,
    delivered: 4,
    cancelled: 5,
  };

  // Can't go back to a previous status or change cancelled/delivered orders
  if (statusPriority[status] < statusPriority[currentStatus]) {
    throw new ApiError(400, `Cannot change from ${currentStatus} to ${status}`);
  }

  if ((currentStatus === 'delivered' || currentStatus === 'cancelled') && status !== currentStatus) {
    throw new ApiError(400, `Cannot modify ${currentStatus} order`);
  }

  // Update status
  order.status = status;
  order.statusHistory.push({
    status,
    timestamp: new Date(),
    changedBy: 'admin',
    comment: comment || '',
  });

  // Set delivery date if status is delivered
  if (status === 'delivered' && !order.deliveredAt) {
    order.deliveredAt = new Date();
  }

  await order.save();

  res.status(200).json({
    success: true,
    data: order,
    message: `Order status updated to ${status}`,
  });
});

/**
 * Cancel order
 * @route POST /api/orders/:id/cancel
 * @access Protected (User/Admin)
 * @body {reason}
 */
export const cancelOrder = asyncHandler(async (req, res) => {
  const { userId, role } = req.user;
  const { id } = req.params;
  const { reason } = req.body;

  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  // Verify ownership or admin
  if (role !== 'admin' && order.user.toString() !== userId) {
    throw new ApiError(403, 'You do not have permission to cancel this order');
  }

  // Can't cancel if already shipped/delivered
  if (['shipped', 'delivered'].includes(order.status)) {
    throw new ApiError(400, `Cannot cancel ${order.status} order`);
  }

  // Can't cancel if already cancelled
  if (order.status === 'cancelled') {
    throw new ApiError(400, 'Order is already cancelled');
  }

  // Restore stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(
      item.product,
      { $inc: { stock: item.quantity } },
      { new: true }
    );
  }

  // Update order
  order.status = 'cancelled';
  order.cancellationReason = reason || 'User requested cancellation';
  order.cancelledAt = new Date();
  order.statusHistory.push({
    status: 'cancelled',
    timestamp: new Date(),
    changedBy: role === 'admin' ? 'admin' : 'user',
    comment: reason || '',
  });

  await order.save();

  res.status(200).json({
    success: true,
    data: order,
    message: 'Order cancelled successfully. Stock has been restored.',
  });
});

export default {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};
