const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ["customer", "admin", "staff"],
  },
});

module.exports = mongoose.model("Role", RoleSchema);
