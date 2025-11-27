# Product Management API - Postman Collection Reference

## Collection Structure

### Base URL
```
http://localhost:5000
```

### Authentication
All admin endpoints require:
```
Authorization: Bearer {{token}}
```

Get token from login: `POST /api/auth/login`

---

## Folder: Products - Public

### 1. Get All Products
```
GET /api/products
```

**Params:**
```
page: 1
limit: 12
search: (optional)
category: (optional, category_id)
minPrice: (optional)
maxPrice: (optional)
stock: in_stock|out_of_stock
sort: -createdAt (or any field with - for desc)
isFeatured: true|false
```

### 2. Get Product by ID
```
GET /api/products/{{product_id}}
```

### 3. Get Product by Slug
```
GET /api/products/slug/{{product_slug}}
```

### 4. Search Products
```
GET /api/products/search/query
```

**Params:**
```
q: laptop (minimum 2 chars)
limit: 10
```

### 5. Get Featured Products
```
GET /api/products/featured
```

**Params:**
```
limit: 8
```

### 6. Get Products by Category
```
GET /api/products/category/{{category_id}}
```

**Params:**
```
page: 1
limit: 12
sort: -createdAt
```

---

## Folder: Products - Admin

### 1. Create Product with Images
```
POST /api/products
Authorization: Bearer {{token}}
Content-Type: multipart/form-data
```

**Form Data (Body):**
```
title: Wireless Headphones (string, required, 3-200 chars)
description: High-quality audio... (string, required, 10+ chars)
shortDescription: Premium headphones (string, optional)
price: 2999 (number, required, positive)
mrp: 4999 (number, required)
category: {{category_id}} (required, valid ObjectId)
brand: AudioPro (string, optional)
stock: 50 (number, required, >= 0)
sku: WH001 (string, required, unique)
isFeatured: true (boolean, optional)
attributes: [{"name":"Color","value":"Black"}] (JSON string, optional)
seo: {"metaTitle":"...","metaDescription":"..."} (JSON string, optional)
images: (file, optional, max 5 files, 5MB each)
```

### 2. Update Product
```
PUT /api/products/{{product_id}}
Authorization: Bearer {{token}}
Content-Type: multipart/form-data
```

**Form Data (Body):** (all optional)
```
title: Updated Title
description: Updated description
shortDescription: Short desc
price: 2499
mrp: 3999
category: {{category_id}}
brand: NewBrand
stock: 75
attributes: [{"name":"Size","value":"L"}]
seo: {...}
isFeatured: false
images: (new images to replace existing)
```

### 3. Delete Product (Soft Delete)
```
DELETE /api/products/{{product_id}}
Authorization: Bearer {{token}}
```

### 4. Upload Additional Images
```
POST /api/products/{{product_id}}/images
Authorization: Bearer {{token}}
Content-Type: multipart/form-data
```

**Form Data:**
```
images: (file, required, max 5 files, 5MB each)
```

### 5. Delete Specific Image
```
DELETE /api/products/{{product_id}}/images/{{image_index}}
Authorization: Bearer {{token}}
```

**Params:**
```
image_index: 0 (zero-based index)
```

### 6. Get Product Statistics
```
GET /api/products/stats/dashboard
Authorization: Bearer {{token}}
```

---

## Folder: Categories - Public

### 1. Get All Categories
```
GET /api/categories
```

**Params:**
```
active: true|false (optional)
```

### 2. Get Category by ID
```
GET /api/categories/{{category_id}}
```

### 3. Get Category by Slug
```
GET /api/categories/slug/{{category_slug}}
```

---

## Folder: Categories - Admin

### 1. Create Category
```
POST /api/categories
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Electronics",
  "description": "Electronic devices and gadgets",
  "icon": "https://icons.com/electronics.svg",
  "image": "https://images.com/electronics.jpg"
}
```

### 2. Update Category
```
PUT /api/categories/{{category_id}}
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body:** (all optional)
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "icon": "new_icon_url",
  "image": "new_image_url",
  "isActive": true
}
```

### 3. Delete Category
```
DELETE /api/categories/{{category_id}}
Authorization: Bearer {{token}}
```

### 4. Get Categories with Product Count
```
GET /api/categories/stats/count
Authorization: Bearer {{token}}
```

