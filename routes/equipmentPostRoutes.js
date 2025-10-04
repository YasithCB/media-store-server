// equipmentPostRoutes.js
import express from "express";
import * as EquipmentPostController from "../controllers/equipmentPostController.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/equipment-posts"),
    filename: (req, file, cb) =>
        cb(null, `${Date.now()}${path.extname(file.originalname)}`),
});

const upload = multer({ storage });

router.post(
    "/",
    upload.fields([{ name: "photos", maxCount: 10 }]),
    EquipmentPostController.createEquipmentPost
);

router.get("/", EquipmentPostController.getAllEquipmentPosts);
router.get("/subcategory/:subcategoryId", EquipmentPostController.getPostsBySubcategoryId);
router.get("/:id", EquipmentPostController.getPostById);
router.put("/:id", EquipmentPostController.updatePost);
router.delete("/:id", EquipmentPostController.deletePost);

export default router;
