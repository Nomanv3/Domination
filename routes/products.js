const express = require("express");
const router = express.Router();
const {productController} = require("../controllers/productController");
const upload = require("../config/multer.config");
const authMiddleware = require("../middleware/auth.isAuthenticated");

// Apply middleware to protect routes
router.use(authMiddleware.isAuthenticated);
router.use(authMiddleware.isSeller);

// Define the route
router.post("/createproduct", upload.any(), productController);

module.exports = router;
