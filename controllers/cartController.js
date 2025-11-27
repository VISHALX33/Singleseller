/**
 * Cart Controller - Shopping cart operations
 * Handles: add/remove items, update quantities, calculate totals
 */
import asyncHandler from '../middlewares/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

/**
 * Get user's shopping cart
 * @route GET /api/cart
 * @access Protected
 */
export const getCart = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  let cart = await Cart.findOne({ user: userId }).populate({
    path: 'items.product',
    select: 'title price mrp thumbnail stock slug category',
  });

  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
    await cart.save();
  }

  res.status(200).json({
    success: true,
    data: cart,
    message: 'Cart retrieved successfully',
  });
});

/**
 * Add item to cart or update quantity if exists
 * @route POST /api/cart
 * @access Protected
 * @body {productId, quantity}
 */
export const addToCart = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { productId, quantity } = req.body;

  // Validation
  if (!productId) {
    throw new ApiError(400, 'Product ID is required');
  }

  const qty = parseInt(quantity) || 1;
  if (qty < 1) {
    throw new ApiError(400, 'Quantity must be at least 1');
  }

  // Verify product exists and check stock
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  if (product.stock < qty) {
    throw new ApiError(400, `Only ${product.stock} items available in stock`);
  }

  // Get or create cart
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  // Check if item already exists in cart
  const existingItem = cart.items.find(item => item.product.toString() === productId);

  if (existingItem) {
    // Update quantity
    const newQuantity = existingItem.quantity + qty;

    if (newQuantity > product.stock) {
      throw new ApiError(
        400,
        `Cannot add that many items. Only ${product.stock} available, you have ${existingItem.quantity} in cart`
      );
    }

    existingItem.quantity = newQuantity;
    existingItem.price = product.price; // Update price in case it changed
  } else {
    // Add new item
    cart.items.push({
      product: productId,
      quantity: qty,
      price: product.price,
    });
  }

  // Recalculate totals
  await recalculateCartTotals(cart);
  await cart.save();

  // Populate product details
  await cart.populate({
    path: 'items.product',
    select: 'title price mrp thumbnail stock slug category',
  });

  res.status(201).json({
    success: true,
    data: cart,
    message: `${product.title} added to cart successfully`,
  });
});

/**
 * Update cart item quantity
 * @route PUT /api/cart/:itemId
 * @access Protected
 * @body {quantity}
 */
export const updateCartItem = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { itemId } = req.params;
  const { quantity } = req.body;

  // Validation
  if (!quantity) {
    throw new ApiError(400, 'Quantity is required');
  }

  const qty = parseInt(quantity);
  if (qty < 1) {
    throw new ApiError(400, 'Quantity must be at least 1');
  }

  // Get cart
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(404, 'Cart not found');
  }

  // Find item in cart
  const cartItem = cart.items.find(item => item._id.toString() === itemId);
  if (!cartItem) {
    throw new ApiError(404, 'Item not found in cart');
  }

  // Verify product stock
  const product = await Product.findById(cartItem.product);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  if (qty > product.stock) {
    throw new ApiError(
      400,
      `Only ${product.stock} items available in stock`
    );
  }

  // Update quantity
  cartItem.quantity = qty;

  // Recalculate totals
  await recalculateCartTotals(cart);
  await cart.save();

  // Populate product details
  await cart.populate({
    path: 'items.product',
    select: 'title price mrp thumbnail stock slug category',
  });

  res.status(200).json({
    success: true,
    data: cart,
    message: 'Cart item updated successfully',
  });
});

/**
 * Remove item from cart
 * @route DELETE /api/cart/:itemId
 * @access Protected
 */
export const removeFromCart = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { itemId } = req.params;

  // Get cart
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(404, 'Cart not found');
  }

  // Find and remove item
  const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
  if (itemIndex === -1) {
    throw new ApiError(404, 'Item not found in cart');
  }

  const removedItem = cart.items.splice(itemIndex, 1)[0];

  // Recalculate totals
  await recalculateCartTotals(cart);
  await cart.save();

  // Populate product details
  await cart.populate({
    path: 'items.product',
    select: 'title price mrp thumbnail stock slug category',
  });

  res.status(200).json({
    success: true,
    data: cart,
    message: 'Item removed from cart successfully',
  });
});

/**
 * Clear entire cart
 * @route DELETE /api/cart
 * @access Protected
 */
export const clearCart = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  cart.items = [];
  cart.subtotal = 0;
  cart.itemCount = 0;
  await cart.save();

  res.status(200).json({
    success: true,
    data: cart,
    message: 'Cart cleared successfully',
  });
});

/**
 * Helper: Recalculate cart totals
 */
async function recalculateCartTotals(cart) {
  let subtotal = 0;
  let itemCount = 0;

  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (product) {
      const itemTotal = item.quantity * (item.price || product.price);
      subtotal += itemTotal;
      itemCount += item.quantity;
    }
  }

  cart.subtotal = parseFloat(subtotal.toFixed(2));
  cart.itemCount = itemCount;
}

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
