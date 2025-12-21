// Import Express framework for building the web server
const express = require("express");

// Import dotenv to load environment variables from .env file
const dotenv = require("dotenv");

// Import CORS (Cross-Origin Resource Sharing) to handle requests from different origins
const cors = require("cors");

// Load environment variables from the .env file located at the root
// This allows us to access sensitive data like PORT, DB credentials, JWT secrets, etc.
dotenv.config({ path: "./.env" });

// Import database connection function to connect to MongoDB
const connectDB = require("./src/config/db");

// Import user routes for handling all user-related API endpoints
const userRouter = require("./src/routes/userRouter");

// Import error handling middleware to catch and process errors globally
const errorMiddleware = require("./src/middleware/errorMiddleware");

// Create an instance of Express application
const app = express();

// Database Connection
// Establish connection to MongoDB database
// This function connects to the database using the URI from environment variables
connectDB();

// CORS Configuration
// Configure CORS options to control which origins can access our API
const corsOptions = {
  // Define allowed origins - function checks if the requesting origin is allowed
  origin: (origin, callback) => {
    // List of origins that are permitted to access this API
    const allowedOrigins = ["http://localhost:5173"];

    // Allow requests with no origin (like mobile apps or Postman) or from allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Grant access
    } else {
      callback(new Error("Not allowed by CORS")); // Deny access
    }
  },

  // Specify which HTTP methods are allowed for cross-origin requests
  methods: ["GET", "POST", "PUT", "DELETE"],

  // Define which headers can be sent in requests
  allowedHeaders: ["Content-Type", "Authorization"],

  // Allow cookies and authentication headers to be sent with requests
  credentials: true,
};

// MIDDLEWARE SETUP
// Apply CORS middleware with the configured options
// This must be applied before routes to ensure CORS is handled for all endpoints
app.use(cors(corsOptions));

// Parse incoming JSON request bodies
// This allows Express to automatically parse JSON data sent in POST/PUT requests
app.use(express.json());

// Parse URL-encoded request bodies (form submissions)
// Extended: true allows for rich objects and arrays to be encoded
app.use(express.urlencoded({ extended: true }));

// API ROUTES
// Mount user router at /api/users endpoint
// All routes defined in userRouter will be prefixed with /api/users
// Example: /api/users/register, /api/users/login, etc.
app.use("/api/users", userRouter);

// ========================================
// ERROR HANDLING MIDDLEWARE
// ========================================
// Global error handling middleware - MUST be placed after all routes
// This catches any errors thrown in routes or middleware and sends appropriate responses
app.use(errorMiddleware);

// ========================================
// SERVER STARTUP
// ========================================
// Define the port number from environment variables or use 4242 as default
const PORT = process.env.PORT || 4242;

// Start the Express server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
