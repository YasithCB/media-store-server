import { saveMultipleOrderDetails, getOrdersByUserId } from "../models/orderDetailsModel.js";
import { success, error } from "../helpers/response.js"; // assuming you have these helpers

/**
 * Fetch all orders by user ID
 * GET /orders/:userId
 */
export const fetchOrdersByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await getOrdersByUserId(userId);

        if (!orders || orders.length === 0) {
            return error(res, "No orders found for this user");
        }

        return success(res, orders, "Orders fetched successfully");
    } catch (err) {
        console.error(err);
        return error(res, err.message || "Failed to fetch orders");
    }
};

/**
 * Add multiple order details for a payment
 * POST /orders
 * Body: { paymentId, userId, items: [{ product_id, category_title, quantity, price }] }
 */
export const addOrderDetails = async (req, res) => {
    try {
        const { paymentId, userId, items } = req.body;

        if (!paymentId || !userId || !items || !Array.isArray(items) || items.length === 0) {
            return error(res, "Invalid request data");
        }

        const insertedRows = await saveMultipleOrderDetails(paymentId, userId, items);

        return success(res, { insertedRows }, "Order details added successfully");
    } catch (err) {
        console.error(err);
        return error(res, err.message || "Failed to add order details");
    }
};
