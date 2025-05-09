const { pgTable, serial, varchar, text, decimal, integer, timestamp, foreignKey } = require("drizzle-orm/pg-core");

// Product table schema
const products = pgTable("products", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 100 }).notNull(),
	description: text("description"),
	price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

// Order table schema
const orders = pgTable("orders", {
	id: serial("id").primaryKey(),
	product_id: integer("product_id")
		.references(() => products.id, { onDelete: "cascade" })
		.notNull(),
	quantity: integer("quantity").notNull(),
	total_price: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
	created_at: timestamp("created_at").defaultNow(),
});

module.exports = {
	products,
	orders,
};
