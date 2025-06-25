const express = require("express");
const router = express.Router();

const productRoutes = require("./product");
const userRouter = require("./user");
const oderRoutes = require("./oder");
const shelfRoutes = require("./shelf");
const loadcellRoutes = require("./loadcell");

// Gắn các route con vào router chính
router.use("/products", productRoutes);
router.use("/orders", oderRoutes);
router.use("/users", userRouter);
router.use("/shelves", shelfRoutes);
router.use("/loadcell", loadcellRoutes);

module.exports = router;
