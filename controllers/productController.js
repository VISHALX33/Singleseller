/**
 * Product Controller - Handles all product-related operations
 * Includes CRUD, image upload, search, pagination, and filtering
 */
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { deleteFile } from '../utils/fileHelper.js';

/**
 * Create a new product
 * @route POST /api/products
 * @access Admin
 */
export const createProduct = asyncHandler(async (req, res) => {
  const { title, description, shortDescription, price, mrp, category, brand, stock, sku, attributes, seo, isFeatured } = req.body;

  // Validate required fields
  if (!title || !description || !price || !category || !stock || !sku) {
    throw new ApiError(400, 'Please provide all required fields: title, description, price, category, stock, sku');
  }

  // Verify category exists
  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    throw new ApiError(404, 'Category not found');
  }

  // Check if SKU already exists
  const existingSku = await Product.findOne({ sku: sku.toUpperCase() });
  if (existingSku) {
    throw new ApiError(400, 'SKU already exists');
  }

  // Check if title slug already exists
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const existingSlug = await Product.findOne({ slug });
  if (existingSlug) {
    throw new ApiError(400, 'A product with this title already exists');
  }

  // Handle uploaded images
  let thumbnail = null;
  let images = [];

  if (req.files && req.files.length > 0) {
    images = req.files.map(file => ({
      url: `/uploads/products/${file.filename}`,
      altText: title,
    }));
    thumbnail = images[0].url;
  }

  if (!thumbnail) {
    throw new ApiError(400, 'Please upload at least one product image');
  }

  // Create product
  const product = new Product({
    title,
    slug,
    description,
    shortDescription,
    price: parseFloat(price),
    mrp: parseFloat(mrp) || parseFloat(price),
    category,
    brand: brand || '',
    stock: parseInt(stock),
    sku: sku.toUpperCase(),
    images,
    thumbnail,
    attributes: attributes ? JSON.parse(attributes) : [],
    seo: seo ? JSON.parse(seo) : {},
    isFeatured: isFeatured === 'true' || isFeatured === true,
    createdBy: req.user._id,
    status: parseInt(stock) > 0 ? 'active' : 'out_of_stock',
  });

  await product.save();

  // Populate references
  await product.populate(['category', 'createdBy']);

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: product,
  });
});

/**
 * Get all products with pagination, search, and filters
 * @route GET /api/products
 * @query page, limit, search, category, minPrice, maxPrice, stock, sort, isFeatured
 * @access Public
 */
export const getAllProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    search = '',
    category = '',
    minPrice = 0,
    maxPrice = Infinity,
    stock = '',
    sort = '-createdAt',
    isFeatured = '',
  } = req.query;

  // Build filter object
  const filter = { status: 'active' };

  // Search filter - use text search on title and description
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { shortDescription: { $regex: search, $options: 'i' } },
    ];
  }

  // Category filter
  if (category) {
    filter.category = category;
  }

  // Price range filter
  if (minPrice || maxPrice !== Infinity) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice !== Infinity) filter.price.$lte = parseFloat(maxPrice);
  }

  // Stock status filter
  if (stock === 'in_stock') {
    filter.stock = { $gt: 0 };
  } else if (stock === 'out_of_stock') {
    filter.stock = 0;
  }

  // Featured filter
  if (isFeatured === 'true') {
    filter.isFeatured = true;
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute query
  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-attributes -seo -createdBy'),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: products,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalItems: total,
      itemsPerPage: parseInt(limit),
    },
  });
});

/**
 * Get product by ID
 * @route GET /api/products/:id
 * @access Public
 */
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category')
    .populate({
      path: 'reviews',
      select: 'rating comment createdAt user',
    })
    .populate('createdBy', 'name email');

  if (!product || product.status === 'inactive') {
    throw new ApiError(404, 'Product not found');
  }

  res.json({
    success: true,
    data: product,
  });
});

/**
 * Get product by slug (for frontend SEO-friendly URLs)
 * @route GET /api/products/slug/:slug
 * @access Public
 */
export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, status: 'active' })
    .populate('category')
    .populate({
      path: 'reviews',
      select: 'rating comment createdAt user',
    });

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  res.json({
    success: true,
    data: product,
  });
});

