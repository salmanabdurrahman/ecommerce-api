const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Route for getting all orders
router.get("/", orderController.getAllOrders);

// Route for getting a single order by ID
router.get("/:id", orderController.getOrderById);

// Route for creating a new order
router.post("/", orderController.createOrder);

// Route for updating an order
router.put("/:id", orderController.updateOrder);

// Route for deleting an order
router.delete("/:id", orderController.deleteOrder);

module.exports = router;
