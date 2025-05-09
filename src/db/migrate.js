require("dotenv").config();
const { migrate } = require("drizzle-orm/node-postgres/migrator");
const { db, pool } = require("./index");

// Run migrations
const runMigration = async () => {
	try {
		console.log("Running migrations...");
		await migrate(db, { migrationsFolder: "./drizzle" });
		console.log("Migrations completed successfully");
	} catch (error) {
		console.error("Migration failed:", error);
	} finally {
		await pool.end();
	}
};

runMigration();
