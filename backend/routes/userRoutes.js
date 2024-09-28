// routes/user.js
const express = require("express");
const { createUser, getUser, updateUser, deleteUser } = require("../controllers/userController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Create a new user
router.post("/", createUser);

// Get user details
router.get("/:id", authMiddleware, getUser);

// Update user information
router.put("/update/:id", authMiddleware, updateUser);

// Delete a user
router.delete("/:id", authMiddleware, deleteUser);

module.exports = router;
