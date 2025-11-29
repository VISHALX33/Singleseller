const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
}

exports.getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    await cart.populate({
      path: 'items.product',
      select: 'title price stock thumbnail status'
    });
    res.json({ success: true, cart });
  } catch (err) { next(new ApiError(err.message, 500)); }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) return next(new ApiError('productId required', 400));
    const product = await Product.findById(productId);
    if (!product || product.status !== 'active') return next(new ApiError('Product unavailable', 404));
    if (product.stock < quantity) return next(new ApiError('Insufficient stock', 400));

    const cart = await getOrCreateCart(req.user._id);
    const existing = cart.items.find(i => i.product.toString() === productId);
    if (existing) {
      const newQty = existing.quantity + quantity;
      if (newQty > product.stock) return next(new ApiError('Exceeds available stock', 400));
      existing.quantity = newQty;
      existing.price = product.price; // refresh price
    } else {
      cart.items.push({ product: product._id, quantity, price: product.price });
    }
    cart.recalculate();
    await cart.save();
    await cart.populate({ path: 'items.product', select: 'title price stock thumbnail status' });
    res.status(201).json({ success: true, cart });
  } catch (err) { next(new ApiError(err.message, 500)); }
};

exports.updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    if (quantity === undefined || quantity < 1) return next(new ApiError('Quantity must be >=1', 400));
    const cart = await getOrCreateCart(req.user._id);
    const item = cart.items.id(itemId);
    if (!item) return next(new ApiError('Item not found', 404));
    const product = await Product.findById(item.product);
    if (!product || product.status !== 'active') return next(new ApiError('Product unavailable', 404));
    if (product.stock < quantity) return next(new ApiError('Insufficient stock', 400));
    item.quantity = quantity;
    item.price = product.price; // update price in case changed
    cart.recalculate();
    await cart.save();
    await cart.populate({ path: 'items.product', select: 'title price stock thumbnail status' });
    res.json({ success: true, cart });
  } catch (err) { next(new ApiError(err.message, 500)); }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const cart = await getOrCreateCart(req.user._id);
    const item = cart.items.id(itemId);
    if (!item) return next(new ApiError('Item not found', 404));
    item.deleteOne();
    cart.recalculate();
    await cart.save();
    res.json({ success: true, cart });
  } catch (err) { next(new ApiError(err.message, 500)); }
};

exports.clearCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = [];
    cart.recalculate();
    await cart.save();
    res.json({ success: true, cart });
  } catch (err) { next(new ApiError(err.message, 500)); }
};
