// Category model: Supports hierarchical categories with parent reference.
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

const seoSchema = new mongoose.Schema({
  metaTitle: { type: String, trim: true },
  metaDescription: { type: String, trim: true },
  keywords: [{ type: String, trim: true }]
}, { _id: false });

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  description: { type: String, trim: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  level: { type: Number, default: 0 },
  image: { type: String },
  icon: { type: String },
  isActive: { type: Boolean, default: true },
  seo: seoSchema
}, { timestamps: true });

// Compute level based on parent
categorySchema.pre('validate', async function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name);
  }
  if (this.isModified('parent')) {
    if (this.parent) {
      try {
        const parentCat = await this.constructor.findById(this.parent).select('level');
        this.level = parentCat ? parentCat.level + 1 : 0;
      } catch (err) {
        return next(err);
      }
    } else {
      this.level = 0;
    }
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
