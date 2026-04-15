# Flipkart Clone - Fullstack E-Commerce Platform
A functional e-commerce web application that closely replicates Flipkart's design and user experience.Built as part of an SDE Intern Fullstack Assignment.

## Live Demo
| **Frontend (Vercel)** | [https://flipkkart-assessment.vercel.app/](https://flipkkart-assessment.vercel.app/) |
| **Backend API (Render)** | [https://flipkkart-assessment.onrender.com](https://flipkkart-assessment.onrender.com) |
| **Database (Neon)** | PostgreSQL Serverless |

**Note**: Replace the URLs above with your actual deployed URLs after deployment.

## Core Features Implemented

### Product Management
- Product Listing Page with Grid Layout
- Search Functionality
- Filter Products by Category (Electronics, Fashion, Home & Furniture, Appliances)
- Product Detail Page with Image Carousel
- Product Description & Specifications
- Price & Stock Availability Status

### Shopping Cart
- View All Items in Cart
- Update Product Quantity
- Remove Items from Cart
- Cart Summary with Subtotal & Total Amount

### Order Management
- Checkout Page with Shipping Address Form
- Order Summary Review Before Placing Order
- Place Order Functionality
- Order Confirmation Page with Order ID

### UI/UX Features
- Flipkart-like Blue Navigation Bar
- Responsive Design (Mobile, Tablet, Desktop)
- Toast Notifications for User Actions
- Loading States for API Calls
- Product Card Hover Effects

## Tech Stack
Technology
|------------|
| **React.js 18** |
| **Tailwind CSS (Play CDN)** |
| **Vite** |
| **Node.js 18** |
| **Express.js** |
| **Sequelize ORM** |
| **PostgreSQL** |

## Local Setup Instructions

Step 1: Clone the Repository
```bash
git clone https://github.com/Sparsematrix09/flipkkart-assessment.git
cd flipkkart-assessment
```
Setup Database
```
Use PgAdmin for easy setup
Create db and copy paste the database.sql file using query tool
```
Backend Setup
```bash
cd backend
npm install

in .env file
PORT=5000
DB_NAME=flipkart_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost

then start backend
npm run dev :Runs on http://localhost:5000 
```
Frontend Setup
```
cd frontend
npm install

in .env.local
VITE_API_URL=http://localhost:5000

npm run dev: http://localhost:5173
```
Assumptions Made
- No Authentication Required
- A default guest user is assumed to be logged in User ID: 11111111-1111-1111-1111-111111111111
- Categories have no parent-child hierarchy
- Database pre-seeded with 17+ products
- Sample images from Unsplash
- No Payment Integration

