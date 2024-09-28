const express = require("express");
const { check } = require("express-validator");
const {
  registerUser,
  loginUser,
  verifyEmail,
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
      "Password must be at least 8 characters long, contain at least 1 uppercase letter and 1 number"
    )
      .isLength({ min: 8 })
      .matches(/(?=.*[A-Z])(?=.*[0-9])/), // Password regex to check for uppercase letter and number
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

module.exports = router;
