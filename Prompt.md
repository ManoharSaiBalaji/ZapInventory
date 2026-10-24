# ZapInventory — Full Stack Inventory & Stock Management System

## 1. Project Overview

Build a complete, functional, full-stack web application called **ZapInventory**, designed for managing electronic products such as smartphones, laptops, keyboards, mice, monitors, headphones, chargers, and other accessories.

The main objective is to build a simple inventory management system where an administrator controls products and stock, while customers can browse and purchase products.

The most important functionality is **automatic stock deduction after a successful purchase**. When a customer buys a product, its available stock must decrease in MongoDB and the updated quantity must be visible on the admin dashboard.

This is a college Full Stack Development project. The code should be beginner-friendly, organized, easy to understand, and suitable for demonstrating React, backend APIs, MongoDB, and CRUD operations.

Do not build an unnecessarily complicated commercial application. Focus on the core features, excellent UI design, correct functionality, and successful deployment.

## 2. Technology Stack

Use the following technologies:

- Frontend: React.js with Vite
- Programming language: JavaScript
- Styling: CSS or Tailwind CSS
- Icons: Lucide React
- Backend: Node.js with Express.js
- Database: MongoDB Atlas
- Database integration: Mongoose
- Authentication: JWT and bcrypt
- API communication: Axios or Fetch API
- Hosting: Vercel for the frontend and Render for the backend
- Source code: Public GitHub repository

Use compatible package versions and standard development practices.

Do not use Firebase, PHP, MySQL, or a frontend-only mockup. MongoDB must be the actual database, and Express must handle backend operations.

## 3. Design and Theme

Create a **modern, simple, premium dark-themed interface**. The design should feel like a professional inventory management dashboard without being visually complicated.

### Color palette

- Main background: #0B1120
- Sidebar background: #111827
- Card background: #172033
- Input background: #1E293B
- Primary accent: #38BDF8
- Secondary accent: #8B5CF6
- Success: #22C55E
- Warning: #F59E0B
- Error: #EF4444
- Primary text: #F8FAFC
- Secondary text: #94A3B8
- Border: #293548

Use these colors consistently across the application.

### UI requirements

- Dark theme enabled by default.
- Clean, professional typography using Inter or a similar font.
- Simple left sidebar for admin navigation.
- Minimal top navigation with page title and profile/logout menu.
- Rounded cards with subtle borders and restrained shadows.
- Attractive product cards with clear product images.
- Clean inventory tables with properly aligned columns.
- Clear primary and secondary buttons.
- Simple status badges for stock availability.
- Consistent spacing and readable text.
- Responsive layout for laptop, desktop, tablet, and mobile.
- Subtle hover effects and lightweight transitions.
- Loading indicators, empty states, confirmation dialogs, and error messages.

Avoid excessive gradients, unnecessary animations, too many colors, decorative elements, and overcrowded layouts.

Make the website look polished while keeping every page easy to understand.

## 4. User Roles

Implement exactly two roles: **Admin** and **Customer**.

### A. Admin

The administrator is the main user of the system.

Admin functionality:

1. Log in securely.
2. View the inventory dashboard.
3. Add new electronic products.
4. Edit product details.
5. Delete products with a confirmation dialog.
6. View and search all products.
7. Filter products by category and stock status.
8. Increase or decrease stock quantities.
9. View low-stock and out-of-stock products.
10. View customer purchases and basic order details.
11. Log out.

Keep all these features accessible through a simple admin sidebar.

Do not add complicated administrator roles, employee management, supplier management, purchase orders, warehouse management, or advanced reporting.

### B. Customer

Keep the customer functionality minimal and focused on buying products.

Customer functionality:

1. Register and log in.
2. Browse available electronic products.
3. Search products by name.
4. Filter products by category.
5. View product details, price, and availability.
6. Select a quantity and click Buy Now.
7. Confirm the purchase.
8. View purchase confirmation with order details.
9. Log out.

Do not add wishlists, reviews, customer messaging, loyalty points, delivery tracking, complex shopping carts, or unnecessary customer dashboard features.

Each purchase should contain one product. Multiple products in a single order are not required.

For the college project, use a simple simulated checkout or Cash on Delivery selection. Do not integrate a real payment gateway. Clearly indicate that payments are simulated if this option is implemented.

