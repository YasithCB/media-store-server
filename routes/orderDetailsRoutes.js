import express from "express";
import { fetchOrdersByUserId, addOrderDetails } from "../controllers/orderDetailsController.js";

const router = express.Router();

// Get all orders for a user
router.get("/:userId", fetchOrdersByUserId);

// Add order details
router.post("/save", addOrderDetails);

export default router;
