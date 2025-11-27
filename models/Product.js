/**
 * Product Model - Represents products in the ecommerce platform
 * Includes pricing, inventory, ratings, and SEO information
 */
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    // Basic Information
    title: {
      type: String,
      required: [true, 'Please provide product title'],
      trim: true,
      minlength: [3, 'Product title must be at least 3 characters'],
      maxlength: [200, 'Product title cannot exceed 200 characters'],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },

    description: {
      type: String,
      required: [true, 'Please provide product description'],
      minlength: [10, 'Description must be at least 10 characters'],
    },

    shortDescription: {
      type: String,
      maxlength: [500, 'Short description cannot exceed 500 characters'],
    },

    // Pricing
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: [0, 'Price cannot be negative'],
    },

    mrp: {
      type: Number,
      required: [true, 'Please provide original price (MRP)'],
      min: [0, 'MRP cannot be negative'],
    },

    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
    },

    // Category and Brand
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please select a category'],
    },

    brand: {
      type: String,
      trim: true,
      maxlength: [100, 'Brand name cannot exceed 100 characters'],
    },

    // Images
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        altText: String,
        _id: false,
      },
    ],

    thumbnail: {
      type: String,
      required: [true, 'Please provide a thumbnail image'],
    },

    // Inventory
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },

    sku: {
      type: String,
      unique: true,
      required: [true, 'Please provide SKU'],
      uppercase: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ['active', 'inactive', 'out_of_stock'],
      default: 'active',
    },

    // Attributes
    attributes: [
      {
        _id: false,
        name: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
      },
    ],

    // Ratings and Reviews
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: [0, 'Rating cannot be less than 0'],
        max: [5, 'Rating cannot be more than 5'],
      },
      count: {
        type: Number,
        default: 0,
      },
    },

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],

    // SEO
    seo: {
      metaTitle: {
        type: String,
        maxlength: [60, 'Meta title cannot exceed 60 characters'],
      },
      metaDescription: {
        type: String,
        maxlength: [160, 'Meta description cannot exceed 160 characters'],
      },
      keywords: [
        {
          type: String,
          maxlength: [50, 'Keyword cannot exceed 50 characters'],
        },
      ],
    },

    // Admin Fields
    isFeatured: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Index for frequently queried fields
productSchema.index({ slug: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ status: 1 });
productSchema.index({ 'ratings.average': -1 });
productSchema.index({ isFeatured: 1, status: 1 });

// Pre-save hook to calculate discount
productSchema.pre('save', function (next) {
  if (this.mrp && this.price) {
    this.discount = Math.round(((this.mrp - this.price) / this.mrp) * 100);
  }
  next();
});

// Pre-save hook to auto-generate slug from title
productSchema.pre('save', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Virtual for discount amount in currency
productSchema.virtual('discountAmount').get(function () {
  return this.mrp - this.price;
});

// Virtual to check if in stock
productSchema.virtual('inStock').get(function () {
  return this.stock > 0 && this.status !== 'out_of_stock';
});

// Method to update stock after order
productSchema.methods.decreaseStock = async function (quantity) {
  this.stock -= quantity;
  if (this.stock === 0) {
    this.status = 'out_of_stock';
  }
  await this.save();
};

// Method to increase stock (for cancellations)
productSchema.statics.increaseStock = async function (productId, quantity) {
  const product = await this.findById(productId);
  if (product) {
    product.stock += quantity;
    if (product.status === 'out_of_stock' && product.stock > 0) {
      product.status = 'active';
    }
    await product.save();
  }
};

// Create and export Product model
const Product = mongoose.model('Product', productSchema);
export default Product;