## 5. Admin Dashboard

Create a clean dashboard that appears immediately after a successful admin login.

At the top, display four summary cards:

1. **Total Products** — Number of distinct active products.
2. **Total Stock Units** — Sum of available units across active products.
3. **Low Stock Items** — Number of products below their configured stock threshold.
4. **Out of Stock** — Number of active products with zero stock.

Below the cards, show two simple sections.

### Recent Purchases

Display the latest purchases in a table with:

- Order ID
- Product name
- Quantity
- Total amount
- Purchase date

### Low Stock Alerts

Display:

- Product name
- SKU
- Current stock
- Stock threshold
- Stock status

Include quick-action buttons for:

- Add Product
- View Inventory
- Update Stock
- View Purchases

All dashboard values must come from the Express backend and MongoDB. Do not hardcode statistics or create fake dashboard data.

Do not add complicated charts or a separate advanced analytics dashboard.

## 6. Inventory Management

This is the most important section of ZapInventory.

Create an inventory page with a clean table containing:

- Product image
- Product name
- SKU
- Category
- Brand
- Selling price
- Stock quantity
- Stock status
- Actions

### Product management

The admin must be able to:

- Add a product.
- Edit a product.
- Delete a product.
- Search by product name or SKU.
- Filter by category.
- Filter by stock status.
- Update stock quantity.

Use simple search and filtering. Advanced sorting and server-side pagination are not necessary for this college project.

### Product categories

Include these categories:

- Smartphones
- Laptops
- Keyboards
- Mice
- Monitors
- Headphones and Earphones
- Computer Accessories
- Chargers and Cables
- Other Electronics

### Add/Edit Product form

Include these fields:

- Product Name
- SKU
- Brand
- Category
- Description
- Selling Price
- Cost Price
- Stock Quantity
- Low Stock Threshold
- Product Image URL (optional)

Validate the form before submission.

Rules:

- Product name and SKU are required.
- SKU must be unique.
- Selling price and cost price cannot be negative.
- Stock quantity must be a non-negative whole number.
- Low-stock threshold must be a non-negative whole number.

Display stock status automatically:

- In Stock
- Low Stock
- Out of Stock

Use the following logic:

- Out of Stock when stock quantity is zero.
- Low Stock when stock quantity is greater than zero but less than or equal to the threshold.
- In Stock when stock quantity is greater than the threshold.

Product image URLs are optional. If an image cannot load, display a clean placeholder.

## 7. Stock Management

Implement straightforward stock adjustment functionality.

The admin can increase or decrease stock after receiving new products or correcting stock quantities.

Create a simple stock adjustment form containing:

- Product
- Current stock
- Adjustment type: Increase or Decrease
- Quantity
- Reason

Available reasons:

- New Stock Received
- Stock Correction
- Damaged Items
- Returned Items
- Other

When an adjustment is confirmed, update the database and refresh the inventory display.

Do not allow stock to become negative.

Record basic stock movement history with:

- Product
- Previous quantity
- Quantity changed
- New quantity
- Reason
- Date and time

This history should be simple and may be displayed below the stock adjustment interface or in a small stock history section.

Do not build a complicated audit management system.

## 8. Automatic Stock Deduction

This is the main functionality that must work correctly.

Example:

Initial stock: 15 laptops.

Customer purchases: 2 laptops.

Remaining stock: 13 laptops.

The updated stock must be stored in MongoDB and reflected in the admin dashboard and inventory table.

### Purchase workflow

1. A customer opens the product listing.
2. The customer selects a product.
3. The customer chooses the quantity.
4. The website displays the unit price, available stock, and total amount.
5. The customer confirms the purchase.
6. The frontend sends the purchase request to Express.
7. The backend verifies the customer, product, quantity, and current stock.
8. The backend processes the stock deduction and saves the order.
9. The frontend displays the successful purchase confirmation.
10. The admin dashboard reflects the updated stock and recent purchase.

### Important rules

