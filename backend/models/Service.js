const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  description: { type: String },
  quantity: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model("Service", serviceSchema);
