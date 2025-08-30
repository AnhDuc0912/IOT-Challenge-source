const express = require("express");
const router = express.Router();

const productRoutes = require("./product");
const userRouter = require("./user");
const oderRoutes = require("./oder");
const shelfRoutes = require("./shelf");
const loadcellRoutes = require("./loadcell");
const notificationRoutes = require("./notification");
const taskRoutes = require("./task");
const comboRoutes = require("./combo");

// Gắn các route con vào router chính
router.use("/products", productRoutes);
router.use("/orders", oderRoutes);
router.use("/users", userRouter);
router.use("/shelves", shelfRoutes);
router.use("/loadcell", loadcellRoutes);
router.use("/notifications", notificationRoutes);
router.use("/tasks", taskRoutes);
router.use("/combos", comboRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy'
  });
});

module.exports = router;