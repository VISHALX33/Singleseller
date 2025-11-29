// Product model: Represents items sold by the single seller.
const mongoose = require('mongoose');

function slugify(str) {
  return str
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const attributeSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  value: { type: String, trim: true }
}, { _id: false });

const seoSchema = new mongoose.Schema({
  metaTitle: { type: String, trim: true },
  metaDescription: { type: String, trim: true },
  keywords: [{ type: String, trim: true }]
}, { _id: false });

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  shortDescription: { type: String, trim: true },
  description: { type: String, trim: true },
  price: { type: Number, required: true, min: 0 },
  mrp: { type: Number, required: true, min: 0 }, // original price
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  brand: { type: String, trim: true },
  images: [{ type: String }],
  thumbnail: { type: String },
  stock: { type: Number, default: 0, min: 0 },
  sku: { type: String, required: true, unique: true, trim: true },
  status: { type: String, enum: ['active', 'inactive', 'out_of_stock'], default: 'active' },
  attributes: [attributeSchema],
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0, min: 0 }
  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  seo: seoSchema
}, { timestamps: true });

// Calculate discount virtual (percentage and value)
productSchema.virtual('discountValue').get(function() {
  if (!this.mrp || !this.price) return 0;
  return Math.max(this.mrp - this.price, 0);
});

productSchema.virtual('discountPercent').get(function() {
  if (!this.mrp || !this.price || this.mrp === 0) return 0;
  return Math.round(((this.mrp - this.price) / this.mrp) * 100);
});

// Ensure virtuals are serialized
productSchema.set('toObject', { virtuals: true });
productSchema.set('toJSON', { virtuals: true });

// Indexes for common queries
productSchema.index({ status: 1 });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
// Text index for search on title, description, shortDescription
productSchema.index({ title: 'text', description: 'text', shortDescription: 'text' });

// Auto-generate slug from title if changed
productSchema.pre('validate', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title);
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
