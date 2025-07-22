const express = require("express");
const router = express.Router();
const {
  createNotification,
  getAllNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} = require("../controller/notification.controller");


// Create a new notification
router.post("/", createNotification);

// Get all notifications with pagination and filtering
router.get("/", getAllNotifications);

// Get unread notifications count
router.get("/unread-count", getUnreadCount);

// Get notification by ID
router.get("/:id", getNotificationById);

// Mark notification as read
router.patch("/:id/read", markAsRead);

// Mark all notifications as read
router.patch("/mark-all-read", markAllAsRead);

// Delete notification
router.delete("/:id", deleteNotification);

module.exports = router; 