# Product Management System - API Documentation

## Overview

Complete product and category management system with admin capabilities for creating, updating, and managing products with image uploads, filtering, and search functionality.

---

## Product Endpoints

### 1. Get All Products (Public)
```
GET /api/products
```

**Query Parameters:**
- `page` (number, default: 1) - Pagination page number
- `limit` (number, default: 12, max: 100) - Items per page
- `search` (string) - Search in title, description, and short description
- `category` (ObjectId) - Filter by category ID
- `minPrice` (number) - Minimum price filter
- `maxPrice` (number) - Maximum price filter
- `stock` (string) - Filter by stock status: `in_stock`, `out_of_stock`
- `sort` (string, default: `-createdAt`) - Sort field and order (e.g., `-price`, `title`)
- `isFeatured` (boolean) - Show only featured products

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "product_id",
      "title": "Product Title",
      "slug": "product-slug",
      "price": 999,
      "mrp": 1499,
      "discount": 33,
      "stock": 10,
      "thumbnail": "/uploads/products/image.jpg",
      "category": { "_id": "cat_id", "name": "Category" },
      "inStock": true,
      "ratings": { "average": 4.5, "count": 120 }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 120,
    "itemsPerPage": 12
  }
}
```

---

### 2. Get Product by ID (Public)
```
GET /api/products/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "product_id",
    "title": "Product Title",
    "description": "Detailed description...",
    "price": 999,
    "mrp": 1499,
    "discount": 33,
    "stock": 10,
    "sku": "SKU123",
    "category": { "_id": "cat_id", "name": "Category" },
    "images": [
      { "url": "/uploads/products/img1.jpg", "altText": "Image 1" },
      { "url": "/uploads/products/img2.jpg", "altText": "Image 2" }
    ],
    "thumbnail": "/uploads/products/img1.jpg",
    "brand": "Brand Name",
    "attributes": [
      { "name": "Color", "value": "Red" },
      { "name": "Size", "value": "L" }
    ],
    "ratings": { "average": 4.5, "count": 120 },
    "reviews": [],
    "seo": {},
    "createdBy": { "_id": "user_id", "name": "Admin" }
  }
}
```

---

### 3. Get Product by Slug (Public - SEO Friendly)
```
GET /api/products/slug/:slug
```

**Example:**
```
GET /api/products/slug/amazing-laptop
```

---

### 4. Create Product (Admin Only)
```
POST /api/products
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `title` (string, required) - Product title (3-200 characters)
- `description` (string, required) - Product description (10+ characters)
- `shortDescription` (string, optional) - Short description (max 500 characters)
- `price` (number, required) - Selling price (must be positive)
- `mrp` (number, required) - Original/marked price
- `category` (ObjectId, required) - Category ID
- `brand` (string, optional) - Brand name
- `stock` (number, required) - Stock quantity
- `sku` (string, required) - Unique SKU code
- `images` (file[], optional) - Product images (max 5, each max 5MB)
- `attributes` (JSON string, optional) - Product attributes
- `seo` (JSON string, optional) - SEO metadata
- `isFeatured` (boolean, optional) - Feature this product

**Example cURL:**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer <token>" \
  -F "title=Laptop Pro" \
  -F "description=High-performance laptop..." \
  -F "price=50000" \
  -F "mrp=60000" \
  -F "category=<category_id>" \
  -F "stock=10" \
  -F "sku=LAPTOP001" \
  -F "images=@image1.jpg" \
  -F "images=@image2.jpg"
```

---

### 5. Update Product (Admin Only)
```
PUT /api/products/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:** (All fields optional)
- `title` - Product title
- `description` - Product description
- `shortDescription` - Short description
- `price` - Selling price
- `mrp` - Original price
- `category` - Category ID
- `brand` - Brand name
- `stock` - Stock quantity
- `attributes` - Product attributes (JSON)
- `seo` - SEO metadata (JSON)
- `isFeatured` - Featured status
- `images` - New product images (replaces existing)

---

### 6. Delete Product (Admin Only - Soft Delete)
```
DELETE /api/products/:id
Authorization: Bearer <token>
```

**Note:** Sets product status to "inactive" instead of hard delete.

---

