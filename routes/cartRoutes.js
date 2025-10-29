import * as CartController from "../controllers/cartController.js";
import express from "express";

const router = express.Router();

// Get all cart items for a user
router.get("/:id", CartController.getAllCartByUser);

// Add a product to cart (or increase quantity if exists)
router.post("/add", CartController.addCartItem);

// Update cart item quantity
router.put("/update", CartController.updateCartItem);

// Remove a product from cart
router.delete("/remove", CartController.removeCartItem);

// Clear entire cart
router.delete("/clear", CartController.clearUserCart);

export default router;
