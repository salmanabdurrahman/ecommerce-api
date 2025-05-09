require("dotenv").config();
const app = require("./app");

// Get port from environment variables or use default 3000
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
	console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});
