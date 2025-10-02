import express from "express";
import * as DealerPostController from "../controllers/dealerPostController.js";

const router = express.Router();

router.get("/", DealerPostController.getAllDealerPosts);
router.get("/:id", DealerPostController.getDealerPostById);
router.get("/subcategory/:subcategoryId", DealerPostController.getDealerPostsBySubcategoryId);
router.post("/", DealerPostController.createDealerPost);
router.put("/:id", DealerPostController.updateDealerPost);
router.delete("/:id", DealerPostController.deleteDealerPost);

export default router;
