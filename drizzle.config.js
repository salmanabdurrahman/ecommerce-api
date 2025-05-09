require("dotenv").config();

/** @type { import("drizzle-kit").Config } */
module.exports = {
	schema: "./src/db/schema.js",
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		host: process.env.DB_HOST || "localhost",
		port: Number(process.env.DB_PORT) || 5432,
		user: process.env.DB_USER || "postgres",
		password: process.env.DB_PASSWORD || "postgres",
		database: process.env.DB_NAME || "ecommerce_db",
	},
};
