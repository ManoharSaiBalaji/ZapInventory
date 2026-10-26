# ZapInventory — Admin Login & Quick Start

## Admin Login (Local Demo)

Use these credentials to sign in as the administrator **after completing the setup steps below**:

- **Login page:** `http://localhost:5173/login`
- **Email:** `admin@zapinventory.com`
- **Password:** `Admin@1234`
- **Role:** `admin`

**Important:** These are the default credentials created by the admin setup script. They will work only after you configure the MongoDB connection in `server/.env` and run `node scripts/createAdmin.js` from the `server` directory. Then seed the sample products if needed and start both the backend and frontend using the instructions in this README. This is a local demo login, not a hosted website login.

---


# ZapInventory — Full Stack Inventory & Stock Management System

A modern, full-stack MERN (MongoDB, Express.js, React, Node.js) web application designed for electronic product inventory management with **automatic real-time stock deduction**.

Built as a college Full Stack Development project following industry-standard patterns, clean code architecture, and a dark-mode user interface.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Application Architecture](#application-architecture)
5. [Project Folder Structure](#project-folder-structure)
6. [Prerequisites & Required Software](#prerequisites--required-software)
7. [Installation & Setup Guide](#installation--setup-guide)
   - [Clone the Repository](#1-clone-the-repository)
   - [Install Dependencies](#2-install-dependencies)
   - [Configure Environment Variables](#3-configure-environment-variables)
   - [Connect MongoDB Atlas](#4-connect-mongodb-atlas)
   - [Create the Admin Account](#5-create-the-first-admin-account)
   - [Seed Sample Products](#6-seed-sample-products)
8. [Running the Application Locally](#running-the-application-locally)
9. [Application URLs & User Roles](#application-urls--user-roles)
10. [REST API Documentation](#rest-api-documentation)
11. [Testing & Verification Guide](#testing--verification-guide)
12. [Deployment Guide (Vercel + Render + Atlas)](#deployment-guide-vercel--render--atlas)
13. [Publishing to GitHub](#publishing-to-github)
14. [Troubleshooting Common Issues](#troubleshooting-common-issues)
15. [Project Limitations](#project-limitations)

---

## Project Overview

**ZapInventory** is an inventory control and customer storefront system for electronic products (smartphones, laptops, mechanical keyboards, mice, monitors, audio accessories, chargers, and storage).

The core technical highlight of the system is **automatic stock deduction with concurrency control**:
- When a customer purchases a product, stock is validated and deducted atomically in MongoDB Atlas.
- Concurrency checks prevent overselling (purchasing more units than available).
- Updated stock quantities and recent transactions immediately reflect on the administrator dashboard.
- Stock movement audit records are logged automatically.

---

## Key Features

### Admin Functionality
- **Live Inventory Dashboard**: Real-time stats (Total Products, Total Stock Units, Low Stock Items, Out of Stock items).
- **Recent Purchases Table**: Live feed of recent customer orders with order IDs, items, and totals.
- **Low Stock Alerts**: Automatic flagging of products at or below their configured stock threshold.
- **Product CRUD**: Add, edit, and soft/hard delete electronic products with category tags, SKU identifiers, prices, and images.
- **Stock Adjustment**: Increase or decrease stock manually with mandatory reason tags (`New Stock Received`, `Damaged Items`, `Stock Correction`, etc.).
- **Stock Movement History**: Audit trail recording previous quantity, change, new quantity, timestamps, and performing user.
- **Purchases Overview**: View all customer purchases and snapshots.

### Customer Storefront
- **Electronic Storefront**: Responsive product grid displaying availability badges (`In Stock`, `Low Stock`, `Out of Stock`).
- **Real-Time Filtering & Search**: Instant search by product name or brand, and category filtering.
- **One-Click Buy Now**: Simulated checkout (Cash on Delivery) with instant backend validation, stock deduction, and printable confirmation receipts.
- **Customer Purchase History**: View personal order history with order IDs, items, prices, and order statuses.

---

## Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 18 (Vite) | Single-page application, pure CSS tokens |
| **Icons** | Lucide React | Clean, lightweight UI icons |
| **Routing** | React Router DOM v6 | Role-based protected routes |
| **API Client** | Axios | Configured with automatic JWT bearer interceptor |
| **Backend** | Node.js + Express.js | Modular MVC architecture with controllers, middleware, and routes |
| **Database** | MongoDB Atlas | Cloud-hosted MongoDB cluster |
| **ODM** | Mongoose v8 | Schemas, validation, virtuals, and atomicity |
| **Authentication** | JWT & bcryptjs | 7-day token expiration, 10 salt rounds password hashing |
| **Hosting Target** | Vercel & Render | Client on Vercel, server API on Render |

---

## Application Architecture

```
┌────────────────────────────────────────────────────────┐
│               Client (React 18 + Vite)                │
│  - Dark Theme UI (Pure CSS Tokens)                    │
│  - AuthContext (JWT session management)               │
│  - Protected Routes (Admin vs Customer)               │
│  - Axios Interceptor (baseURL from VITE_API_BASE_URL)  │
└───────────────────────────┬────────────────────────────┘
                            │
                   HTTP/JSON REST API
                            │
┌───────────────────────────▼────────────────────────────┐
│              Backend (Express.js + Node)               │
│  - Configurable CORS (CLIENT_ORIGIN)                   │
│  - JWT Verification Middleware (protect, adminOnly)     │
│  - Controllers: Auth, Product, Stock, Order, Dashboard │
│  - Atomic operations preventing oversell               │
└───────────────────────────┬────────────────────────────┘
                            │
                    Mongoose Driver
                            │
┌───────────────────────────▼────────────────────────────┐
│              Database (MongoDB Atlas)                  │
│  - Database: zapinventory                              │
│  - Collections: products, users, orders, stockmovements│
│  - Unique Indexes: Product.sku, User.email             │
└────────────────────────────────────────────────────────┘
```

---

## Project Folder Structure

```
ZapInventory/
├── client/                          # Frontend Application (React + Vite)
│   ├── public/                      # Static assets & icons
│   ├── src/
│   │   ├── components/              # AdminSidebar, ProtectedRoute, etc.
│   │   ├── layouts/                 # AdminLayout, CustomerLayout
│   │   ├── pages/                   # All application views
│   │   │   ├── AdminDashboard.jsx   # Stats, quick actions, low-stock warnings
│   │   │   ├── AdminOrdersPage.jsx  # All customer purchase records
│   │   │   ├── InventoryPage.jsx    # Product table with search/filters
│   │   │   ├── LoginPage.jsx        # Login form
│   │   │   ├── MyOrdersPage.jsx     # Customer purchase history
│   │   │   ├── NotFoundPage.jsx     # 404 handler
│   │   │   ├── ProductFormPage.jsx  # Add/Edit product form with validation
│   │   │   ├── RegisterPage.jsx     # Customer self-registration
│   │   │   ├── StockManagementPage.jsx # Stock adjustment & audit log
│   │   │   └── StorePage.jsx        # Product catalog & Buy Now modal
│   │   ├── services/
│   │   │   └── api.js               # Centralized Axios client & API calls
│   │   ├── utils/
│   │   │   ├── AuthContext.jsx      # Authentication state provider
│   │   │   └── helpers.js           # Price formatting (₹) and status helpers
│   │   ├── App.jsx                  # Route definitions
│   │   ├── index.css                # Dark theme variables and component styles
│   │   └── main.jsx                 # Application entry point
│   ├── .env.example                 # Frontend env placeholder
│   ├── package.json                 # Frontend dependencies
│   ├── vercel.json                  # SPA routing configuration for Vercel
│   └── vite.config.js               # Vite bundler configuration
├── server/                          # Backend Application (Node.js + Express)
│   ├── config/
│   │   └── db.js                    # MongoDB Atlas connection handler
│   ├── controllers/                 # Route logic (auth, product, stock, order, dashboard)
│   ├── middleware/
│   │   └── auth.js                  # JWT validation & role enforcement
│   ├── models/                      # Mongoose schemas (Product, User, Order, StockMovement)
│   ├── routes/                      # API endpoint definitions
│   ├── scripts/
│   │   ├── createAdmin.js           # Secure initial admin account generation
│   │   └── seedProducts.js          # Sample electronics data seeder
│   ├── app.js                       # Express configuration & middleware
│   ├── package.json                 # Backend dependencies & scripts
│   ├── server.js                    # Server startup entry point
│   ├── .env.example                 # Backend env placeholder
│   └── .gitignore                   # Backend specific ignore rules
├── .gitignore                       # Repository-wide Git ignore rules
├── package.json                     # Root convenience scripts
└── README.md                        # Documentation
```

---

## Prerequisites & Required Software

- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **npm**: v9.0.0 or higher (packaged with Node.js)
- **Git**: For version control ([Download Git](https://git-scm.com/))
- **MongoDB Atlas Account**: Free cloud tier ([MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

---

## Installation & Setup Guide

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/ZapInventory.git
cd ZapInventory
```

### 2. Install Dependencies

Install dependencies for both the backend and the frontend:

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

# Return to root directory
cd ..
```

### 3. Configure Environment Variables

#### Backend (`server/.env`)
Create a `.env` file in the `server/` directory:
```bash
# On Windows PowerShell:
Copy-Item server/.env.example server/.env

# On Mac/Linux:
cp server/.env.example server/.env
```

Populate `server/.env` with your values:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/zapinventory?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
CLIENT_ORIGIN=http://localhost:5173
```

#### Frontend (`client/.env`)
Create a `.env` file in the `client/` directory:
```bash
# On Windows PowerShell:
Copy-Item client/.env.example client/.env

# On Mac/Linux:
cp client/.env.example client/.env
```

Populate `client/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000
```

### 4. Connect MongoDB Atlas

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. Under **Security → Database Access**, create a user with read and write permissions.
3. Under **Security → Network Access**, add IP `0.0.0.0/0` (allow access from anywhere) so both your local machine and Render can connect.
4. Go to **Databases → Cluster → Connect → Drivers**.
5. Copy the connection string and ensure it specifies the `zapinventory` database:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/zapinventory?retryWrites=true&w=majority
   ```
6. Paste this URI into `server/.env` as `MONGODB_URI`.

### 5. Create the First Admin Account

Administrator accounts cannot be created via the public registration page. Run the secure setup script:

```bash
cd server
node scripts/createAdmin.js
```

Default credentials created:
- **Email**: `admin@zapinventory.com`
- **Password**: `Admin@1234`
- **Role**: `admin`

*(Optional: To create an admin with custom credentials, pass environment variables: `ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=SecretPassword node scripts/createAdmin.js`)*

### 6. Seed Sample Products

Populate the database with initial electronic items:

```bash
cd server
node scripts/seedProducts.js
```

This inserts 8 sample products (Samsung Galaxy S24, MacBook Air M2, Keychron K2, Logitech MX Master 3S, LG 4K Monitor, Sony WH-1000XM5, Anker GaN Charger, Samsung T7 SSD).  
*This script is idempotent (safe to run multiple times without duplicating or overwriting modified stock).*

---

## Running the Application Locally

Run both the backend and frontend simultaneously using two separate terminals:

### Terminal 1 — Backend API
```bash
cd server
npm run dev
```
> Server runs on **http://localhost:5000**  
> Health check: **http://localhost:5000/api/health**

### Terminal 2 — Frontend Application
```bash
cd client
npm run dev
```
> Client application opens on **http://localhost:5173**

*(Alternative from project root: `npm run server:dev` and `npm run client:dev`)*

---

## Application URLs & User Roles

| Page | URL Path | Access Level | Description |
|---|---|---|---|
| **Login** | `/login` | Public | Authentication for Admin & Customers |
| **Register** | `/register` | Public | Customer self-registration |
| **Admin Dashboard** | `/admin` | Admin only | Statistics cards, quick actions, low stock alerts |
| **Inventory** | `/admin/inventory` | Admin only | Product table with search, category/stock filters |
| **Add Product** | `/admin/inventory/new` | Admin only | Add product form with field validation |
| **Edit Product** | `/admin/inventory/edit/:id` | Admin only | Edit existing product details |
| **Stock Management** | `/admin/stock` | Admin only | Increase/decrease stock and view audit trail |
| **Purchases List** | `/admin/orders` | Admin only | All customer orders and product snapshots |
| **Storefront** | `/store` | Customer only | Browse products and purchase via modal |
| **Customer Orders** | `/store/my-orders` | Customer only | Personal purchase history |

---

## REST API Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register customer account |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive JWT token |
| `GET` | `/api/auth/me` | Authenticated | Retrieve current session profile |

### Products (`/api/products`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/products` | Public | List products (active items for customers, all for admin) |
| `GET` | `/api/products/:id` | Public | Get single product by ID |
| `POST` | `/api/products` | Admin | Create a new electronic product |
| `PUT` | `/api/products/:id` | Admin | Update existing product details |
| `DELETE` | `/api/products/:id` | Admin | Delete a product |

### Stock Management (`/api/stock`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/stock/adjust` | Admin | Adjust product quantity with reason tracking |
| `GET` | `/api/stock/movements` | Admin | Retrieve stock adjustment audit history |

### Orders & Purchases (`/api/orders`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/orders` | Customer | Purchase product with automatic stock deduction |
| `GET` | `/api/orders/my-orders` | Customer | Fetch current customer's order history |
| `GET` | `/api/orders` | Admin | Fetch all system orders |

### Dashboard Analytics (`/api/dashboard`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/dashboard/stats` | Admin | Aggregate counts for products, stock units, and alerts |
| `GET` | `/api/dashboard/recent-orders` | Admin | Latest 10 customer purchases |
| `GET` | `/api/dashboard/low-stock` | Admin | Products at or below threshold |

### System Health
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Uptime and deployment health monitor |

---

## Testing & Verification Guide

Follow these steps to demonstrate the application:

1. **Verify Database Connection**:
   - Access `http://localhost:5000/api/health` — response must be `{"status":"ok",...}`.
2. **Admin Operations**:
   - Log in at `http://localhost:5173/login` using `admin@zapinventory.com` / `Admin@1234`.
   - Verify all 8 seeded products appear on the Dashboard and Inventory page.
   - Click **Add Product** to create a test product. Verify validation prevents negative prices or duplicate SKUs.
   - Go to **Stock Management**, select a product, increase stock by `5` with reason `New Stock Received`. Verify the audit table updates.
3. **Customer Purchase & Automatic Stock Deduction**:
   - Open a private/incognito window and go to `http://localhost:5173/register`.
   - Register a customer (e.g. `buyer@example.com` / `buyer123`).
   - Browse the catalog, choose a product, and click **Buy Now**.
   - Select quantity `2` and confirm purchase.
   - Note the order receipt details on screen and check **My Purchases**.
   - Switch back to the Admin Dashboard: verify stock has decreased by exactly `2` units and the order is visible under **Recent Purchases**.
4. **Oversell Prevention**:
   - Attempt to purchase more units than available stock. The backend will reject the request with `Insufficient stock` and stock will not decrease.

---

## Deployment Guide (Vercel + Render + Atlas)

### Step 1: MongoDB Atlas Configuration
1. Ensure your MongoDB Atlas cluster has network access set to `0.0.0.0/0` (Allow from anywhere) so Render can connect.
2. Copy your connection string with the `zapinventory` database specified.

### Step 2: Deploy Backend to Render
1. Push your code to your public GitHub repository.
2. Log in to [Render](https://dashboard.render.com/) and click **New + → Web Service**.
3. Connect your GitHub repository.
4. Configure service settings:
   - **Name**: `zapinventory-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add Environment Variables under the **Environment** tab:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `<Your MongoDB Atlas connection URI>`
   - `JWT_SECRET`: `<A long random secure string>`
   - `CLIENT_ORIGIN`: `http://localhost:5173` *(Update with your Vercel URL once generated)*
6. Click **Deploy Web Service**.
7. Test the health endpoint: `https://<your-render-service>.onrender.com/api/health`.

### Step 3: Deploy Frontend to Vercel
1. Log in to [Vercel](https://vercel.com/) and click **Add New → Project**.
2. Import your GitHub repository.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client` *(Click Edit and select client)*
4. Expand **Environment Variables** and add:
   - `VITE_API_BASE_URL`: `https://<your-render-service>.onrender.com`
5. Click **Deploy**.
6. Note the generated Vercel production URL (e.g. `https://zapinventory.vercel.app`).

### Step 4: Sync CORS on Render
1. Return to your Render Web Service dashboard → **Environment**.
2. Update `CLIENT_ORIGIN` to match your Vercel URL:
   ```
   CLIENT_ORIGIN=https://<your-app-name>.vercel.app
   ```
3. Save changes (Render will automatically redeploy with the new CORS setting).

---

## Publishing to GitHub

Follow these steps to push your local project to a public GitHub repository:

### 1. Create a Repository on GitHub
1. Log in to [GitHub](https://github.com/).
2. Click the **+** icon in the top right → **New repository**.
3. Set **Repository name** to `ZapInventory`.
4. Choose **Public**.
5. Do **not** initialize with a README, .gitignore, or license (these already exist locally).
6. Click **Create repository**.

### 2. Initialize and Push Local Code

Open your terminal in the root `ZapInventory` folder:

```bash
# Initialize git repository
git init

# Stage all files (sensitive .env files are excluded by .gitignore)
git add .

# Create the initial commit
git commit -m "Initial commit: ZapInventory full-stack inventory management system"

# Rename branch to main
git branch -M main

# Link to your remote GitHub repository (replace with your actual GitHub username)
git remote add origin https://github.com/<your-username>/ZapInventory.git

# Push code to GitHub
git push -u origin main
```

---

## Troubleshooting Common Issues

| Symptom / Error | Probable Cause | Solution |
|---|---|---|
| `MongooseError: connect ECONNREFUSED` or timeout | MongoDB Atlas IP whitelist blocking the server | In MongoDB Atlas → Network Access, verify `0.0.0.0/0` is active. |
| `CORS error: No 'Access-Control-Allow-Origin' header` | Frontend origin does not match backend `CLIENT_ORIGIN` | Set `CLIENT_ORIGIN` in `server/.env` or Render environment to the exact frontend URL (including `https://`, no trailing slash). |
| `Not authorized — no token provided` (401) | Missing or expired JWT token in browser | Log in again via `/login`. Check browser localStorage for the `token` key. |
| Blank screen on page refresh in production | Client-side routing not rewritten to `index.html` | Verify [`client/vercel.json`](client/vercel.json) contains the rewrite rule for `/(.*) -> /`. |
| Port in use error (`EADDRINUSE: 5000`) | Another process is occupying port 5000 | Stop the existing Node process or change `PORT` in `server/.env`. |
| `Product with this SKU already exists` | Duplicate SKU constraint violated | SKUs must be unique across all products. Provide a unique SKU code. |

---

## Project Limitations

- **Simulated Payment Gateway**: Purchases use a simulated Cash on Delivery workflow suitable for academic demonstrations; no real credit cards or financial transactions take place.
- **Single-Item Checkout**: Each order currently processes one product at a time.
- **No Email Notifications**: Order receipts are displayed on-screen and stored in MongoDB rather than dispatched via SMTP.
- **In-Memory Filtering**: Designed for small-to-medium electronic inventories without cursor pagination.

# ZapInventory
 a2763ed7f97b8538eadc4afab451f082b9d36f78
