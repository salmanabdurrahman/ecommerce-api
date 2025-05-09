const express = require("express");
const { swaggerUi, specs } = require("./api/swagger");
const productRoutes = require("./api/routes/productRoutes");
const orderRoutes = require("./api/routes/orderRoutes");

// Initialize express app
const app = express();

// Middleware for parsing JSON request body
app.use(express.json());

// Setup Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Register API routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Root endpoint
app.get("/", (req, res) => {
	res.json({
		message: "E-Commerce API is running",
		documentation: "Visit /api-docs for API documentation",
	});
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({
		error: "Something went wrong!",
		message: err.message,
	});
});

module.exports = app;
