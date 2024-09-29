// controllers/userController.js
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Create a new user
const createUser = async (req, res) => {
  const { username, email, phoneNumber, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, phoneNumber, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ msg: "User created successfully", userId: newUser._id });
  } catch (err) {
    res.status(500).json({ msg: "Error creating user", error: err.message });
  }
};

// Get user details
const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching user", error: err.message });
  }
};

// Update user information
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, phoneNumber, password, dob, address, city, district, gender, role } = req.body;

  try {
    const updatedData = { username, email, phoneNumber, dob, address, city, district, gender, role };

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(id, updatedData, { new: true });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json({ msg: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ msg: "Error updating user", error: err.message });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json({ msg: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting user", error: err.message });
  }
};

// controllers/userController.js
const changePassword = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Old password is incorrect" });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({ msg: "New password cannot be the same as the old password" });
    }

    const isValidPassword = (password) => password.length >= 6;
    if (!isValidPassword(newPassword)) {
      return res.status(400).json({ msg: "New password does not meet complexity requirements" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await User.findByIdAndUpdate(id, { password: hashedNewPassword }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ msg: "Error updating password" });
    }

    res.status(200).json({ msg: "Password updated successfully" });
  } catch (err) {
    console.error("Error changing password for user ID:", id, "Error:", err.message);
    res.status(500).json({ msg: "Error changing password", error: err.message });
  }
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  changePassword,
};
