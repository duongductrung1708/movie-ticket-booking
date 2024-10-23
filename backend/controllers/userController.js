const User = require("../models/User");
const bcrypt = require("bcrypt");
const Role = require("../models/Role");
const sendEmail = require("../utils/sendEmail");
const generatePassword = require("../utils/utils");

const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const searchValue = req.query.searchValue || ""; // Get the search value from the query

    const adminRole = await Role.findOne({ name: "admin" });

    // Construct a search regex to match the search value in different fields
    const searchRegex = new RegExp(searchValue, "i"); // 'i' for case-insensitive

    const users = await User.find({
      role: { $ne: adminRole._id },
      $or: [
        { username: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
        { phoneNumber: { $regex: searchRegex } },
        { district: { $regex: searchRegex } },
        { address: { $regex: searchRegex } },
        { city: { $regex: searchRegex } },
      ],
    })
      .select("-password")
      .populate({
        path: "role",
        select: "name -_id",
      })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments({
      role: { $ne: adminRole._id },
      $or: [
        { username: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
        { phoneNumber: { $regex: searchRegex } },
        { district: { $regex: searchRegex } },
        { address: { $regex: searchRegex } },
        { city: { $regex: searchRegex } },
      ],
    });

    res.status(200).json({
      users,
      totalUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Server error");
  }
};

// Create a new user
const createUser = async (req, res) => {
  const {
    username,
    email,
    phoneNumber,
    dob,
    role,
    address,
    city,
    district,
    gender,
  } = req.body;

  try {
    // Check if role exists
    const existRole = await Role.findOne({ name: role });
    if (!existRole) {
      return res.status(400).json({ msg: "Role not found" });
    }

    // Check if username, email, or phoneNumber already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }, { phoneNumber }],
    });

    if (existingUser) {
      let errorMsg = "";
      if (existingUser.username === username) {
        errorMsg = "Username already exists";
      } else if (existingUser.email === email) {
        errorMsg = "Email already exists";
      } else if (existingUser.phoneNumber === phoneNumber) {
        errorMsg = "Phone number already exists";
      }

      return res.status(400).json({ msg: errorMsg });
    }

    // Generate a new password
    const generatedPassword = generatePassword(10, {
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSpecialCharacters: true,
    });

    // Hash the password
    const hashedNewPassword = await bcrypt.hash(generatedPassword, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      phoneNumber,
      dob,
      password: hashedNewPassword, // <-- This should be 'password' instead of 'hashedNewPassword'
      address,
      city,
      district,
      gender,
      role: existRole._id,
      isVerified: true,
    });

    // Save the new user
    await newUser.save();

    // Prepare the email content
    const emailContent = `
      <html>
        <body>
          <h1>Account Created Successfully</h1>
          <p>Welcome, ${username}!</p>
          <p>Your account has been successfully created. Below are your login details:</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Password:</strong> ${generatedPassword}</p>
          <p>Thank you for joining us!</p>
        </body>
      </html>
    `;

    // Send the email
    const emailResponse = await sendEmail(
      email,
      "Verify Your Email",
      emailContent
    );

    // Check if email was sent successfully
    if (!emailResponse.success) {
      return res.status(500).json({ msg: "Failed to send email" });
    }

    // Respond to the client
    return res.json({
      msg: "User created successfully! Please verify your email.",
      user: newUser
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
    dob,
    role,
    address,
    city,
    district,
    gender,
  } = req.body;

  try {
    const existRole = await Role.findOne({ name: role });
    if (!existRole) {
      return res.status(400).json({ msg: "Role not found" });
    }
    const updatedData = {
      username,
      email,
      phoneNumber,
      dob,
      role: existRole._id,
      address,
      city,
      district,
      gender,
    };
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

// Change user password
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

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ msg: "Password updated successfully" });
  } catch (err) {
    console.error("Error changing password:", err.message);
    res
      .status(500)
      .json({ msg: "Error changing password", error: err.message });
  }
};

//find or create a new user from google account
async function findOrCreateUserFromGoogle(googleUser) {
  const { email, name } = googleUser;

  let user = await User.findOne({ email });

  if (!user) {
    user = new User({
      username: name,
      email,
    });
    await user.save();
  }

  return user;
}

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  changePassword,
  findOrCreateUserFromGoogle
};
