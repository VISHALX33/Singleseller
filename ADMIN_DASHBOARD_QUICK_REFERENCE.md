# 🎛️ ADMIN DASHBOARD - QUICK REFERENCE GUIDE

## 📍 File Locations

### Core Components
```
frontend/src/components/
├── AdminRoute.jsx                 ← Route protection
└── admin/
    ├── AdminLayout.jsx            ← Main layout wrapper
    ├── AdminSidebar.jsx           ← Navigation sidebar
    ├── StatsCard.jsx              ← Dashboard stat card
    ├── DataTable.jsx              ← Reusable table
    ├── ImageUploadPreview.jsx     ← Image upload with preview
    └── ProductForm.jsx            ← Add/Edit product form
```

### Admin Pages
```
frontend/src/pages/admin/
├── Dashboard.jsx                  ← Overview & stats
├── Products.jsx                   ← Product list
├── AddProduct.jsx                 ← Create product
├── EditProduct.jsx                ← Update product
├── Orders.jsx                     ← Order list
├── OrderDetail.jsx                ← Order details & status
└── Categories.jsx                 ← Category CRUD
```

### Services
```
frontend/src/services/
└── adminService.js                ← All API calls
```

---

## 🚀 Getting Started

### 1. Access Admin Dashboard
```url
http://localhost:3000/admin/dashboard
```

**Requirements**:
- User must be logged in
- User role must be 'admin'
- Valid JWT token in localStorage

### 2. Navigation
- **Sidebar Menu**: Click items to navigate
- **Mobile**: Hamburger icon to toggle
- **Breadcrumbs**: Click to go back
- **Logout**: Button at bottom of sidebar

---

## 📊 Dashboard Page (`/admin/dashboard`)

### Stats Cards (Top)
- **Total Products**: Count of all products
- **Total Revenue**: Sum of all orders (₹)
- **Total Orders**: Count of all orders
- **Total Customers**: Count of users

### Order Status Breakdown
Visual breakdown of orders by status:
- Pending (yellow)
- Confirmed (blue)
- Processing (purple)
- Shipped (indigo)
- Delivered (green)

### Recent Orders Table
Latest 5-10 orders with:
- Order ID
- Customer name
- Order amount
- Status badge
- Order date
- "View All" link

---

## 📦 Products Management

### List Page (`/admin/products`)

**Features**:
- Search by product title or SKU
- Pagination (10 per page)
- Status indicators (In Stock / Out of Stock)
- Edit button → `/admin/products/edit/:id`
- Delete button (with confirmation)
- Add Product button

**Search Example**:
```
Search: "iPhone" or "SKU-001"
```

### Add Product (`/admin/products/add`)

**Form Fields**:
```
Title *                           ← Required
Description *                     ← Required (textarea)
Category *                        ← Required (dropdown)
Selling Price (₹) *              ← Required, minimum 0
MRP (₹)                          ← Optional
Stock Quantity *                  ← Required, minimum 0
SKU *                            ← Required (unique)
Featured Product                  ← Checkbox
Product Images (1-5) *           ← Required
  - Drag & drop
  - Click to upload
  - Remove individual images
```

**Validation**:
- All * fields required
- Images must be at least 1
- Price must be > 0
- Stock must be >= 0
- SKU must be unique

### Edit Product (`/admin/products/edit/:id`)

**Same as Add Product**:
- Pre-fills existing data
- Can modify any field
- Can add/remove images
- Same validation rules

### Delete Product

**Action**:
1. Click Delete button in table
2. Confirm in dialog
3. Product removed instantly
4. Toast notification shows

---

## 📋 Orders Management

### List Page (`/admin/orders`)

**Filters**:
```
Search by Order ID    ← e.g., "ORD-001"
Filter by Status      ← Pending, Confirmed, Processing, etc.
```

**Table Columns**:
- Order ID (sortable)
- Customer (name + email)
- Amount (₹)
- Status (color badge)
- Order Date

**Actions**:
- View → Click to see full details

### Order Detail Page (`/admin/orders/:id`)

**Sections**:

1. **Order Information**
   - Order Number
   - Order Date
   - Customer Name
   - Customer Email

2. **Order Items Table**
   - Product image & title
   - Quantity
   - Price per unit
   - Total for item

3. **Shipping Address**
   - Full address
   - Phone number
   - Email address

4. **Update Status (Sidebar)**
   - Current status (color badge)
   - Dropdown to select new status
   - Optional comment field
   - Update button

5. **Order Summary (Sidebar)**
   - Subtotal
   - Tax (5%)
   - Shipping
   - **Total**

6. **Payment Information**
   - Payment method (COD, Card, etc.)

---

## 🏷️ Categories Management (`/admin/categories`)

### Add Category

**Button**: "Add Category" (top right)

**Form Fields**:
```
Category Name *       ← Required
Description          ← Optional (textarea)
```

**Action**: Click "Create"

### View Categories

**Table Columns**:
- Category Name
- Description (first 100 chars)
- Created Date
- Edit/Delete buttons

### Edit Category

1. Click Edit button
2. Form appears with existing data
3. Modify fields
4. Click "Update"

### Delete Category

1. Click Delete button
2. Confirm in dialog
3. Category removed
4. Toast shows confirmation

---

## 🔐 Admin Protection

### How It Works

```javascript
// AdminRoute checks:
✅ User logged in?
✅ User role === 'admin'?
✅ Valid token?

If NO → Redirect to /login or home
If YES → Show admin page
```

