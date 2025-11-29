// Cart model: Maintains current cart state per user.
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 } // unit price at the time of adding
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema],
  subtotal: { type: Number, default: 0, min: 0 },
  itemCount: { type: Number, default: 0, min: 0 }
}, { timestamps: { createdAt: false, updatedAt: true } });

// Recalculate derived fields
cartSchema.methods.recalculate = function() {
  this.subtotal = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  this.itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
};

cartSchema.pre('save', function(next) {
  try {
    this.recalculate();
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Cart', cartSchema);
