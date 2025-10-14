import express from "express";
import multer from "multer";
import path from "path";
import * as DealerPostController from "../controllers/dealerPostController.js";
import * as EquipmentPostController from "../controllers/equipmentPostController.js";

const router = express.Router();

// ------------------------
// Multer Storage Config
// ------------------------
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/dealer-posts");
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        cb(null, `${timestamp}-${file.fieldname}${ext}`);
    },
});

// ------------------------
// File Filter
// ------------------------
const fileFilter = (req, file, cb) => {
    const allowedExtensions = [".jpeg", ".png", ".jpg", ".webp", ".heic"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        console.error("Rejected file extension:", ext);
        cb(new Error("Only image files are allowed"), false);
    }
};


// ------------------------
// Multer Upload Middleware
// ------------------------
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB max per file
    },
});

// ------------------------
// Routes
// ------------------------

// Create Dealer Post
router.post(
    "/",
    upload.fields([
        { name: "logo", maxCount: 1 },
        { name: "photos", maxCount: 10 },
    ]),
    DealerPostController.createDealerPost
);

// Get all dealer posts
router.get("/", DealerPostController.getAllDealerPosts);
router.get("/top-rated", DealerPostController.getDealersTopRated);

// Get dealer post by ID
router.get("/:id", DealerPostController.getDealerPostById);
router.get("/name/:name", DealerPostController.getDealersByName);

// Get dealer posts by subcategory
router.get("/subcategory/:subcategoryId", DealerPostController.getDealerPostsBySubcategoryId);

// Update dealer post
router.put(
    "/:id",
    upload.fields([
        { name: "logo", maxCount: 1 },
        { name: "photos", maxCount: 10 },
    ]),
    DealerPostController.updateDealerPost
);

// Delete dealer post
router.delete("/:id", DealerPostController.deleteDealerPost);

export default router;
