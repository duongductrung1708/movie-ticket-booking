const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const seatSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'occupied'], // Example statuses
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['Regular', 'VIP'],
    required: true,
  },
});

const Seat = mongoose.model('Seat', seatSchema);
module.exports = Seat;
