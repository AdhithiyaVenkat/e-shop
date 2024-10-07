# E-Commerce Application
This project is an E-Commerce application built using Next.js, React.js, Redux, Material-UI, and Tailwind CSS for the frontend, and Node.js with MongoDB for the backend. The application features both customer and store owner roles and includes key functionalities such as product listing, cart management, order placement, and sales tracking for store owners.

## Features
### Customer
1. Login/Sign-Up: Customers can register and login to their account.
2. Product Listing: Customers can view products with categories.
3. Cart Management: Customers can manage the items in their cart and proceed to checkout.
4. Order Placement: Place an order and view a summary of orders placed.
### Store Owner
1. Login/Sign-Up: Store owners can register and login to their account.
2. Sales Dashboard: Store owners can view total sales and products sold.
3. Manage Products: Add, update, and delete products under specific categories.
4. Manage Categories: Add, update, and delete categories.

## Technologies Used
### Frontend:
Next.js: Server-side rendering, routing, and structure.
React.js: Frontend component structure.
Redux: Global state management for handling cart and user session states.
Material-UI: For UI components such as buttons, forms, cards, tooltips, and more.
Tailwind CSS: For responsive and utility-first styling.
### Backend:
Node.js: Backend server to handle APIs and business logic.
MongoDB: NoSQL database for storing user data, products, orders, and more.
Mongoose: For MongoDB object modeling.

## Setup and Installation
1. Clone the Repository
git clone https://github.com/your-username/ecommerce-app.git
cd ecommerce-app

2. Install Dependencies

Navigate to both the frontend and backend directories and run:

npm install

3. Configure Environment Variables

Create a .env file in the root of your project with the following environment variables:

MONGODB_URI=mongodb://localhost:27017/ecommerce_db
JWT_SECRET=your_jwt_secret_key
Run the Application

4. First, run the backend server:

cd backend
npm start

5. Then, run the frontend in another terminal:

cd frontend
npm run dev

Visit the Application

Open http://localhost:3000 to view the app.

## Features Overview
### Cart Management
The customer can add products to their cart, modify the quantity, and proceed to checkout. Redux is used to manage the state of the cart across the application.

### Store Owner Dashboard
Store owners can view statistics such as total sales and the number of products sold. They can also add, edit, and delete products and categories.

### Order Placement
Customers can place orders, and the corresponding stock for each product is automatically reduced when the order is confirmed.

## API Endpoints
Here are some key API endpoints:

1. POST /api/auth/register: Register a new user.
2. POST /api/auth/login: Authenticate a user.
3. POST /api/orders: Place an order and reduce product stock.
4. GET /api/orders: Get the list of orders (for store owners).
GET /api/products/category/:categoryId: Get products under a specific category.