- Customers cannot purchase zero or negative quantities.
- Customers cannot purchase more units than are available.
- Stock must never become negative.
- The backend must validate the current stock at purchase time.
- The frontend must never independently decide that a purchase succeeded.
- Prevent overselling when two customers try to purchase the same stock simultaneously.
- Avoid duplicate stock deduction if a purchase request is retried.
- Save the order and stock changes reliably. Use a MongoDB transaction when supported by the deployed database, or another safe approach that handles failures without leaving incorrect stock or incomplete orders.

If an order cannot be completed, return a clear error and do not show a success message.

Do not build complex refund, cancellation, or payment processing workflows.

## 9. Customer Storefront

Create a simple storefront that matches the dark theme of the admin dashboard.

Display products in a responsive grid of cards.

Each product card should include:

- Product image
- Product name
- Brand
- Category
- Selling price
- Stock availability
- Buy Now button

Customers should be able to search by name and filter by category.

Hide or disable the Buy Now button for out-of-stock products.

When the customer clicks Buy Now, display a simple purchase confirmation form with a quantity selector and total-price calculation.

After a successful purchase, show:

- Order ID
- Product name
- Quantity purchased
- Unit price
- Total amount
- Purchase date

The customer should not be able to modify product information or stock.

## 10. Orders Management

Create a simple Purchases page for the administrator.

Display a table containing:

- Order ID
- Customer name
- Product name
- Quantity
- Unit price
- Total amount
- Purchase date
- Status

Include basic searching by order ID or product name if practical.

Orders must be stored in MongoDB.

Store a snapshot of product name, SKU, unit price, and quantity in each order so purchase records remain understandable if the product details later change.

Keep the order system simple. Complicated order states, refund processing, delivery management, and separate fulfillment workflows are unnecessary.

## 11. MongoDB Database

Connect the application to MongoDB Atlas using Mongoose.

Use three main collections.

### Product model

Fields:

- name
- sku
- brand
- category
- description
- sellingPrice
- costPrice
- stockQuantity
- lowStockThreshold
- imageUrl
- isActive
- createdAt
- updatedAt

Create a unique index on SKU.

### User model

Fields:

- name
- email
- passwordHash
- role
- createdAt
- updatedAt

Roles are only `admin` and `customer`.

Create a unique index on email. Hash passwords using bcrypt.

### Order model

Fields:

- orderId
- customerId
- productId
- productNameSnapshot
- skuSnapshot
- quantity
- unitPrice
- costPriceSnapshot
- totalAmount
- paymentMethod
- orderStatus
- createdAt

Each order contains one product.

Use the stored selling price to calculate the order total on the backend. Never trust a total amount sent directly by the customer.

### Basic stock history

Record stock adjustment information in a lightweight StockMovement model or an equivalent reliable structure.

The database must be the source of truth. Do not use browser localStorage or hardcoded arrays as a replacement for persistent product, user, or order data.

## 12. Backend API

Build a small REST API using Express.js.

### Authentication

- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`

Allow public registration only for customers.

Provide a secure seed script or setup command for creating the first admin account. Never allow the customer registration form to create admin accounts.

### Products

- GET `/api/products`
- GET `/api/products/:id`
- POST `/api/products`
- PUT `/api/products/:id`
- DELETE `/api/products/:id`

Public customers can view active products. Only administrators can create, edit, delete, or modify product information.

### Stock

- POST `/api/stock/adjust`
- GET `/api/stock/movements`

Only administrators can adjust stock or view stock movement history.

### Orders

- POST `/api/orders`
- GET `/api/orders/my-orders`
- GET `/api/orders`

Customers can create purchases and view their own orders. Only administrators can view all orders.

### Dashboard

- GET `/api/dashboard/stats`
- GET `/api/dashboard/recent-orders`
- GET `/api/dashboard/low-stock`

Use the APIs to supply the actual data shown in the frontend.

Keep the backend organized with routes, controllers, models, database configuration, and authentication middleware. Do not put the entire backend into one large file.

## 13. Authentication and Security

Implement simple, proper authentication.

Requirements:

- Hash passwords with bcrypt.
- Use JWT to authenticate protected requests.
- Enforce role-based access control on backend APIs.
- Customers cannot access administrator-only operations.
- Customers can view only their own orders.
- Validate incoming data on the server.
- Configure CORS for the frontend.
- Keep secrets and connection strings in environment variables.
- Do not expose credentials in frontend code or GitHub.
- Return clear errors with suitable HTTP status codes.
- Protect the admin account creation process.

Frontend route protection is useful for navigation, but backend authorization must enforce actual permissions.

Do not add unnecessary enterprise security systems. Use straightforward, secure patterns suitable for a student project.

## 14. Application Pages

Build only these main pages:

1. Login
2. Customer Registration
3. Admin Dashboard
4. Inventory Management
5. Add/Edit Product form
6. Stock Adjustment
7. Customer Storefront
8. Purchase Confirmation
9. Admin Purchases page
10. Basic Not Found and Unauthorized pages

Use a shared admin layout and a simple customer layout.

### Admin sidebar

- Dashboard
- Inventory
- Stock Management
- Purchases
- Logout

### Customer navigation

- Products
- My Purchases
- Logout

Keep the navigation short and intuitive.

## 15. Project Structure

Use a straightforward project structure:

zapinventory/

- client/
  - src/
    - components/
    - layouts/
    - pages/
    - services/
    - utils/
    - App.jsx
    - main.jsx
  - package.json
  - vite.config.js
- server/
  - config/
  - controllers/
  - middleware/
  - models/
  - routes/
  - scripts/
  - app.js
  - server.js
  - package.json
- README.md
- .gitignore

You may adjust this structure when useful, but keep the frontend and backend clearly separated.

Use reusable components and a centralized API service.

Keep the code readable and explain important logic with short comments. Avoid unnecessary abstractions and excessive dependencies.

## 16. Sample Products

Create a seed script containing a small set of sample electronics:

- Smartphone
- Laptop
- Mechanical Keyboard
- Wireless Mouse
- Monitor
- Wireless Headphones
- USB-C Charger
- External SSD

Use reasonable demonstration prices and stock quantities. They are sample data, not real market quotations.

The seed script should be safe to run more than once without creating duplicate products or overwriting existing inventory quantities.

Do not create fake dashboard statistics. The sample products and their stock must be stored in MongoDB.

## 17. Mandatory Hosting

The website must be prepared for public deployment so my lecturer can access it through a real URL.

Use this setup:

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

Prefer free or no-cost options where available, but explain any current limitations or possible paid requirements.

### Frontend deployment

- Build successfully with `npm run build`.
- Configure the correct Vercel project root.
- Use the actual production backend URL.
- Configure `VITE_API_BASE_URL`.
- Add a suitable rewrite rule for React client-side routes if needed.
- Remove hardcoded localhost URLs from production configuration.

### Backend deployment

- Deploy the Express application to Render.
- Configure the production start command.
- Read the assigned port from `process.env.PORT`.
- Configure the required production environment variables.
- Set CORS to allow the deployed frontend URL.
- Provide a health-check endpoint such as `/api/health`.
- Ensure the production database connection works.

Backend environment variables should include:

- `NODE_ENV`
- `PORT` where appropriate for local development
- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_ORIGIN`

Use the correct variable names consistently throughout the project.

### MongoDB Atlas

- Create a production database.
- Store its connection URI securely in the backend environment variables.
- Configure a database user with appropriate permissions.
- Configure network access correctly for the hosting platform.
- Never expose the database URI to the frontend.

### Hosting verification

After deployment, test that:

- The website opens through its public URL.
- Admin login works.
- Customers can register and log in.
- Product management works.
- Purchases correctly reduce stock.
- Updated quantities persist after refreshing the website.
- The dashboard reflects real database values.
- Customers cannot access admin-only APIs.

Do not claim deployment or functionality is successful until it has been tested.

If account creation, GitHub authorization, environment variables, or manual deployment steps require my involvement, provide clear instructions.

## 18. Public GitHub Repository

Prepare the complete project for a public GitHub repository named `ZapInventory`.

Include:

- Frontend source code
- Backend source code
- Database models and routes
- Sample product seed script
- `.gitignore`
- `.env.example` files
- Complete `README.md`

Do not commit:

- `.env` files containing actual credentials
- MongoDB passwords or connection strings
- JWT secrets
- Private access tokens
- `node_modules`
- Unnecessary build files or temporary files

Provide the exact steps for creating a public GitHub repository and pushing the code.

Never fabricate a repository URL or claim the code has been pushed unless that has actually happened.

