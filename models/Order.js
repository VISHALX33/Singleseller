/**
 * Order Model - Represents customer orders
 * Tracks order items, status, payment, and shipping information
 */
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    // Order Identification
    orderId: {
      type: String,
      unique: true,
      required: true,
    },

    // Customer Reference
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },

    // Order Items
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
        },
        price: {
          type: Number,
          required: true,
          min: [0, 'Price cannot be negative'],
        },
        subtotal: {
          type: Number,
          required: true,
        },
      },
    ],

    // Addresses
    shippingAddress: {
      _id: false,
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
      name: String,
      phone: String,
    },

    billingAddress: {
      _id: false,
      street: String,
      city: String,
      state: String,
      pincode: String,
      name: String,
      phone: String,
    },

    // Payment Information
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'cod', 'upi'],
      required: [true, 'Please select a payment method'],
    },

    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },

    paymentDetails: {
      _id: false,
      transactionId: String,
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
      paidAt: Date,
    },

    // Order Status
    orderStatus: {
      type: String,
      enum: ['placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'],
      default: 'placed',
    },

    // Status History
    statusHistory: [
      {
        _id: false,
        status: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        note: String,
      },
    ],

    // Pricing Information
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative'],
    },

    shippingCharges: {
      type: Number,
      default: 0,
      min: [0, 'Shipping charges cannot be negative'],
    },

    tax: {
      type: Number,
      default: 0,
      min: [0, 'Tax cannot be negative'],
    },

    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
    },

    total: {
      type: Number,
      required: true,
      min: [0, 'Total cannot be negative'],
    },

    // Shipping Information
    deliveryDate: {
      type: Date,
      default: () => new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    },

    trackingNumber: {
      type: String,
      default: null,
    },

    // Notes
    notes: String,
    adminNotes: String,
  },
  {
    timestamps: true,
  }
);

// Index for frequently queried fields
orderSchema.index({ orderId: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

// Pre-save hook to generate orderId
orderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    this.orderId = `ORD${timestamp}${random}`;
  }
  next();
});

// Pre-save hook to add initial status to history
orderSchema.pre('save', function (next) {
  if (this.isNew) {
    this.statusHistory.push({
      status: this.orderStatus,
      timestamp: new Date(),
      note: 'Order placed',
    });
  }
  next();
});

// Method to update order status
orderSchema.methods.updateStatus = async function (newStatus, note = '') {
  if (!['placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'].includes(newStatus)) {
    throw new Error('Invalid status');
  }

  this.orderStatus = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note: note,
  });

  await this.save();
  return this;
};

// Method to mark payment as completed
orderSchema.methods.markPaymentCompleted = async function (paymentDetails) {
  this.paymentStatus = 'completed';
  this.paymentDetails = paymentDetails;
  await this.save();
  return this;
};

// Virtual for formatted order date
orderSchema.virtual('formattedDate').get(function () {
  return this.createdAt?.toLocaleDateString('en-IN');
});

// Virtual for order summary
orderSchema.virtual('summary').get(function () {
  return {
    orderId: this.orderId,
    total: this.total,
    itemCount: this.items.length,
    status: this.orderStatus,
    date: this.createdAt,
  };
});

// Create and export Order model
const Order = mongoose.model('Order', orderSchema);
export default Order;
