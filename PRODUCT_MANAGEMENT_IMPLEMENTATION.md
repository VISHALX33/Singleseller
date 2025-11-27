# Product Management System - Implementation Guide

## Overview

This guide covers the complete product management system implementation including:
- Product CRUD operations with image upload
- Category management
- Advanced filtering, search, and pagination
- Admin dashboard statistics
- File handling and cleanup

## Files Created/Modified

### Controllers

#### 1. `controllers/productController.js`
Complete product management controller with 10 main functions:

**CRUD Operations:**
- `createProduct()` - Create new product with image upload
- `getAllProducts()` - List products with filtering, search, pagination
- `getProductById()` - Get single product by ID
- `getProductBySlug()` - Get product by slug (SEO-friendly)
- `updateProduct()` - Update product details and images
- `deleteProduct()` - Soft delete product (sets status to inactive)

**Image Management:**
- `uploadProductImages()` - Add additional images to existing product
- `deleteProductImage()` - Remove specific image from product

**Search & Discovery:**
- `searchProducts()` - Text search on title, description, brand
- `getProductsByCategory()` - Filter products by category
- `getFeaturedProducts()` - Get featured products

**Admin Features:**
- `getProductStats()` - Dashboard statistics (total, active, low stock, average price)

#### 2. `controllers/categoryController.js`
Category management controller with 7 functions:

**CRUD Operations:**
- `createCategory()` - Create new category
- `getAllCategories()` - List all categories
- `getCategoryById()` - Get category by ID
- `getCategoryBySlug()` - Get category by slug
- `updateCategory()` - Update category details
- `deleteCategory()` - Delete category (with product count validation)

**Admin Features:**
- `getCategoriesWithCount()` - Categories with product count
- `bulkUpdateCategoryStatus()` - Bulk update active status

### Routes

#### 1. `routes/productRoutes.js`
RESTful API routes for products:

**Public Routes:**
```
GET    /api/products                    # List with pagination/filters
GET    /api/products/:id                # Get by ID
GET    /api/products/slug/:slug         # Get by slug
GET    /api/products/search/query       # Search
GET    /api/products/category/:catId    # By category
GET    /api/products/featured           # Featured only
```

**Admin Routes:**
```
POST   /api/products                    # Create with images
PUT    /api/products/:id                # Update
DELETE /api/products/:id                # Soft delete
POST   /api/products/:id/images         # Add images
DELETE /api/products/:id/images/:index  # Remove image
GET    /api/products/stats/dashboard    # Admin stats
```

#### 2. `routes/categoryRoutes.js`
RESTful API routes for categories:

**Public Routes:**
```
GET    /api/categories                  # List all
GET    /api/categories/:id              # Get by ID
GET    /api/categories/slug/:slug       # Get by slug
```

**Admin Routes:**
```
POST   /api/categories                  # Create
PUT    /api/categories/:id              # Update
DELETE /api/categories/:id              # Delete
GET    /api/categories/stats/count      # With product count
PUT    /api/categories/bulk/status      # Bulk update
```

### Middleware

#### 1. `middlewares/uploadMiddleware.js`
Multer configuration for image uploads:

**Features:**
- Local file storage in `/uploads/products/`
- File validation (only image types)
- Size limit: 5MB per file
- Unique filename generation with timestamp
- Automatic directory creation
- MIME type validation

**Supported Formats:** JPEG, PNG, WebP, GIF

#### 2. `middlewares/validation/productValidation.js`
Product data validation:

**Validators:**
- `validateProductCreate()` - Validate create request (required fields)
- `validateProductUpdate()` - Validate update request (optional fields)
- `validateProductSearch()` - Validate search query
- `validatePagination()` - Validate page/limit parameters

**Rules:**
- Title: 3-200 characters, required
- Description: 10+ characters, required
- Price: positive number, required
- Stock: non-negative number, required
- SKU: required, unique

#### 3. `middlewares/validation/categoryValidation.js`
Category data validation:

**Validators:**
- `validateCategoryCreate()` - Create validation
- `validateCategoryUpdate()` - Update validation (all optional)

**Rules:**
- Name: 2-100 characters, alphanumeric + spaces/hyphens
- Description: max 500 characters
- isActive: boolean

### Utilities

#### `utils/fileHelper.js`
File management utilities:

**Functions:**
- `deleteFile(filePath)` - Delete single file
- `deleteFiles(filePaths)` - Delete multiple files
- `getFileExtension(filename)` - Get file extension
- `getFileBaseName(filename)` - Get filename without extension
- `fileExists(filePath)` - Check file existence
- `cleanupOldFiles(dir, hours)` - Remove old files
- `getFileSize(filePath)` - Get file size in bytes
- `formatFileSize(bytes)` - Human-readable size
- `ensureDirectoryExists(path)` - Create directory if needed

### Models

#### `models/Product.js` (Already Complete)
Includes:
- Title, description, slug
- Pricing (price, MRP, discount calculation)
- Inventory (stock, SKU)
- Category reference
- Multiple images with alt text
- Status (active, inactive, out_of_stock)
- Ratings and reviews
- SEO metadata
- Featured flag
- Auto-generated slug
- Text indexes for search
- Stock management methods

#### `models/Category.js` (Already Complete)
Includes:
- Name, slug, description
- Hierarchy support (parent-child)
- Media (image, icon)
- Active status
- SEO metadata
- Timestamps

### Database Indexes

The Product model includes indexes for:
- `slug` - Unique
- `sku` - Unique
- `category` - For filtering
- `brand` - For filtering
- `status` - For filtering
- `ratings.average` - For sorting
- `isFeatured, status` - Compound for featured products

---

## Integration Steps

### 1. Update app.js