## 19. README.md

Create a complete beginner-friendly README at the root of the repository.

It must contain:

1. Project overview.
2. Main features.
3. Admin and customer roles.
4. Technology stack.
5. Application architecture.
6. Prerequisites, including Node.js and npm.
7. Instructions for cloning the repository.
8. Instructions for installing frontend and backend dependencies.
9. Instructions for configuring environment variables.
10. Instructions for connecting MongoDB Atlas.
11. Instructions for creating the first admin account securely.
12. Instructions for seeding sample products.
13. Exact commands to start the backend and frontend separately.
14. Local frontend and backend URLs.
15. Main REST API endpoints.
16. Explanation of the project folder structure.
17. Testing instructions.
18. Deployment instructions for Vercel, Render, and MongoDB Atlas.
19. Troubleshooting for common setup errors.
20. Known limitations, including simulated payments where applicable.

Example local development commands should match the actual project scripts:

Backend terminal:

```bash
cd server
npm install
npm run dev
```

Frontend terminal:

```bash
cd client
npm install
npm run dev
```

Configure the environment files before starting the application.

Use a `.env.example` for documentation. Explain how to create the actual `.env` files locally.

Adjust these example commands if the generated project uses different scripts.

Ensure that a fresh clone can be installed by following the README without undocumented manual fixes.

## 20. Development and Testing Process

Build the project in manageable stages.

### Stage 1: Setup

Create the React + Vite frontend, Express backend, environment configuration, and MongoDB connection.

### Stage 2: Main functionality

Implement authentication, roles, product CRUD, stock adjustments, and the customer purchase flow.

### Stage 3: UI

Build the dark-themed admin dashboard, inventory table, product forms, and simple storefront.

### Stage 4: Integration

Connect every page to the real backend. Ensure that database changes appear in the frontend without relying on hardcoded data.

### Stage 5: Testing

Verify the main operations, permissions, validation, and purchase stock decrement.

### Stage 6: Submission

Prepare the public GitHub repository, README, environment examples, and deployment configuration.

### Stage 7: Deployment

Deploy the backend and frontend, configure MongoDB Atlas, test the live application, and document the actual public URLs.

Do not stop after generating frontend screens. Finish the backend integration and test the main workflows.

If something fails, inspect the error, fix the underlying issue, and retest.

## 21. Final Acceptance Checklist

The project is complete only when the following requirements have been addressed:

- [ ] Modern, responsive dark-themed UI.
- [ ] React + Vite frontend.
- [ ] Node.js + Express backend.
- [ ] Working MongoDB Atlas connection.
- [ ] Admin and Customer roles.
- [ ] Secure admin creation and authentication.
- [ ] Product creation, editing, and deletion.
- [ ] Search and basic category filtering.
- [ ] Stock increase and decrease.
- [ ] Low-stock and out-of-stock indicators.
- [ ] Customer product browsing and purchasing.
- [ ] Automatic stock decrement after a successful purchase.
- [ ] Purchase details stored in MongoDB.
- [ ] Dashboard values retrieved from the backend.
- [ ] Backend permissions and validation.
- [ ] Public deployment configuration.
- [ ] Public GitHub repository ready to publish.
- [ ] Complete README with working local setup instructions.
- [ ] Actual deployment and testing status accurately documented.

## Final Instruction

Build **ZapInventory as a simple, professional, fully functional Full Stack Development project**.

Prioritize the admin dashboard, product inventory management, MongoDB integration, and automatic stock deduction. Keep the customer side minimal.

Use a consistent dark theme with navy backgrounds, slate cards, sky-blue accents, readable text, and clean layouts.

Avoid advanced features that do not contribute directly to the inventory management objective.

Make the code easy for a college student to understand, demonstrate, maintain, and explain to a lecturer.

The final deliverables must include the working application, the source code prepared for a public GitHub repository, the README documentation, and a deployment-ready configuration.

Do not fabricate test results, hosting URLs, or GitHub links. Clearly identify any remaining manual setup steps that require my accounts or authorization.

Build this as a full-stack MERN application using MongoDB with Mongoose schemas, and set up a .env file containing a MONGODB_URI placeholder so I can add my secret cloud connection string later