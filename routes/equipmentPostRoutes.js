// equipmentPostRoutes.js
import express from "express";
import * as EquipmentPostController from "../controllers/equipmentPostController.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Ensure upload directory exists
const uploadDir = "uploads/equipment-posts";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage });

// Routes
router.post(
    "/",
    upload.array("photos", 10), // changed to .array so it's easier to handle
    EquipmentPostController.createEquipmentPost
);
// UPDATE
router.put(
    "/:id",
    upload.array("photos", 10), // same as create
    EquipmentPostController.updateEquipmentPost
);


router.get("/", EquipmentPostController.getAllEquipmentPosts);
router.get("/on-sale", EquipmentPostController.getEquipmentsOnSale);
router.get("/top-rated", EquipmentPostController.getEquipmentsTopRated);
router.get("/used", EquipmentPostController.getUsedEquipments);
router.get("/brand-new", EquipmentPostController.getBrandNewEquipments);
router.get("/rent", EquipmentPostController.getRentEquipments);
router.get("/subcategory/:subcategoryId", EquipmentPostController.getPostsBySubcategoryId);
router.get("/:id", EquipmentPostController.getPostById);
router.get("/name/:name", EquipmentPostController.getEquipmentsByName);
router.delete("/:id", EquipmentPostController.deletePost);

export default router;
