/**
 * Cart Model - Represents user shopping carts
 * Stores temporary shopping cart items before checkout
 */
import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    // User Reference (unique - one cart per user)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true,
    },

    // Cart Items
    items: [
      {
        _id: false,
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        sku: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, 'Quantity must be at least 1'],
          max: [999, 'Quantity cannot exceed 999'],
        },
        price: {
          type: Number,
          required: true,
          min: [0, 'Price cannot be negative'],
        },
        // Store thumbnail for quick display
        thumbnail: String,
      },
    ],

    // Cart Totals (denormalized for performance)
    subtotal: {
      type: Number,
      default: 0,
      min: [0, 'Subtotal cannot be negative'],
    },

    itemCount: {
      type: Number,
      default: 0,
      min: [0, 'Item count cannot be negative'],
    },

    // Metadata
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  },
  {
    timestamps: true,
  }
);

// Index for frequently queried fields
cartSchema.index({ user: 1 });
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// Pre-save hook to calculate totals
cartSchema.pre('save', function (next) {
  this.itemCount = this.items.reduce((total, item) => total + item.quantity, 0);
  this.subtotal = this.items.reduce((total, item) => total + item.price * item.quantity, 0);
  next();
});

// Method to add item to cart
cartSchema.methods.addItem = async function (product, quantity = 1) {
  const existingItem = this.items.find((item) => item.product.toString() === product._id.toString());

  if (existingItem) {
    // Update quantity if item already exists
    existingItem.quantity += quantity;
    if (existingItem.quantity > 999) {
      existingItem.quantity = 999;
    }
  } else {
    // Add new item
    this.items.push({
      product: product._id,
      title: product.title,
      sku: product.sku,
      quantity: quantity,
      price: product.price,
      thumbnail: product.thumbnail,
    });
  }

  await this.save();
  return this;
};

// Method to remove item from cart
cartSchema.methods.removeItem = async function (productId) {
  this.items = this.items.filter((item) => item.product.toString() !== productId.toString());
  await this.save();
  return this;
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = async function (productId, quantity) {
  const item = this.items.find((item) => item.product.toString() === productId.toString());

  if (!item) {
    throw new Error('Item not found in cart');
  }

  if (quantity <= 0) {
    return this.removeItem(productId);
  }

  if (quantity > 999) {
    quantity = 999;
  }

  item.quantity = quantity;
  await this.save();
  return this;
};

// Method to clear cart
cartSchema.methods.clear = async function () {
  this.items = [];
  await this.save();
  return this;
};

// Method to get cart summary
cartSchema.methods.getSummary = function () {
  return {
    itemCount: this.itemCount,
    subtotal: this.subtotal,
    items: this.items.map((item) => ({
      productId: item.product,
      title: item.title,
      sku: item.sku,
      quantity: item.quantity,
      price: item.price,
      lineTotal: item.price * item.quantity,
    })),
  };
};

// Static method to get or create cart for user
cartSchema.statics.getOrCreate = async function (userId) {
  let cart = await this.findOne({ user: userId });

  if (!cart) {
    cart = new this({ user: userId });
    await cart.save();
  }

  return cart;
};

// Virtual for total (subtotal with taxes and shipping can be added)
cartSchema.virtual('total').get(function () {
  return this.subtotal;
});

// Ensure JSON doesn't include _id for cart items
cartSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.items = ret.items.map((item) => {
      delete item._id;
      return item;
    });
    return ret;
  },
});

// Create and export Cart model
const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
