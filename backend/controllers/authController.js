const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const Role = require("../models/Role");
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");

// @desc     Register user
// @access   Public
exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, phoneNumber, password, dob } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const customerRole = await Role.findOne({ name: "customer" });
    if (!customerRole) {
      return res.status(500).json({ msg: "Customer role not found" });
    }

    user = new User({
      username,
      email,
      phoneNumber,
      dob,
      password,
      role: customerRole._id,
      isVerified: false,
    });

    await user.save();

    const verificationToken = generateToken(
      { email },
      process.env.JWT_SECRET,
      "1h"
    );
    const verificationUrl = `http://localhost:8080/api/auth/verify-email?token=${verificationToken}`;

    const emailContent = `
      <html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Verify your email address</title>
  <style type="text/css" rel="stylesheet" media="all">
    /* Base ------------------------------ */
    *:not(br):not(tr):not(html) {
      font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
    body {
      width: 100% !important;
      height: 100%;
      margin: 0;
      line-height: 1.4;
      background-color: #F5F7F9;
      color: #839197;
      -webkit-text-size-adjust: none;
    }
    a {
      color: #414EF9;
    }

    /* Layout ------------------------------ */
    .email-wrapper {
      width: 100%;
      margin: 0;
      padding: 0;
      background-color: #F5F7F9;
    }
    .email-content {
      width: 100%;
      margin: 0;
      padding: 0;
    }

    /* Masthead ----------------------- */
    .email-masthead {
      padding: 25px 0;
      text-align: center;
    }
    .email-masthead_logo {
      max-width: 400px;
      border: 0;
    }
    .email-masthead_name {
      font-size: 16px;
      font-weight: bold;
      color: #839197;
      text-decoration: none;
      text-shadow: 0 1px 0 white;
    }

    /* Body ------------------------------ */
    .email-body {
      width: 100%;
      margin: 0;
      padding: 0;
      border-top: 1px solid #E7EAEC;
      border-bottom: 1px solid #E7EAEC;
      background-color: #FFFFFF;
    }
    .email-body_inner {
      width: 570px;
      margin: 0 auto;
      padding: 0;
    }
    .email-footer {
      width: 570px;
      margin: 0 auto;
      padding: 0;
      text-align: center;
    }
    .email-footer p {
      color: #839197;
    }
    .body-action {
      width: 100%;
      margin: 30px auto;
      padding: 0;
      text-align: center;
    }
    .body-sub {
      margin-top: 25px;
      padding-top: 25px;
      border-top: 1px solid #E7EAEC;
    }
    .content-cell {
      padding: 35px;
    }
    .align-right {
      text-align: right;
    }

    /* Type ------------------------------ */
    h1 {
      margin-top: 0;
      color: #292E31;
      font-size: 19px;
      font-weight: bold;
      text-align: left;
    }
    h2 {
      margin-top: 0;
      color: #292E31;
      font-size: 16px;
      font-weight: bold;
      text-align: left;
    }
    h3 {
      margin-top: 0;
      color: #292E31;
      font-size: 14px;
      font-weight: bold;
      text-align: left;
    }
    p {
      margin-top: 0;
      color: #839197;
      font-size: 16px;
      line-height: 1.5em;
      text-align: left;
    }
    p.sub {
      font-size: 12px;
    }
    p.center {
      text-align: center;
    }

    /* Buttons ------------------------------ */
    .button {
      display: inline-block;
      width: 200px;
      background-color: #414EF9;
      border-radius: 3px;
      color: #ffffff !important;
      font-size: 15px;
      line-height: 45px;
      text-align: center;
      text-decoration: none;
      -webkit-text-size-adjust: none;
      mso-hide: all;
    }
    .button--green {
      background-color: #28DB67;
    }
    .button--red {
      background-color: #FF3665;
    }
    .button--blue {
      background-color: #414EF9;
    }

    /*Media Queries ------------------------------ */
    @media only screen and (max-width: 600px) {
      .email-body_inner,
      .email-footer {
        width: 100% !important;
      }
    }
    @media only screen and (max-width: 500px) {
      .button {
        width: 100% !important;
      }
    }
  </style>
</head>
<body>
  <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table class="email-content" width="100%" cellpadding="0" cellspacing="0">
          <!-- Logo -->
          <tr>
            <td class="email-masthead">
              <a class="email-masthead_name">K. Cinema</a>
            </td>
          </tr>
          <!-- Email Body -->
          <tr>
            <td class="email-body" width="100%">
              <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0">
                <!-- Body content -->
                <tr>
                  <td class="content-cell">
                    <h1>Verify your email address</h1>
                    <p>Thanks for signing up for K. CINEMA! We're excited to have you as an early user.</p>
                    <!-- Action -->
                    <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <div>
                            <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${verificationUrl}" style="height:45px;v-text-anchor:middle;width:200px;" arcsize="7%" stroke="f" fill="t">
                            <v:fill type="tile" color="#414EF9" />
                            <w:anchorlock/>
                            <center style="color:#ffffff;font-family:sans-serif;font-size:15px;">Verify Email</center>
                          </v:roundrect><![endif]-->
                            <a href="${verificationUrl}" class="button button--red" style="text-decoration: none">Verify Email</a>
                          </div>
                        </td>
                      </tr>
                    </table>
                    <p>Thanks,<br>The K. Cinema Team</p>
                    <!-- Sub copy -->
                    <table class="body-sub">
                      <tr>
                        <td>
                          <p class="sub">If you’re having trouble clicking the button, copy and paste the URL below into your web browser.
                          </p>
                          <p class="sub"><a href="${verificationUrl}">${verificationUrl}</a></p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="content-cell">
                    <p class="sub center">
                      K. Cinema Labs, Inc.
                      <br>Ha Noi, Viet Nam
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
  `;

    const emailResponse = await sendEmail(
      email,
      "Verify Your Email",
      emailContent
    );

    if (!emailResponse.success) {
      return res.status(500).json({ msg: "Failed to send verification email" });
    }

    return res.json({
      msg: "Registration successfully! Please verify your email.",
    });
  } catch (err) {
    console.error("Registration error:", err.message);
    return res.status(500).send("Server error");
  }
};

