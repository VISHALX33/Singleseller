/**
 * Category Model - Represents product categories
 * Supports nested categories (parent-child hierarchy)
 */
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, 'Please provide category name'],
      trim: true,
      unique: true,
      minlength: [2, 'Category name must be at least 2 characters'],
      maxlength: [100, 'Category name cannot exceed 100 characters'],
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
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },

    // Hierarchy
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },

    level: {
      type: Number,
      default: 0,
      min: [0, 'Level cannot be negative'],
    },

    // Media
    image: {
      type: String,
      default: null,
    },

    icon: {
      type: String,
      default: null,
    },

    // Status
    isActive: {
      type: Boolean,
      default: true,
    },

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

    // Product count (virtual can be used too)
    productCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for frequently queried fields
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ level: 1 });

// Pre-save hook to auto-generate slug
categorySchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Method to get all subcategories
categorySchema.methods.getChildren = async function () {
  return await this.constructor.find({ parent: this._id });
};

// Method to get parent category
categorySchema.methods.getParent = async function () {
  if (this.parent) {
    return await this.constructor.findById(this.parent);
  }
  return null;
};

// Create and export Category model
const Category = mongoose.model('Category', categorySchema);
export default Category;
