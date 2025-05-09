require("dotenv").config();
const { db, pool } = require("./index");
const { products, orders } = require("./schema");
const { faker } = require("@faker-js/faker");

// Function to seed products
const seedProducts = async (count = 5) => {
	const productData = [];

	for (let i = 0; i < count; i++) {
		productData.push({
			name: faker.commerce.productName(),
			description: faker.commerce.productDescription(),
			price: parseFloat(faker.commerce.price({ min: 10, max: 1000, dec: 2 })),
		});
	}

	console.log(`Inserting ${count} sample products...`);
	return await db.insert(products).values(productData).returning();
};

// Function to seed orders based on existing products
const seedOrders = async (seededProducts, count = 10) => {
	const orderData = [];

	for (let i = 0; i < count; i++) {
		const randomProduct = seededProducts[Math.floor(Math.random() * seededProducts.length)];
		const quantity = Math.floor(Math.random() * 5) + 1;

		orderData.push({
			product_id: randomProduct.id,
			quantity: quantity,
			total_price: parseFloat(randomProduct.price) * quantity,
		});
	}

	console.log(`Inserting ${count} sample orders...`);
	return await db.insert(orders).values(orderData).returning();
};

// Main seed function
const seed = async () => {
	try {
		console.log("Starting database seeding...");

		// Seed products
		const seededProducts = await seedProducts();

		// Seed orders
		await seedOrders(seededProducts);

		console.log("Database seeding completed successfully!");
	} catch (error) {
		console.error("Error seeding database:", error);
	} finally {
		await pool.end();
	}
};

// Run seeder
seed();
