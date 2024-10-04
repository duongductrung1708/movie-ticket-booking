// controllers/userController.js
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Role = require("../models/Role");
const nodemailer = require("nodemailer");

// Create a new user
const createUser = async (req, res) => {
  const { username, email, phoneNumber, dob, password } = req.body;

  try {
      const customerRole = await Role.findOne({ name: "customer" });
      console.log("Customer Role:", customerRole);
      if (!customerRole) {
          return res.status(500).json({ msg: "Customer role not found" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
          username,
          email,
          phoneNumber,
          dob,
          password: hashedPassword,
          role: customerRole._id,
          isVerified: false,
      });

      console.log("New User Data:", newUser);

      await newUser.save();

      // Generate JWT for verification
      const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
          expiresIn: "1h",
      });

      const verificationLink = `http://localhost:8080/api/auth/verify-email?token=${verificationToken}`;

      // Configure nodemailer
      const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
          },
      });

      const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Verify Your Email",
          text: `Please verify your email by clicking the link: ${verificationLink}`,
      };

      // Send email
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.error("Error sending email:", error);
              return res.status(500).json({ msg: "Failed to send verification email" });
          }
          console.log("Email sent: " + info.response);
          return res.json({
              msg: "Create user successful! Please check your email to verify your account.",
          });
      });
  } catch (err) {
      console.error("Registration error:", err.message);
      return res.status(500).send("Server error");
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
  const {
    username,
    email,
    phoneNumber,
    password,
    dob,
    address,
    city,
    district,
    gender,
    role,
  } = req.body;

  try {
    const updatedData = {
      username,
      email,
      phoneNumber,
      dob,
      address,
      city,
      district,
      gender,
      role,
    };

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
      return res
        .status(400)
        .json({ msg: "New password cannot be the same as the old password" });
    }

    const isValidPassword = (password) => password.length >= 6;
    if (!isValidPassword(newPassword)) {
      return res
        .status(400)
        .json({ msg: "New password does not meet complexity requirements" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { password: hashedNewPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: "Error updating password" });
    }

    res.status(200).json({ msg: "Password updated successfully" });
  } catch (err) {
    console.error(
      "Error changing password for user ID:",
      id,
      "Error:",
      err.message
    );
    res
      .status(500)
      .json({ msg: "Error changing password", error: err.message });
  }
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  changePassword,
};