### 5. Bulk Update Category Status
```
PUT /api/categories/bulk/status
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body:**
```json
{
  "categoryIds": ["cat_id_1", "cat_id_2", "cat_id_3"],
  "isActive": true
}
```

---

## Environment Variables

Set these in Postman environment:

```
base_url: http://localhost:5000
token: (jwt token from login)
product_id: (existing product id)
category_id: (existing category id)
product_slug: (product slug)
category_slug: (category slug)
image_index: 0
```

---

## Pre-Request Scripts

### Generate Timestamp
```javascript
pm.environment.set("timestamp", Date.now());
```

### Get Token
```javascript
const token = pm.environment.get("token");
if (!token) {
  console.log("Please login first and set token in environment");
}
```

---

## Tests / Assertions

### Success Response
```javascript
pm.test("Status is 200 or 201", function () {
    pm.expect(pm.response.code).to.be.oneOf([200, 201]);
});

pm.test("Response has success true", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.equal(true);
});
```

### Error Response
```javascript
pm.test("Status is 4xx or 5xx", function () {
    pm.expect(pm.response.code).to.be.above(399);
});

pm.test("Response has success false", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.equal(false);
});
```

---

## Sample Test Workflows

### Workflow 1: Complete Product Creation Flow
1. Create category (POST /api/categories)
2. Create product with images (POST /api/products)
3. Get product by ID (GET /api/products/:id)
4. Update product (PUT /api/products/:id)
5. Upload more images (POST /api/products/:id/images)
6. Get all products (GET /api/products)
7. Delete image (DELETE /api/products/:id/images/0)
8. Delete product (DELETE /api/products/:id)

### Workflow 2: Search and Filter
1. Create multiple categories
2. Create products in different categories
3. Search products (GET /api/products/search/query)
4. Filter by category (GET /api/products?category=catId)
5. Filter by price (GET /api/products?minPrice=1000&maxPrice=5000)
6. Get featured (GET /api/products/featured)

### Workflow 3: Admin Dashboard
1. Get product stats (GET /api/products/stats/dashboard)
2. Get categories with count (GET /api/categories/stats/count)
3. Bulk update categories (PUT /api/categories/bulk/status)

---

## Common Error Codes

| Code | Message | Solution |
|------|---------|----------|
| 400 | Title is required | Provide title (min 3 chars) |
| 400 | Price must be positive | Provide valid price |
| 400 | Category not found | Use valid category ID |
| 400 | SKU already exists | Use unique SKU |
| 400 | File size exceeds 5MB | Upload smaller image |
| 401 | Unauthorized | Add valid Authorization header |
| 403 | Forbidden | User must be admin |
| 404 | Product not found | Use valid product ID |
| 409 | Conflict | Duplicate entry (SKU, slug, name) |

---

## Tips & Tricks

### 1. Testing without Admin
- Create product as user → Get 403 Forbidden
- Verify authorization is enforced

### 2. Image Upload Testing
- Use various image formats (JPG, PNG, WebP)
- Test max 5MB limit with oversized file
- Test invalid file types

### 3. Pagination Testing
- Test page: 1, 2, 3...
- Test different limits: 1, 12, 50, 100
- Verify totalPages calculation

### 4. Search Testing
- Test single word: "laptop"
- Test multiple words: "gaming laptop"
- Test short query (< 2 chars) → should fail

### 5. Filter Combination
- Multiple filters together: category + price + stock
- Featured + category combination

---

## Quick Copy-Paste Examples

### Create Product cURL
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer {{token}}" \
  -F "title=Laptop" \
  -F "description=Gaming laptop with RTX 4070" \
  -F "price=80000" \
  -F "mrp=100000" \
  -F "category={{category_id}}" \
  -F "stock=10" \
  -F "sku=LAPTOP001" \
  -F "images=@image1.jpg"
```

### Search Products cURL
```bash
curl "http://localhost:5000/api/products?search=laptop&minPrice=50000&maxPrice=100000&sort=-price"
```

### Create Category cURL
```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Authorization: Bearer {{token}}" \
  -H "Content-Type: application/json" \
  -d '{"name":"Electronics","description":"Electronic devices"}'
```

---

## Importing into Postman

1. Copy entire collection structure
2. In Postman: Click Import
3. Paste as raw text
4. Choose "Postman Collection"
5. Set environment variables
6. Start testing!

---

## Performance Considerations

- **Default limit:** 12 products per page
- **Max limit:** 100 products per page
- **Search min length:** 2 characters
- **Image upload:** Max 5MB per file, 5 files per request
- **Pagination:** 1-based indexing
- **Sort:** Default newest first (-createdAt)

---

## API Versioning

Current version: **1.0.0**

Future versions will maintain backward compatibility or provide migration guides.

---

## Support

For issues or questions:
1. Check PRODUCT_MANAGEMENT_API.md for detailed documentation
2. Review PRODUCT_MANAGEMENT_IMPLEMENTATION.md for technical details
3. Check error response message for specific field errors
4. Verify Authorization header contains valid JWT token
