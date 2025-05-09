const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger definition
const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "E-Commerce API",
			version: "1.0.0",
			description: "API for managing products and orders in an e-commerce system",
		},
		servers: [
			{
				url: "http://localhost:3000",
				description: "Development server",
			},
		],
	},
	// Path to the API docs - all controllers with JSDoc comments will be included
	apis: ["./src/api/controllers/*.js"],
};

// Initialize swagger-jsdoc
const specs = swaggerJsdoc(options);

module.exports = {
	swaggerUi,
	specs,
};