/**
 * Update product
 * @route PUT /api/products/:id
 * @access Admin
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, shortDescription, price, mrp, category, brand, stock, attributes, seo, isFeatured } = req.body;

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  // Verify category exists if provided
  if (category) {
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      throw new ApiError(404, 'Category not found');
    }
    product.category = category;
  }

  // Update fields
  if (title) {
    product.title = title;
    // Regenerate slug if title changes
    product.slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  if (description) product.description = description;
  if (shortDescription) product.shortDescription = shortDescription;
  if (price) product.price = parseFloat(price);
  if (mrp) product.mrp = parseFloat(mrp);
  if (brand) product.brand = brand;
  
  if (stock !== undefined) {
    product.stock = parseInt(stock);
    // Update status based on stock
    if (parseInt(stock) === 0) {
      product.status = 'out_of_stock';
    } else if (product.status === 'out_of_stock') {
      product.status = 'active';
    }
  }

  if (attributes) product.attributes = JSON.parse(attributes);
  if (seo) product.seo = JSON.parse(seo);
  if (isFeatured !== undefined) product.isFeatured = isFeatured === 'true' || isFeatured === true;

  // Handle new images if uploaded
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map(file => ({
      url: `/uploads/products/${file.filename}`,
      altText: title || product.title,
    }));
    product.images = newImages;
    product.thumbnail = newImages[0].url;
  }

  await product.save();
  await product.populate(['category', 'createdBy']);

  res.json({
    success: true,
    message: 'Product updated successfully',
    data: product,
  });
});

/**
 * Soft delete product (set status to inactive)
 * @route DELETE /api/products/:id
 * @access Admin
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  // Soft delete - set status to inactive instead of removing
  product.status = 'inactive';
  await product.save();

  res.json({
    success: true,
    message: 'Product deleted successfully',
  });
});

/**
 * Upload multiple product images
 * @route POST /api/products/:id/images
 * @access Admin
 */
export const uploadProductImages = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, 'Please upload at least one image');
  }

  // Add new images to existing ones
  const newImages = req.files.map(file => ({
    url: `/uploads/products/${file.filename}`,
    altText: product.title,
  }));

  product.images = [...product.images, ...newImages];

  // Update thumbnail if not set
  if (!product.thumbnail) {
    product.thumbnail = product.images[0].url;
  }

  await product.save();

  res.json({
    success: true,
    message: 'Images uploaded successfully',
    data: product,
  });
});

/**
 * Delete a specific product image
 * @route DELETE /api/products/:id/images/:imageIndex
 * @access Admin
 */
export const deleteProductImage = asyncHandler(async (req, res) => {
  const { id, imageIndex } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  const index = parseInt(imageIndex);
  if (index < 0 || index >= product.images.length) {
    throw new ApiError(400, 'Invalid image index');
  }

  const imageUrl = product.images[index].url;

  // Remove image from array
  product.images.splice(index, 1);

  // If deleted image was thumbnail, set new thumbnail
  if (product.thumbnail === imageUrl) {
    product.thumbnail = product.images.length > 0 ? product.images[0].url : null;
  }

  // Delete file from storage
  if (imageUrl) {
    deleteFile(imageUrl);
  }

  await product.save();

  res.json({
    success: true,
    message: 'Image deleted successfully',
    data: product,
  });
});

/**
 * Search products by text
 * @route GET /api/products/search/query
 * @query q, limit
 * @access Public
 */
export const searchProducts = asyncHandler(async (req, res) => {
  const { q = '', limit = 10 } = req.query;

  if (q.length < 2) {
    throw new ApiError(400, 'Search query must be at least 2 characters');
  }

  const products = await Product.find(
    {
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
      ],
      status: 'active',
    },
    { title: 1, slug: 1, thumbnail: 1, price: 1, discount: 1 }
  )
    .limit(parseInt(limit))
    .lean();

  res.json({
    success: true,
    data: products,
  });
});

/**
 * Get products by category
 * @route GET /api/products/category/:categoryId
 * @access Public
 */
export const getProductsByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { page = 1, limit = 12, sort = '-createdAt' } = req.query;

  // Verify category exists
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [products, total] = await Promise.all([
    Product.find({ category: categoryId, status: 'active' })
      .populate('category')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-attributes -seo -createdBy'),
    Product.countDocuments({ category: categoryId, status: 'active' }),
  ]);

  res.json({
    success: true,
    data: products,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalItems: total,
      itemsPerPage: parseInt(limit),
    },
  });
});

/**
 * Get featured products
 * @route GET /api/products/featured
 * @access Public
 */
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const { limit = 8 } = req.query;

  const products = await Product.find({ isFeatured: true, status: 'active' })
    .populate('category')
    .limit(parseInt(limit))
    .sort('-createdAt')
    .select('-attributes -seo -createdBy');

  res.json({
    success: true,
    data: products,
  });
});

/**
 * Get admin dashboard stats
 * @route GET /api/products/stats/dashboard
 * @access Admin
 */
export const getProductStats = asyncHandler(async (req, res) => {
  const [totalProducts, activeProducts, inactiveProducts, outOfStock, avgPrice, lowStockProducts] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ status: 'active' }),
    Product.countDocuments({ status: 'inactive' }),
    Product.countDocuments({ status: 'out_of_stock' }),
    Product.aggregate([{ $group: { _id: null, avg: { $avg: '$price' } } }]),
    Product.countDocuments({ stock: { $lte: 5, $gt: 0 } }),
  ]);

  res.json({
    success: true,
    data: {
      totalProducts,
      activeProducts,
      inactiveProducts,
      outOfStock,
      lowStockProducts,
      averagePrice: avgPrice[0]?.avg || 0,
    },
  });
});
