const mongoose = require("mongoose");

const bookingDetailSchema = new mongoose.Schema({
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  service_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  quantity: { type: Number, required: true },
});

module.exports = mongoose.model("BookingDetail", bookingDetailSchema);