// @desc     Verify user email
// @access   Public
exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({ msg: "Invalid token" });
    }

    user.isVerified = true;
    await user.save();

    return res.send(`
      <html>

<head>
  <meta charset="utf-8" />
  <title></title>
  <style>
    * {
      box-sizing: border-box;
    }
  </style>
</head>

<body style="background-color: #f4f4f4; font-family: Roboto, arial, sans-serif">
  <div style="background-color: red; height: 140px;">
  </div>
  <div style="max-width: 550px; background-color: white; margin: -80px auto 0 auto; padding: 20px 60px 80px 60px;">
    <div style="  font-size: 30px; font-weight: 300; margin-top: 20px; text-align: center;"> Email Confirmed!</div>
    <br />
    <p>Congratulations! Your email has been confirmed and your account is ready. Please close this page and go back to the website to login.</p>
    <div class=" box-sizing: border-box; width: 100%;">
      <br />
      <br />
      <div style="font-size: 18px; text-align: center">
        Welcome to the K. Cinema!
      </div>

    </div>
  </div>
</body>

</html>
    `);
  } catch (error) {
    console.error("Email verification error:", error);
    return res.status(500).send("Server error");
  }
};

// @desc     Login user & get token
// @access   Public
exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, isAdmin } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ msg: "Please verify your email first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const customerRole = await Role.findOne({ name: "customer" });
    if (!customerRole) {
      return res.status(500).json({ msg: "Customer role not found" });
    }

    if (isAdmin) {
      const adminRole = await Role.findOne({ name: "admin" });
      if (user.role.toString() !== adminRole._id.toString()) {
        return res.status(403).json({ msg: "Access denied: Not an admin" });
      }
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        name: user.username,
        email: user.email,
        isVerified: user.isVerified,
        date: user.date,
        birthdate: user.dob,
        phone: user.phoneNumber,
        address: user.address,
        gender: user.gender,
        role: customerRole._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const { password: userPassword, ...userData } = user._doc;
    res.status(200).json({ ...userData, accessToken });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).send("Server error");
  }
};

// @desc     Logout user
// @access   Public
exports.logoutUser = (req, res) => {
  res.json({ msg: "User logged out successfully" });
};

// @desc     Forgot password - send OTP
// @access   Public
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ msg: "User with this email does not exist" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    user.resetPasswordOTP = otp;
    user.resetPasswordExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

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
      subject: "Your Password Reset OTP",
      html: `<h1>Password Reset Request</h1>
             <p>Your OTP for password reset is: <b>${otp}</b></p>
             <p>This OTP is valid for 5 minutes.</p>`,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending OTP:", error);
        return res.status(500).json({ msg: "Failed to send OTP" });
      }
      console.log("OTP email sent: " + info.response);
      return res.status(200).json({ msg: "OTP sent to your email" });
    });
  } catch (err) {
    console.error("Forgot Password error:", err.message);
    return res.status(500).send("Server error");
  }
};

// @desc     Reset password after OTP verification
// @access   Public
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    if (
      user.resetPasswordOTP !== Number(otp) ||
      user.resetPasswordExpiry < Date.now()
    ) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { password: hashedNewPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: "Error updating password" });
    }

    user.resetPasswordOTP = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    return res.status(200).json({ msg: "Password reset successful" });
  } catch (err) {
    console.error("Reset Password error:", err.message);
    return res.status(500).send("Server error");
  }
};
