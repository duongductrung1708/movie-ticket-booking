const express = require("express");
const { check } = require("express-validator");
const {
  registerUser,
  loginUser,
  verifyEmail,
  logoutUser,
  resetPassword,
  forgotPassword,
} = require("../controllers/authController");

const router = express.Router();

// @route    POST api/auth/register
// @desc     Register user
// @access   Public
router.post(
  "/register",
  [
    check("username", "Username is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("phoneNumber", "Phone number must be 10 digits long")
      .isLength({ min: 10, max: 10 })
      .isNumeric(),
    check(
      "password",
      "Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 number, and 1 special character"
    )
      .isLength({ min: 8 })
      .matches(/(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/),
  ],
  registerUser
);

// @route    POST api/auth/login
// @desc     Login user & get token
// @access   Public
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  loginUser
);

// @route    GET api/auth/verify-email
// @desc     Verify user email
// @access   Public
router.get("/verify-email", verifyEmail);

// @route   POST api/auth/logout
// @desc    Logout user
// @access  Public
router.post("/logout", logoutUser);

// @route    POST api/auth/forgot-password
// @desc     Send OTP for password reset
// @access   Public
router.post(
  "/forgot-password",
  [check("email", "Please include a valid email").isEmail()],
  forgotPassword
);

// @route    POST api/auth/reset-password
// @desc     Reset password with OTP verification
// @access   Public
router.post(
  "/reset-password",
  [
    check("email", "Please include a valid email").isEmail(),
    check("otp", "OTP is required").not().isEmpty(),
    check(
      "newPassword",
      "Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 number, and 1 special character"
    )
      .isLength({ min: 8 })
      .matches(/(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/),
  ],
  resetPassword
);

module.exports = router;
