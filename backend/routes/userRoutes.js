// routes/user.js
const express = require("express");
const {
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const middleware = require("../middleware/auth");

const router = express.Router();

// Create a new user
router.post("/", createUser);

// Get user information (requires authentication middleware)
router.get("/:id", middleware.verifyToken, getUser);

// Update user information (requires authentication middleware)
router.put("/:id", middleware.verifyToken, updateUser);

// Delete a user (requires authentication middleware)
router.delete("/:id", middleware.verifyToken, deleteUser);

module.exports = router;
