// Order model: Tracks purchase lifecycle and payment details.
const mongoose = require('mongoose');

const addressEmbedded = {
  name: { type: String, trim: true },
  street: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  pincode: { type: String, trim: true },
  phone: { type: String, trim: true }
};

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 }, // unit price at time of order
  subtotal: { type: Number, required: true, min: 0 } // quantity * price
}, { _id: false });

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, enum: ['placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'], required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String, trim: true }
}, { _id: false });

const paymentDetailsSchema = new mongoose.Schema({
  transactionId: { type: String, trim: true },
  razorpayOrderId: { type: String, trim: true },
  razorpayPaymentId: { type: String, trim: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: { type: [orderItemSchema], validate: v => v.length > 0 },
  shippingAddress: addressEmbedded,
  billingAddress: addressEmbedded,
  paymentMethod: { type: String, enum: ['razorpay', 'cod'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  paymentDetails: paymentDetailsSchema,
  orderStatus: { type: String, enum: ['placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'], default: 'placed' },
  statusHistory: [statusHistorySchema],
  subtotal: { type: Number, default: 0, min: 0 },
  shippingCharges: { type: Number, default: 0, min: 0 },
  tax: { type: Number, default: 0, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  total: { type: Number, default: 0, min: 0 },
  deliveryDate: { type: Date },
  trackingNumber: { type: String, trim: true }
}, { timestamps: true });

// Generate orderId if new
orderSchema.pre('validate', function(next) {
  if (!this.orderId) {
    this.orderId = 'ORD' + Date.now();
  }
  next();
});

// Recalculate monetary fields before save
orderSchema.pre('save', function(next) {
  try {
    this.subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);
    this.total = Math.max(this.subtotal + this.shippingCharges + this.tax - this.discount, 0);
    // Ensure status history contains current status at creation
    if (this.isNew) {
      this.statusHistory.push({ status: this.orderStatus, note: 'Order created' });
    }
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Order', orderSchema);
