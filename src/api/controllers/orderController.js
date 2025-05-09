const { db } = require("../../db");
const { orders, products } = require("../../db/schema");
const { eq } = require("drizzle-orm");

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - product_id
 *         - quantity
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID of the order
 *         product_id:
 *           type: integer
 *           description: ID of the ordered product
 *         quantity:
 *           type: integer
 *           description: Quantity of the product
 *         total_price:
 *           type: number
 *           format: float
 *           description: Total price of the order (price * quantity)
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Date and time when the order was created
 *       example:
 *         id: 1
 *         product_id: 1
 *         quantity: 2
 *         total_price: 1199.98
 *         created_at: "2025-04-15T12:00:00Z"
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Retrieve all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: A list of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Server error
 */
const getAllOrders = async (req, res) => {
	try {
		const orderList = await db.select().from(orders);
		return res.status(200).json(orderList);
	} catch (error) {
		console.error("Error fetching orders:", error);
		return res.status(500).json({ error: "Failed to fetch orders" });
	}
};

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
const getOrderById = async (req, res) => {
	try {
		const { id } = req.params;
		const order = await db
			.select()
			.from(orders)
			.where(eq(orders.id, parseInt(id)))
			.limit(1);

		if (order.length === 0) {
			return res.status(404).json({ error: "Order not found" });
		}

		return res.status(200).json(order[0]);
	} catch (error) {
		console.error("Error fetching order:", error);
		return res.status(500).json({ error: "Failed to fetch order" });
	}
};

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - quantity
 *             properties:
 *               product_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
const createOrder = async (req, res) => {
	try {
		const { product_id, quantity } = req.body;

		// Validate required fields
		if (!product_id || !quantity) {
			return res.status(400).json({ error: "Product ID and quantity are required" });
		}

		// Validate quantity
		if (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
			return res.status(400).json({ error: "Quantity must be a positive integer" });
		}

		// Get product to calculate total price
		const product = await db
			.select()
			.from(products)
			.where(eq(products.id, parseInt(product_id)))
			.limit(1);

		if (product.length === 0) {
			return res.status(404).json({ error: "Product not found" });
		}

		// Calculate total price
		const total_price = parseFloat(product[0].price) * parseInt(quantity);

		// Create order
		const newOrder = await db
			.insert(orders)
			.values({
				product_id: parseInt(product_id),
				quantity: parseInt(quantity),
				total_price,
			})
			.returning();

		return res.status(201).json(newOrder[0]);
	} catch (error) {
		console.error("Error creating order:", error);
		return res.status(500).json({ error: "Failed to create order" });
	}
};

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Update an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Order or product not found
 *       500:
 *         description: Server error
 */
const updateOrder = async (req, res) => {
	try {
		const { id } = req.params;
		const { product_id, quantity } = req.body;

		// Check if order exists
		const existingOrder = await db
			.select()
			.from(orders)
			.where(eq(orders.id, parseInt(id)));

		if (existingOrder.length === 0) {
			return res.status(404).json({ error: "Order not found" });
		}

		// Prepare update data
		const updateData = {};
		let total_price = existingOrder[0].total_price;

		// If product_id is changing, verify it exists and recalculate price
		if (product_id !== undefined) {
			const product = await db
				.select()
				.from(products)
				.where(eq(products.id, parseInt(product_id)));

			if (product.length === 0) {
				return res.status(404).json({ error: "Product not found" });
			}

			updateData.product_id = parseInt(product_id);

			// If only product changed, recalculate with existing quantity
			if (quantity === undefined) {
				total_price = parseFloat(product[0].price) * existingOrder[0].quantity;
			} else {
				// If quantity is also changing, validate and recalculate
				if (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
					return res.status(400).json({ error: "Quantity must be a positive integer" });
				}

				updateData.quantity = parseInt(quantity);
				total_price = parseFloat(product[0].price) * parseInt(quantity);
			}
		} else if (quantity !== undefined) {
			// Only quantity is changing, validate and recalculate with existing product
			if (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
				return res.status(400).json({ error: "Quantity must be a positive integer" });
			}

			const product = await db.select().from(products).where(eq(products.id, existingOrder[0].product_id));

			if (product.length === 0) {
				return res.status(404).json({ error: "Associated product not found" });
			}

			updateData.quantity = parseInt(quantity);
			total_price = parseFloat(product[0].price) * parseInt(quantity);
		}

		updateData.total_price = total_price;

		// Update order
		const updatedOrder = await db
			.update(orders)
			.set(updateData)
			.where(eq(orders.id, parseInt(id)))
			.returning();

		return res.status(200).json(updatedOrder[0]);
	} catch (error) {
		console.error("Error updating order:", error);
		return res.status(500).json({ error: "Failed to update order" });
	}
};

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Order ID
 *     responses:
 *       204:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
const deleteOrder = async (req, res) => {
	try {
		const { id } = req.params;

		// Check if order exists
		const existingOrder = await db
			.select()
			.from(orders)
			.where(eq(orders.id, parseInt(id)));

		if (existingOrder.length === 0) {
			return res.status(404).json({ error: "Order not found" });
		}

		// Delete order
		await db.delete(orders).where(eq(orders.id, parseInt(id)));

		return res.status(204).send();
	} catch (error) {
		console.error("Error deleting order:", error);
		return res.status(500).json({ error: "Failed to delete order" });
	}
};

module.exports = {
	getAllOrders,
	getOrderById,
	createOrder,
	updateOrder,
	deleteOrder,
};