### 7. Upload Product Images (Admin Only)
```
POST /api/products/:id/images
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `images` (file[], required) - Image files (max 5, each max 5MB)

---

### 8. Delete Product Image (Admin Only)
```
DELETE /api/products/:id/images/:imageIndex
Authorization: Bearer <token>
```

**Parameters:**
- `id` - Product ID
- `imageIndex` - Index of image in the images array (0-based)

---

### 9. Search Products (Public)
```
GET /api/products/search/query
```

**Query Parameters:**
- `q` (string, required, min 2 chars) - Search query
- `limit` (number, default: 10) - Results limit

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "product_id",
      "title": "Product Title",
      "slug": "product-slug",
      "thumbnail": "/uploads/products/image.jpg",
      "price": 999,
      "discount": 33
    }
  ]
}
```

---

### 10. Get Products by Category (Public)
```
GET /api/products/category/:categoryId
```

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 12)
- `sort` (string, default: `-createdAt`)

---

### 11. Get Featured Products (Public)
```
GET /api/products/featured
```

**Query Parameters:**
- `limit` (number, default: 8) - Number of featured products

---

### 12. Get Product Statistics (Admin Only)
```
GET /api/products/stats/dashboard
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalProducts": 150,
    "activeProducts": 140,
    "inactiveProducts": 5,
    "outOfStock": 5,
    "lowStockProducts": 12,
    "averagePrice": 2500.50
  }
}
```

---

## Category Endpoints

### 1. Get All Categories (Public)
```
GET /api/categories
```

**Query Parameters:**
- `active` (boolean, default: false) - Show only active categories

---

### 2. Get Category by ID (Public)
```
GET /api/categories/:id
```

---

### 3. Get Category by Slug (Public)
```
GET /api/categories/slug/:slug
```

---

### 4. Create Category (Admin Only)
```
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Electronics",
  "description": "Electronic devices...",
  "icon": "icon_url",
  "image": "image_url"
}
```

---

### 5. Update Category (Admin Only)
```
PUT /api/categories/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:** (All optional)
```json
{
  "name": "New Name",
  "description": "New description",
  "icon": "new_icon_url",
  "image": "new_image_url",
  "isActive": true
}
```

---

### 6. Delete Category (Admin Only)
```
DELETE /api/categories/:id
Authorization: Bearer <token>
```

**Note:** Cannot delete if category has associated products.

---

### 7. Get Categories with Product Count (Admin Only)
```
GET /api/categories/stats/count
Authorization: Bearer <token>
```

---

### 8. Bulk Update Category Status (Admin Only)
```
PUT /api/categories/bulk/status
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "categoryIds": ["category_id_1", "category_id_2"],
  "isActive": true
}
```

---

## Error Responses

All endpoints follow standard error response format:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message here",
  "errors": {
    "field": "Specific field error"
  }
}
```

**Common Status Codes:**
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## Image Upload Details

### Supported Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- GIF (.gif)

### Size Limits
- Max 5MB per image
- Max 5 images per request

### File Storage
- Location: `/uploads/products/`
- Naming: `{filename}-{timestamp}.{ext}`
- Access: `/uploads/products/{filename}`

---

## Authentication

All admin endpoints require authentication via JWT token in Authorization header:

```
Authorization: Bearer <jwt_token>
```

Token obtained from `/api/auth/login` endpoint.

---

## Pagination

List endpoints return pagination info:

```json
{
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 120,
    "itemsPerPage": 12
  }
}
```

---

## Sorting

Use `sort` parameter to order results:
- Ascending: `fieldname` (e.g., `price`)
- Descending: `-fieldname` (e.g., `-price`)
- Multiple: `field1,-field2` (e.g., `category,-createdAt`)

---

## Example Workflows

### Create Product with Images
1. Prepare images (max 5, each max 5MB)
2. POST to `/api/products` with multipart form data
3. Returns created product with image URLs

### Search and Filter
1. GET `/api/products?search=laptop&minPrice=30000&maxPrice=80000&sort=-price`
2. Returns filtered products with pagination

### Manage Product Images
1. Create product initially with 1-2 images
2. Later, POST to `/api/products/:id/images` to add more
3. DELETE specific images with `/api/products/:id/images/:index`

### Admin Dashboard Stats
1. GET `/api/products/stats/dashboard` for product overview
2. GET `/api/categories/stats/count` for category details
3. Use stats to display admin dashboard metrics

---

## Rate Limiting

Currently no rate limiting configured. Consider adding for production.

---

## Next Steps

1. Test all endpoints with Postman collection
2. Implement frontend product listing page
3. Add product review system
4. Implement wishlist functionality
5. Add product variants support
6. Create admin product management dashboard
