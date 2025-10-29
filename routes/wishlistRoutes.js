import * as WishListController from "../controllers/wishlistController.js";
import express from "express";
const router = express.Router();

router.get("/:id", WishListController.getAllWishlistByUser);
router.post("/add/:id", WishListController.addToWishList);

// Remove a post from wishlist
router.delete("/remove/:postId", WishListController.removeFromWishList);

export default router;
