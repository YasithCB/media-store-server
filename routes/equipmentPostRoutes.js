// equipmentPostRoutes.js
import express from "express";
import * as EquipmentPostController from "../controllers/equipmentPostController.js";

const router = express.Router();

router.get("/", EquipmentPostController.getAllEquipmentPosts);
router.get("/subcategory/:subcategoryId", EquipmentPostController.getPostsBySubcategoryId);
router.get("/:id", EquipmentPostController.getPostById);
router.post("/", EquipmentPostController.createPost);
router.put("/:id", EquipmentPostController.updatePost);
router.delete("/:id", EquipmentPostController.deletePost);

export default router;
