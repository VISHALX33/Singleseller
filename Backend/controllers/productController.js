const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const { validationResult } = require('express-validator');
const { deleteFileIfExists } = require('../utils/fileHelper');

// Create product (admin) - expects req.file (thumbnail)
exports.createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(new ApiError(errors.array().map(e => e.msg).join(', '), 400));
    const data = req.body;
    if (req.file) {
      data.thumbnail = '/uploads/products/' + req.file.filename;
    }
    // Set default MRP if not provided
    if (!data.mrp && data.price) data.mrp = data.price;
    const product = await Product.create(data);
    res.status(201).json({ success: true, product });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

// Pagination + filtering + search
exports.getAllProducts = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(new ApiError(errors.array().map(e => e.msg).join(', '), 400));

    let { page = 1, limit = 12, q, category, minPrice, maxPrice, status } = req.query;
    page = parseInt(page, 10); limit = parseInt(limit, 10);

    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (minPrice) filter.price = { ...filter.price, $gte: parseFloat(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };

    let query = Product.find(filter);

    if (q) {
      // text search fallback to regex if no index
      query = query.find({ $text: { $search: q } });
    }

    const total = await Product.countDocuments(query.getFilter());
    const products = await query
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, page, limit, total, products });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new ApiError('Product not found', 404));
    res.json({ success: true, product });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

exports.getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return next(new ApiError('Product not found', 404));
    res.json({ success: true, product });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(new ApiError(errors.array().map(e => e.msg).join(', '), 400));
    const product = await Product.findById(req.params.id);
    if (!product) return next(new ApiError('Product not found', 404));

    const prevThumbnail = product.thumbnail;

    Object.assign(product, req.body);

    if (req.file) {
      product.thumbnail = '/uploads/products/' + req.file.filename;
    }

    // Soft adjust status for zero stock
    if (product.stock === 0 && product.status === 'active') {
      product.status = 'out_of_stock';
    }

    await product.save();

    // Delete old thumbnail if replaced
    if (req.file && prevThumbnail && prevThumbnail !== product.thumbnail) {
      deleteFileIfExists(prevThumbnail);
    }

    res.json({ success: true, product });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new ApiError('Product not found', 404));
    product.status = 'inactive';
    await product.save();
    res.json({ success: true, message: 'Product marked inactive' });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

// Upload additional images
exports.uploadProductImages = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new ApiError('Product not found', 404));
    const newImages = (req.files || []).map(f => '/uploads/products/' + f.filename);
    product.images = [...product.images, ...newImages];
    await product.save();
    res.json({ success: true, images: product.images });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};
