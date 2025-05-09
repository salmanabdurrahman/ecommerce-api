const { db } = require("../../db");
const { products } = require("../../db/schema");
const { eq } = require("drizzle-orm");

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID of the product
 *         name:
 *           type: string
 *           description: Name of the product
 *         description:
 *           type: string
 *           description: Description of the product
 *         price:
 *           type: number
 *           format: float
 *           description: Price of the product
 *       example:
 *         id: 1
 *         name: "Smartphone"
 *         description: "Latest model smartphone"
 *         price: 599.99
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Retrieve all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error
 */
const getAllProducts = async (req, res) => {
	try {
		const productList = await db.select().from(products);
		return res.status(200).json(productList);
	} catch (error) {
		console.error("Error fetching products:", error);
		return res.status(500).json({ error: "Failed to fetch products" });
	}
};

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
const getProductById = async (req, res) => {
	try {
		const { id } = req.params;
		const product = await db
			.select()
			.from(products)
			.where(eq(products.id, parseInt(id)))
			.limit(1);

		if (product.length === 0) {
			return res.status(404).json({ error: "Product not found" });
		}

		return res.status(200).json(product[0]);
	} catch (error) {
		console.error("Error fetching product:", error);
		return res.status(500).json({ error: "Failed to fetch product" });
	}
};

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 format: float
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
const createProduct = async (req, res) => {
	try {
		const { name, description, price } = req.body;

		// Validate required fields
		if (!name || !price) {
			return res.status(400).json({ error: "Name and price are required" });
		}

		// Validate price format
		if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
			return res.status(400).json({ error: "Price must be a positive number" });
		}

		const newProduct = await db
			.insert(products)
			.values({
				name,
				description,
				price: parseFloat(price),
			})
			.returning();

		return res.status(201).json(newProduct[0]);
	} catch (error) {
		console.error("Error creating product:", error);
		return res.status(500).json({ error: "Failed to create product" });
	}
};

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 format: float
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
const updateProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, description, price } = req.body;

		// Check if product exists
		const existingProduct = await db
			.select()
			.from(products)
			.where(eq(products.id, parseInt(id)));

		if (existingProduct.length === 0) {
			return res.status(404).json({ error: "Product not found" });
		}

		// Prepare update data
		const updateData = {};
		if (name !== undefined) updateData.name = name;
		if (description !== undefined) updateData.description = description;
		if (price !== undefined) {
			if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
				return res.status(400).json({ error: "Price must be a positive number" });
			}
			updateData.price = parseFloat(price);
		}

		// Update product
		const updatedProduct = await db
			.update(products)
			.set(updateData)
			.where(eq(products.id, parseInt(id)))
			.returning();

		return res.status(200).json(updatedProduct[0]);
	} catch (error) {
		console.error("Error updating product:", error);
		return res.status(500).json({ error: "Failed to update product" });
	}
};

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Product ID
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
const deleteProduct = async (req, res) => {
	try {
		const { id } = req.params;

		// Check if product exists
		const existingProduct = await db
			.select()
			.from(products)
			.where(eq(products.id, parseInt(id)));

		if (existingProduct.length === 0) {
			return res.status(404).json({ error: "Product not found" });
		}

		// Delete product (related orders will be deleted due to ON DELETE CASCADE)
		await db.delete(products).where(eq(products.id, parseInt(id)));

		return res.status(204).send();
	} catch (error) {
		console.error("Error deleting product:", error);
		return res.status(500).json({ error: "Failed to delete product" });
	}
};

module.exports = {
	getAllProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
};
