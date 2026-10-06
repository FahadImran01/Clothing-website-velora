# VELORA — Premium Clothing Brand E-Commerce Platform

A full-stack MERN e-commerce application for a fictional premium clothing
brand, VELORA, with a complete customer storefront and a separate admin
dashboard.

## Tech Stack

**Frontend:** React 18, Vite, React Router, Axios, Framer Motion, Recharts, react-hot-toast, react-icons
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT auth, bcrypt

## Project Structure

```
velora/
  server/     — Express + MongoDB REST API
  client/     — React + Vite frontend (storefront + admin)
```

## 1. Prerequisites

- Node.js 18+ and npm
- A MongoDB database — either:
  - Local MongoDB running at `mongodb://127.0.0.1:27017`, or
  - A free MongoDB Atlas cluster (recommended if you don't have Mongo installed)

## 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Open `.env` and set:

```
MONGO_URI=mongodb://127.0.0.1:27017/velora     # or your Atlas connection string
JWT_SECRET=some_long_random_string
JWT_EXPIRE=30d
PORT=5000
CLIENT_URL=http://localhost:5173

ADMIN_NAME=Admin User
ADMIN_EMAIL=admin@velora.com
ADMIN_PASSWORD=Admin@12345
```

**Seed the database** (creates categories, 8 sample products, and the first
admin account using the `ADMIN_*` values above):

```bash
npm run seed
```

You can wipe products/categories later (without deleting user accounts) with:

```bash
npm run seed:destroy
```

**Start the backend:**

```bash
npm run dev      # with nodemon (auto-restart)
# or
npm start        # plain node
```

The API will run at `http://localhost:5000`. Visit `http://localhost:5000/`
in a browser — you should see `{"message": "VELORA API is running"}`.

## 3. Frontend Setup

In a new terminal:

```bash
cd client
npm install
cp .env.example .env
```

`.env` should contain:

```
VITE_API_URL=http://localhost:5000/api
```

**Start the frontend:**

```bash
npm run dev
```

The storefront will run at `http://localhost:5173`.

## 4. Logging In

**Customer:** Register a new account at `/register`, or log in at `/login`.

**Admin:** You can log in as admin from **either** place:
- The dedicated admin login at `http://localhost:5173/admin/login`, or
- The regular customer login at `http://localhost:5173/login` — logging in
  there with the admin email/password automatically redirects you to
  `/admin` instead of the customer account page. The navbar's account icon
  also detects an admin session and links straight to `/admin`.

Use the `ADMIN_EMAIL` / `ADMIN_PASSWORD` from your `.env` (seeded
automatically). The `/admin` dashboard is only reachable by an
authenticated user whose role is `admin` — regular customers are
redirected away.

## 5. What's Included

### Customer Storefront
Home, Shop (search/filter/sort/pagination), Men, Women, New Arrivals, Sale,
Product Details (gallery, size guide, reviews), Cart, **Checkout — supports
both logged-in customers and guests** (with coupon codes, Cash on Delivery /
Card placeholder), an Order Confirmation page after checkout, Login,
Register, My Account, Order History (with a visual status timeline, order
cancellation, and return requests on delivered orders), Track Order (public
— look up any order by Order ID + checkout email, no account required, with
the same cancel/return actions available to guests), Wishlist, About Us,
Contact Us — all responsive, with Framer Motion animations, skeleton
loaders, and toast notifications.

### Admin Dashboard (`/admin`)
Sidebar navigation to: Dashboard (stat cards incl. pending returns + sales/
orders charts + top products), Products (full CRUD with a modal form,
multi-image upload, color/size fields, search), Categories (CRUD), Orders
(status updates, order detail modal — shows "Guest" for orders placed
without an account), Inventory (stock status, increase/decrease/set stock,
low-stock alerts, SKU search), Customers (search, order history per
customer, enable/disable accounts), Reviews (approve/delete), Coupons
(CRUD), **Returns** (review and update the status of customer return
requests: Pending → Approved/Rejected → Refunded), **Activity Log** (a
read-only audit trail of admin actions — who changed what, across products,
categories, orders, coupons, customers, reviews, inventory, and returns),
Settings (admin profile). All destructive actions require confirmation, and
you can log in as admin from either `/admin/login` or the regular `/login`
page.

### Backend API

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/admin/login
GET    /api/auth/me
PUT    /api/auth/me

GET    /api/products
GET    /api/products/:id
POST   /api/products          (admin)
PUT    /api/products/:id      (admin)
DELETE /api/products/:id      (admin)

GET    /api/categories
POST   /api/categories        (admin)
PUT    /api/categories/:id    (admin)
DELETE /api/categories/:id    (admin)

GET    /api/orders               (admin — all orders)
GET    /api/orders/my-orders     (customer's own orders)
GET    /api/orders/track/:id     (public — requires ?email= matching checkout email)
GET    /api/orders/:id
POST   /api/orders                (guest checkout supported — login optional)
PUT    /api/orders/:id/cancel     (owner, guest w/ matching email, or admin — only while Pending/Confirmed)
PUT    /api/orders/:id            (admin — update status)

POST   /api/returns              (owner or guest w/ matching email — only on Delivered orders)
GET    /api/returns              (admin)
PUT    /api/returns/:id          (admin — update status: Pending/Approved/Rejected/Refunded)

GET    /api/activity-logs        (admin — last 200 admin actions)

GET    /api/users             (admin)
GET    /api/users/:id         (admin)
PUT    /api/users/:id/status  (admin — enable/disable)
GET    /api/users/me/wishlist
PUT    /api/users/me/wishlist/:productId
POST   /api/users/me/addresses
DELETE /api/users/me/addresses/:addressId

GET    /api/reviews
POST   /api/reviews
PUT    /api/reviews/:id/approve  (admin)
DELETE /api/reviews/:id          (admin)

GET    /api/coupons                 (admin)
GET    /api/coupons/validate/:code
POST   /api/coupons                 (admin)
PUT    /api/coupons/:id             (admin)
DELETE /api/coupons/:id             (admin)

GET    /api/inventory         (admin)
PUT    /api/inventory/:id     (admin)

GET    /api/dashboard         (admin)

POST   /api/upload            (admin — multipart/form-data, field name "images", up to 8 files)
```

Protected routes require `Authorization: Bearer <token>`. Admin-only routes
additionally check `role === 'admin'`.

## 6. Notes & Limitations

- **Guest checkout** places an order with `user: null` on the Order
  document. Guests can't see an Order History (there's no account to tie it
  to), so they're directed to the Track Order page after checkout, and
  given the chance to cancel the order or request a return from there using
  their Order ID + the email they checked out with. A logged-in customer's
  own orders still show in their Order History with the same actions built
  in.
- **Order cancellation** is only allowed while an order is still `Pending`
  or `Confirmed`; once it's `Processing` or later, the cancel option
  disappears. Cancelling restocks the items automatically.
- **Return requests** are only available on `Delivered` orders, one request
  per order. They don't change the order's own status — admins manage them
  separately on the Returns page (Pending → Approved/Rejected → Refunded).
- **Activity Log** entries are written server-side whenever an admin
  action succeeds; a logging failure never blocks the actual request, it's
  purely best-effort record-keeping.
- **Card payment** at checkout is a disabled placeholder UI, as requested —
  no real payment processor is wired in. Cash on Delivery fully creates a
  real order.
- **Product images** are uploaded directly from the admin Products form —
  drag-and-drop or click to select multiple files (JPG/PNG/WEBP/GIF, up to
  8 images, 5MB each). Files are stored on the server in `server/uploads/`
  and served at `http://localhost:5000/uploads/<filename>`; the returned
  URLs are what get saved on the product. The seed script still uses
  Unsplash URLs directly for its sample products, which works fine since
  the `images` field just stores plain URLs either way. Swapping in cloud
  storage (S3/Cloudinary) later just means changing where
  `POST /api/upload` writes files and what URL it returns — the rest of
  the app doesn't need to change.
- **Stock decrements** automatically when an order is placed, and inventory
  status (`IN STOCK` / `LOW STOCK` / `OUT OF STOCK`) is derived live from the
  `stock` field, both on the product model (virtual) and in the admin
  inventory view.
- Both frontend and backend were installed and build/run-tested during
  development (`npm run build` on the client succeeds; the server starts
  cleanly and only fails to connect without a real `MONGO_URI`, as expected).

## 7. Production Build

```bash
cd client
npm run build     # outputs to client/dist — serve with any static host
```

Deploy `server/` to any Node host (Render, Railway, Fly.io, a VPS, etc.),
set the same environment variables there, and point `VITE_API_URL` in the
frontend `.env` at your deployed backend's URL before building.
