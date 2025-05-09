const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Route for getting all products
router.get("/", productController.getAllProducts);

// Route for getting a single product by ID
router.get("/:id", productController.getProductById);

// Route for creating a new product
router.post("/", productController.createProduct);

// Route for updating a product
router.put("/:id", productController.updateProduct);

// Route for deleting a product
router.delete("/:id", productController.deleteProduct);

module.exports = router;
