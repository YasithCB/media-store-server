import express from "express";
import {
    getPosts,
    getPostsBySubcategory,
    addPost,
    editPost,
    removePost, getPostsByCategory, getPostById, getHighRatedPosts,
} from "../controllers/postController.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/topRated", getHighRatedPosts);
router.get("/:id", getPostById);
router.get("/category/:categoryId", getPostsByCategory);
router.get("/subcategory/:subcategoryId", getPostsBySubcategory);

router.post("/", addPost);
router.put("/:id", editPost);
router.delete("/:id", removePost);

export default router;
