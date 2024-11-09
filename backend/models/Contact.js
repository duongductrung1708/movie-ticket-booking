const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      enum: [
        "buy group tickets",
        "rent theaters for events",
        "advertise at theaters",
      ],
      required: true,
    },
    area: {
      type: String,
      enum: ["Hanoi", "HCMC", "Da Nang"],
      required: true,
    },
    theater: {
      type: Schema.Types.ObjectId,
      ref: "Theater",
    },
    details: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;
