import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import subCategoryRoutes from "./routes/subCategoryRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import equipmentPostRoutes from "./routes/equipmentPostRoutes.js";
import jobPostRoutes from "./routes/jobPostRoutes.js";
import dealerPostRoutes from "./routes/dealerPostRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import studioRoutes from "./routes/studioRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();
const app = express();

// Then JSON parsing for other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// Serve uploads
app.use("/uploads", express.static("uploads"));
app.use("/auth", authRoutes);

// Routes
app.use("/users", userRoutes);
app.use("/dealer", dealerPostRoutes);
app.use("/categories", categoryRoutes);
app.use("/subcategories", subCategoryRoutes);
app.use("/posts", postRoutes);
app.use("/reviews", reviewRoutes);

app.use("/equipment-posts", equipmentPostRoutes);
app.use("/job-posts", jobPostRoutes);
app.use("/studio-posts", studioRoutes);

app.use("/wishlist", wishlistRoutes);
app.use("/cart", cartRoutes);
app.use("/payments", paymentRoutes);

app.get("/", (req, res) => {
    res.send("Media Store Server is online 🚀");
});

// Start server
app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on port ${process.env.PORT}`);
});
