import { pool } from "../db.js";

/**
 * Save multiple order details with supplier_id included in product JSON
 * @param {*} payment_id
 * @param {*} user_id - buyer/user id
 * @param {*} items - array of items [{ id, quantity, ... }]
 */
export const saveMultipleOrderDetails = async (payment_id, user_id, items) => {
    const values = [];

    for (const item of items) {
        // Fetch the item from the product/dealer table to get supplier_id
        let tableName;

        if (item.id.startsWith("stu")) {
            tableName = "studio";
        } else if (item.id.startsWith("EP")) {
            tableName = "equipment_post";
        } else if (item.id.startsWith("jp")) {
            tableName = "job_post";
        } else {
            throw new Error(`Unknown item type for ID: ${item.id}`);
        }

        // Fetch the supplier_id from the appropriate table
        const [rows] = await pool.query(
            `SELECT *, user_id AS supplier_id FROM ${tableName} WHERE id = ? LIMIT 1`,
            [item.id]
        );

        if (!rows || rows.length === 0) {
            throw new Error(`Item not found with ID: ${item.id}`);
        }

        const supplier_id = rows[0].supplier_id;

        values.push([
            payment_id,
            user_id,
            item.id,
            supplier_id,
            item.category_title,
            item.quantity || 1,
            JSON.stringify(item),
        ]);
    }

    // Insert into order_details
    const [result] = await pool.query(
        `INSERT INTO order_details (payment_id, user_id, product_id, supplier_id, category_title, quantity, product)
         VALUES ?`,
        [values]
    );

    return result.affectedRows;
};

// Get all order details for a supplier
export const getOrdersBySupplier = async (supplierId) => {
    const [rows] = await pool.execute(
        `SELECT *
         FROM order_details
         WHERE supplier_id = ?
         ORDER BY created_at DESC`,
        [supplierId]
    );

    return rows;
}

// Update order status to 'READY'
export const updateOrderStatusToReady = async (orderId) => {
    const [result] = await pool.execute(
        `UPDATE order_details
         SET status = ?
         WHERE id = ?`,
        ["READY", orderId]
    );

    return result.affectedRows > 0;
};
// Update order status to 'SHIPPED'
export const updateOrderStatusToShipped = async (orderId) => {
    const [result] = await pool.execute(
        `UPDATE order_details
         SET status = ?
         WHERE id = ?`,
        ["SHIPPED", orderId]
    );

    return result.affectedRows > 0;
};
// Update order status to 'DELIVERED'
export const updateOrderStatusToDelivered = async (orderId) => {
    const [result] = await pool.execute(
        `UPDATE order_details
         SET status = ?
         WHERE id = ?`,
        ["DELIVERED", orderId]
    );

    return result.affectedRows > 0;
};


/**
 * Get all order details for a specific user (joined with payment info)
 * @param {string|number} user_id
 */
export const getOrdersByUserId = async (user_id) => {
    const [rows] = await pool.execute(
        `SELECT
             p.id AS payment_id,
             p.tap_id,
             p.order_id,
             p.amount,
             p.status AS payment_status,
             p.currency,
             p.customer_name,
             p.customer_email,
             p.created_at,
             od.id AS order_detail_id,
             od.status AS order_status,
             od.product_id,
             od.category_title,
             od.quantity,
             od.product
         FROM payments p
                  JOIN order_details od ON od.payment_id = p.id
         WHERE od.user_id = ?
         ORDER BY p.created_at DESC`,
        [user_id]
    );

    // Parse JSON column
    return rows;
};

