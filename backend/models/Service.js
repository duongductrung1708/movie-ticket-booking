const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, // ID cho mỗi service
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  description: { type: String },
});

module.exports = mongoose.model("Service", serviceSchema);
