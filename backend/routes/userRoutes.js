// routes/user.js
const express = require("express");
const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  changePassword,
} = require("../controllers/userController");
const middleware = require("../middleware/auth");

const router = express.Router();

// Get list user
router.get("", middleware.verifyToken, getUsers);

// Create a new user
router.post("/", middleware.verifyToken, createUser);

// Get user information (requires authentication middleware)
router.get("/:id", middleware.verifyToken, getUser);

// Update user information (requires authentication middleware)
router.put("/:id", middleware.verifyToken, updateUser);

// Delete a user (requires authentication middleware)
router.delete("/:id", middleware.verifyToken, deleteUser);

// Change password (requires authentication middleware)
router.post("/change-password/:id", middleware.verifyToken, changePassword);

module.exports = router;
