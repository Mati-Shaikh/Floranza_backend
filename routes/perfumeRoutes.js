// routes/perfumeRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
    createPerfume,
    getPerfumes,
    updatePerfume,
    deletePerfume,
    createOrder,
    getOrders,
    updateAdminPassword,
} = require("..//Controllers/perfumeController");

// Multer setup for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, "../uploads"); // Relative to the backend root
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

  const upload = multer({ storage });

// Perfume routes
router.post("/perfumes", upload.single("image"), createPerfume);
router.get("/perfumes", getPerfumes);
router.put("/perfumes/:id", upload.single("image"), updatePerfume);
router.delete("/perfumes/:id", deletePerfume);

// Order routes
router.post("/orders", createOrder);
router.get("/orders", getOrders);

// Admin password update
router.put("/admin/password", updateAdminPassword);

module.exports = router;
