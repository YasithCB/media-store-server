import express from "express";
import {
    getPostsBySubcategory,
    addPost,
    editPost,
    removePost, getPostsByCategory, getPostById, getHighRatedPosts, getAllPosts,
    getPostsByUserId
} from "../controllers/postController.js";

const router = express.Router();

router.get("/", getAllPosts);
router.get("/user/:userId", getPostsByUserId);
router.get("/topRated", getHighRatedPosts);
router.get("/:id", getPostById);
router.get("/category/:categoryId", getPostsByCategory);
router.get("/subcategory/:subcategoryId", getPostsBySubcategory);

router.post("/", addPost);
router.put("/:id", editPost);
router.delete("/:id", removePost);

export default router;
