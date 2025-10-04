import express from "express";
import multer from "multer";
import * as DealerPostController from "../controllers/dealerPostController.js";
import path from "path";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/dealer-posts");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",   // added for more formats
        "image/heic",   // iOS default format
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        console.error("Rejected file type:", file.mimetype);
        cb(new Error("Only image files are allowed"), false);
    }
};

const upload = multer({ storage, fileFilter });

router.post(
    "/",
    upload.fields([
        { name: "logo", maxCount: 1 },
        { name: "photos", maxCount: 10 },
    ]),
    DealerPostController.createDealerPost
);

router.get("/", DealerPostController.getAllDealerPosts);
router.get("/:id", DealerPostController.getDealerPostById);
router.get("/subcategory/:subcategoryId", DealerPostController.getDealerPostsBySubcategoryId);
router.put("/:id", DealerPostController.updateDealerPost);
router.delete("/:id", DealerPostController.deleteDealerPost);

export default router;
