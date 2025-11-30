# SingleSeller E-commerce Platform

SingleSeller is a full‑stack single‑seller e‑commerce application built with a modular Express + MongoDB backend and a modern React (Vite + Tailwind CSS) frontend. It supports product browsing, cart & checkout, order lifecycle management, and an admin dashboard for store operations.

## Tech Stack
- Backend: Node.js, Express, MongoDB, Mongoose, JWT Auth, Multer (uploads), Express Validator
- Frontend: React 18, Vite, React Router, Tailwind CSS, Axios, React Hot Toast
- State Management: React Context (Auth, Product, Cart, Admin views)
- Build Tools: Vite (frontend), Nodemon (backend dev)

## Core Features
- User authentication & profile management
- Product catalog with search, filtering, pagination & image uploads
- Shopping cart with optimistic updates
- Checkout flow (address, payment method selection, review)
- Order creation, status timeline & cancellation rules
- Admin dashboard (stats, product CRUD, order management, category management)

## Folder Structure
```
Singleseller/
	Backend/
		controllers/       # Route handlers (auth, product, category, cart, order, admin)
		models/            # Mongoose schemas (User, Product, Category, Cart, Order)
		middlewares/       # Auth, validation, upload, error handler
		routes/            # Express routers for each resource
		utils/             # Helpers (ApiError, fileHelper)
		uploads/           # Uploaded product images
		config/            # DB connection & env config
		server.js          # Backend server bootstrap
		app.js             # Express app config & route mounting
		.env.example       # Example environment variables
	Frontend/
		src/
			components/      # Reusable UI + admin components
			pages/           # Route pages (public, auth, cart, checkout, admin)
			context/         # React context providers
			services/        # API service wrappers (axios)
			utils/           # Utility functions
			assets/          # Static assets/placeholders
			App.jsx          # App root
		.env.example       # Example frontend env (VITE_API_URL)
	README.md
```

## Environment Variables

Backend `.env` (copy from `.env.example`):
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=change_this_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173/
```

Frontend `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

## Installation
Prerequisites: Node.js (>=18), MongoDB running locally.

Clone repository:
```
git clone https://github.com/VISHALX33/Singleseller.git
cd Singleseller
```

Install backend dependencies:
```
cd Backend
npm install
cp .env.example .env
```

Install frontend dependencies:
```
cd ../Frontend
npm install
cp .env.example .env
```

## Running the Project

Start backend (port 5000):
```
cd Backend
npm run dev
```

Start frontend (port 5173):
```
cd Frontend
npm run dev
```

Access frontend: `http://localhost:5173`

### Generate Local Product Images
This project uses locally generated SVG images per product slug for display when no uploaded images exist.

Generate images (reads products from DB, writes to `Frontend/public/assets`):
```
cd Backend
npm run gen-images
```
Then restart the frontend to pick up assets if needed.

### Seed Products From Asset Filenames
If you place image files inside `Frontend/public/assets` and want corresponding products:
```
cd Backend
npm run seed-assets
```
This script derives a slug from each filename (excluding extension), creates a product with random price/stock if it does not already exist. Existing slugs are skipped.

## NPM Scripts
Backend:
- `npm start` – run server
- `npm run dev` – nodemon development watcher
- `npm test` – run test notifications stub

Frontend:
- `npm run dev` – start Vite dev server
- `npm run build` – production build
- `npm run preview` – preview built assets

## API Overview (High-Level)

Base URL: `http://localhost:5000/api`

Auth:
- `POST /auth/register` – create account
- `POST /auth/login` – login (JWT)
- `GET /auth/profile` – get current user
- `PUT /auth/profile` – update profile
- `PUT /auth/change-password` – change password

Products:
- `GET /products` – list (query: page, limit, search, category, minPrice, maxPrice, status)
- `GET /products/:id` – product detail
- `POST /products` (admin) – create (multipart)
- `PUT /products/:id` (admin) – update
- `DELETE /products/:id` (admin) – soft delete
- `POST /products/:id/images` (admin) – upload multiple images

Categories:
- `GET /categories`
- `POST /categories` (admin)
- `PUT /categories/:id` (admin)
- `DELETE /categories/:id` (admin)

Cart (auth):
- `GET /cart` – get cart
- `POST /cart/add` – add item
- `PUT /cart/item/:itemId` – update quantity
- `DELETE /cart/item/:itemId` – remove item
- `DELETE /cart/clear` – clear cart

Orders (auth):
- `POST /orders` – create order from cart
- `GET /orders` – list user (admin: all)
- `GET /orders/:id` – get order detail
- `PUT /orders/:id/status` (admin) – update status
- `PUT /orders/:id/cancel` – cancel (user before shipped)

Admin:
- `GET /admin/stats` – dashboard metrics

## Development Notes
- Cart uses optimistic UI updates; backend authoritative state re-sync on error.
- Order creation runs in a transaction (stock deduction + cart clear).
- Product soft delete sets status to `inactive` rather than removing document.
- Image uploads use Multer with basic validation; consider moving to cloud storage later.

## Test Notifications Stub
Run backend test script:
```
cd Backend
npm test
```
This simulates order status changes and placeholder email notifications via `console.log`.

## Future Enhancements
- Payment gateway integration (Razorpay test → live)
- Address persistence in user profile
- Server-side pagination for large admin datasets
- Image management & CDN storage
- Improved analytics (charts, trends)

## License
Internal / Proprietary (add license details if required).

