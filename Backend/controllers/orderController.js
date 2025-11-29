const mongoose = require('mongoose');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');

async function getUserCart(userId) {
  return Cart.findOne({ user: userId });
}

exports.createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const cart = await getUserCart(req.user._id).populate('items.product');
    if (!cart || cart.items.length === 0) throw new ApiError('Cart is empty', 400);

    for (const item of cart.items) {
      if (item.product.status !== 'active') throw new ApiError('Inactive product in cart', 400);
      if (item.product.stock < item.quantity) throw new ApiError(`Insufficient stock for ${item.product.title}`, 400);
    }

    // Deduct stock
    for (const item of cart.items) {
      const updated = await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } }, { new: true, session });
      if (!updated) throw new ApiError('Stock update failed', 500);
    }

    const shippingAddress = req.body.shippingAddress || {};
    const paymentMethod = req.body.paymentMethod; // validated

    const items = cart.items.map(i => ({
      product: i.product._id,
      quantity: i.quantity,
      price: i.price,
      subtotal: i.price * i.quantity
    }));

    const shippingCharges = 0; // placeholder
    const tax = 0; // placeholder
    const discount = 0; // placeholder
    const subtotal = items.reduce((s, it) => s + it.subtotal, 0);
    const total = subtotal + shippingCharges + tax - discount;

    const created = await Order.create([{
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      shippingCharges,
      tax,
      discount,
      subtotal,
      total
    }], { session });

    // Clear cart
    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();
    res.status(201).json({ success: true, order: created[0] });
  } catch (err) {
    await session.abortTransaction();
    next(err instanceof ApiError ? err : new ApiError(err.message, 500));
  } finally { session.endSession(); }
};

exports.getOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = req.user.role === 'admin' ? {} : { user: req.user._id };

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('items.product', 'title price thumbnail').lean(),
      Order.countDocuments(filter)
    ]);

    res.json({ success: true, page, pages: Math.ceil(total / limit), total, orders });
  } catch (err) { next(new ApiError(err.message, 500)); }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate('items.product', 'title price thumbnail');
    if (!order) return next(new ApiError('Order not found', 404));
    if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) return next(new ApiError('Not authorized', 403));
    res.json({ success: true, order });
  } catch (err) { next(new ApiError(err.message, 500)); }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;
    const order = await Order.findById(id);
    if (!order) return next(new ApiError('Order not found', 404));

    if (req.user.role !== 'admin') return next(new ApiError('Not authorized', 403));

    const validTransitions = {
      placed: ['confirmed','cancelled'],
      confirmed: ['packed','cancelled'],
      packed: ['shipped','cancelled'],
      shipped: ['delivered'],
      delivered: [],
      cancelled: []
    };

    const current = order.orderStatus;
    if (!validTransitions[current].includes(orderStatus)) return next(new ApiError('Invalid status transition', 400));

    order.statusHistory.push({ status: orderStatus, note: 'Status updated' });
    order.orderStatus = orderStatus;
    await order.save();
    res.json({ success: true, order });
  } catch (err) { next(new ApiError(err.message, 500)); }
};

exports.cancelOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate('items.product');
    if (!order) throw new ApiError('Order not found', 404);
    if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) throw new ApiError('Not authorized', 403);

    if (['shipped','delivered','cancelled'].includes(order.orderStatus)) throw new ApiError('Cannot cancel at current status', 400);

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: item.quantity } }, { session });
    }

    order.statusHistory.push({ status: 'cancelled', note: 'Order cancelled' });
    order.orderStatus = 'cancelled';
    await order.save({ session });

    await session.commitTransaction();
    res.json({ success: true, order });
  } catch (err) {
    await session.abortTransaction();
    next(err instanceof ApiError ? err : new ApiError(err.message, 500));
  } finally { session.endSession(); }
};