### Unauthorized Response

**Non-Admin User**:
- Shows 403 Access Denied page
- Button to go home
- Cannot access admin features

---

## 📱 Responsive Behavior

### Mobile (< 768px)
- Sidebar hidden by default
- Hamburger menu toggle
- Single column layouts
- Tables scroll horizontally
- Forms stack vertically

### Tablet (768px - 1024px)
- Sidebar hidden by default
- 2-column grids
- Adjusted spacing
- Tables scroll horizontally

### Desktop (> 1024px)
- Sidebar always visible
- Full layouts
- Multi-column grids
- Tables fully visible

---

## 🎨 UI Components

### DataTable Component
```javascript
<DataTable
  columns={columns}           // Array of column definitions
  data={data}                 // Array of row objects
  loading={loading}           // Show spinner
  onPageChange={setPage}      // Pagination handler
  totalPages={totalPages}     // Total pages
  currentPage={page}          // Current page
  actions={actions}           // Action buttons
/>
```

**Column Definition**:
```javascript
{
  key: 'title',              // Object property
  label: 'Product',          // Column header
  sortable: true,            // Optional sorting
  render: (value, row) => (  // Optional custom render
    <p>{value}</p>
  )
}
```

### StatsCard Component
```javascript
<StatsCard
  icon={Package}             // lucide-react icon
  label="Products"           // Label text
  value={156}               // Stat value
  change="+12%"             // Optional change text
  color="blue"              // Color: blue, green, purple, orange
/>
```

### ProductForm Component
```javascript
<ProductForm
  initialData={product}     // For edit mode
  categories={categories}   // Category options
  onSubmit={handleSubmit}   // Form submit handler
  loading={loading}         // Show loading state
  submitLabel="Create"      // Button text
/>
```

---

## 🔄 API Integration

### Get Dashboard Stats
```javascript
import * as adminService from '../../services/adminService';

const stats = await adminService.getDashboardStats();
// Returns: { totalProducts, totalOrders, totalRevenue, ... }
```

### Manage Products
```javascript
// List
const data = await adminService.getProducts(page, 10, search, category);

// Create
const formData = new FormData();
formData.append('title', 'Product Name');
formData.append('images', fileObject);
const product = await adminService.createProduct(formData);

// Update
const updated = await adminService.updateProduct(id, formData);

// Delete
await adminService.deleteProduct(id);
```

### Manage Orders
```javascript
// List
const orders = await adminService.getOrders(page, 10, status, search);

// Get Details
const order = await adminService.getOrderById(id);

// Update Status
const updated = await adminService.updateOrderStatus(id, 'shipped', 'comment');
```

### Manage Categories
```javascript
// List
const categories = await adminService.getCategories(page, 10);

// Create
const cat = await adminService.createCategory('Electronics', 'description');

// Update
const updated = await adminService.updateCategory(id, 'New Name', 'desc');

// Delete
await adminService.deleteCategory(id);
```

---

## 🎯 Common Tasks

### Add a New Product
1. Go to `/admin/products`
2. Click "Add Product"
3. Fill in all * fields
4. Upload images (drag or click)
5. Click "Create Product"
6. Redirected to product list

### Update Order Status
1. Go to `/admin/orders`
2. Click "View" on an order
3. In sidebar, use Status dropdown
4. Optional: Add comment
5. Click "Update Status"
6. Toast shows confirmation

### Create Category
1. Go to `/admin/categories`
2. Click "Add Category"
3. Enter name (required)
4. Optional: Description
5. Click "Create"
6. Shows in products dropdown

### Search Products
1. Go to `/admin/products`
2. Type in search box
3. Auto-filters by title/SKU
4. Shows matching results

### Filter Orders
1. Go to `/admin/orders`
2. Select status from dropdown
3. Results update automatically
4. Shows only orders with that status

---

## ⚙️ Configuration

### Change API URL
Edit `services/adminService.js`:
```javascript
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

Set in `.env`:
```
REACT_APP_API_URL=https://api.yourdomain.com/api
```

### Customize Admin Colors
Edit any admin component, change Tailwind colors:
```javascript
// From:
className="bg-blue-600"
// To:
className="bg-purple-600"
```

### Change Items Per Page
Edit `DataTable.jsx`:
```javascript
// From: limit 10
// To:
const limit = 20;
```

---

## 🐛 Troubleshooting

### "Access Denied" Error
- Check if user is admin
- Verify JWT token in localStorage
- Try logging out and back in

### Images Not Uploading
- Check file size < 5MB
- Check browser console for errors
- Verify multipart/form-data in API

### Table Not Loading
- Check API endpoint
- Verify auth token
- Check network tab in dev tools
- Verify response format

### Form Validation Errors
- Check all * fields filled
- Phone must be 10 digits
- Postal code must be 6 digits
- Prices must be > 0

---

## 📞 Quick Links

| Task | URL |
|------|-----|
| Dashboard | `/admin/dashboard` |
| Products | `/admin/products` |
| Add Product | `/admin/products/add` |
| Orders | `/admin/orders` |
| Categories | `/admin/categories` |

---

## 🎊 You're All Set!

Your admin dashboard is complete and ready to use. Access `/admin/dashboard` with an admin account to get started!

**Next Steps**:
1. Ensure backend APIs are ready
2. Test with admin account
3. Verify all features working
4. Deploy to production
5. Monitor for issues

---

**Last Updated**: Current Session  
**Version**: 1.0