Import the new routes at the top:
```javascript
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
```

Register routes before error handler:
```javascript
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
```

### 2. Ensure Dependencies

Required packages (should already be installed):
```json
{
  "multer": "^1.4.5",
  "mongoose": "^7.0.0 or above",
  "express": "^4.18.0 or above"
}
```

### 3. Directory Structure

Ensure this structure exists:
```
project/
├── uploads/
│   └── products/          (Auto-created by middleware)
├── controllers/
│   ├── productController.js
│   └── categoryController.js
├── routes/
│   ├── productRoutes.js
│   └── categoryRoutes.js
├── middlewares/
│   ├── uploadMiddleware.js
│   └── validation/
│       ├── productValidation.js
│       └── categoryValidation.js
├── utils/
│   └── fileHelper.js
├── models/
│   ├── Product.js
│   └── Category.js
└── app.js
```

---

## API Usage Examples

### Create Product with Images
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer eyJhbGc..." \
  -F "title=Wireless Headphones" \
  -F "description=High-quality wireless headphones with noise cancellation" \
  -F "price=2999" \
  -F "mrp=4999" \
  -F "category=<category_id>" \
  -F "stock=50" \
  -F "sku=WH001" \
  -F "brand=AudioPro" \
  -F "isFeatured=true" \
  -F "images=@headphones1.jpg" \
  -F "images=@headphones2.jpg"
```

### Search Products
```bash
curl "http://localhost:5000/api/products?search=laptop&minPrice=30000&maxPrice=80000&sort=-price&limit=20"
```

### Get Featured Products
```bash
curl "http://localhost:5000/api/products/featured?limit=8"
```

### Create Category
```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Electronics",
    "description": "Electronic devices and gadgets",
    "icon": "https://icons.com/electronics.svg",
    "image": "https://images.com/electronics.jpg"
  }'
```

### Get Products by Category
```bash
curl "http://localhost:5000/api/products/category/<category_id>?page=1&limit=12&sort=-createdAt"
```

### Admin Dashboard Stats
```bash
curl http://localhost:5000/api/products/stats/dashboard \
  -H "Authorization: Bearer eyJhbGc..."
```

---

## Key Features

### 1. Image Upload
- Multer middleware handles file validation
- Automatic directory creation
- Unique filenames with timestamps
- Size limit: 5MB per image
- Supported formats: JPEG, PNG, WebP, GIF

### 2. Search & Filtering
- Text search on title, description, brand
- Category filtering
- Price range filtering
- Stock status filtering
- Featured products filter

### 3. Pagination
- Page and limit parameters
- Configurable items per page (1-100)
- Returns pagination metadata

### 4. Sorting
- Ascending/descending order
- Multiple field sorting
- Default sort by creation date

### 5. Admin Features
- Product creation with images
- Bulk operations
- Product statistics
- Category management
- Soft delete (status-based)

### 6. Data Validation
- Server-side validation for all inputs
- Custom error messages
- Type checking
- Length validation
- Uniqueness checking (SKU, slug)

### 7. File Management
- Delete files on product/image deletion
- Cleanup old files utility
- File size formatting
- Directory management

---

## Error Handling

All errors follow ApiError format:
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "errors": {
    "field": "Field-specific error"
  }
}
```

Common errors handled:
- Missing required fields
- Invalid data types
- Duplicate SKU/slug
- Category not found
- File upload validation failures
- Unauthorized access (not admin)
- Product not found

---

## Authentication

Admin-only endpoints require:
1. Valid JWT token in Authorization header
2. `Authorization: Bearer <token>`
3. User role must be 'admin'

Example protected route:
```javascript
router.post('/', authenticate, authorize('admin'), uploadProductMiddleware.array('images', 5), validateProductCreate, createProduct);
```

---

## Production Considerations

### 1. File Storage
- Consider cloud storage (AWS S3, Cloudinary) for production
- Implement backup strategy
- Optimize image compression

### 2. Database
- Create indexes on frequently queried fields (already done)
- Monitor query performance
- Consider database backups

### 3. Security
- Implement rate limiting
- Add CSRF protection
- Validate all file uploads
- Sanitize user inputs

### 4. Performance
- Implement caching for product lists
- Use CDN for images
- Paginate large result sets
- Lazy load product details

### 5. Monitoring
- Log file operations
- Monitor disk space usage
- Track upload errors
- Monitor API response times

---

## Testing Checklist

- [ ] Create product with single image
- [ ] Create product with multiple images
- [ ] Update product with new images
- [ ] Delete product image
- [ ] Search products by text
- [ ] Filter by category
- [ ] Filter by price range
- [ ] Sort by price/rating/date
- [ ] Pagination works correctly
- [ ] Get featured products
- [ ] Get product by slug
- [ ] Create category
- [ ] Update category
- [ ] Delete category (with product validation)
- [ ] Get admin stats
- [ ] Unauthorized user cannot create product
- [ ] Invalid file type rejected
- [ ] File size limit enforced
- [ ] Duplicate SKU rejected

---

## Future Enhancements

1. **Product Variants** - Size, color options
2. **Advanced Search** - Elasticsearch integration
3. **Product Reviews** - Rating and comment system
4. **Wishlist** - User wishlist functionality
5. **Bulk Operations** - Import/export products
6. **Image Optimization** - Auto-resize and compress
7. **Inventory Alerts** - Low stock notifications
8. **Related Products** - Recommendation engine
9. **Product Comparison** - Compare multiple products
10. **Dynamic Pricing** - Seasonal discounts

---

## Support & Documentation

For complete API documentation, see: `PRODUCT_MANAGEMENT_API.md`

For quick reference: Check Postman collection or API endpoint list in this file.
