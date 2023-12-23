const express = require("express");
const connectDb = require("./config/dbConnection"); // Only if you have a database connection
const errorHandler = require("./middleware/errorHandler");
const objectRoutes = require("./routes/objectRoutes"); // Adjust the path as necessary

// Initialize Express app
const app = express();
const port = 5000;

// Connect to the database (if applicable)
connectDb();

// Middleware to parse JSON bodies
app.use(express.json());

// Use the defined routes
app.use("/api/object", objectRoutes);

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(5000, () => {
  console.log(`Server is running on port ${port}...`);
});
