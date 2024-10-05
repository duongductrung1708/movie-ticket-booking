const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const seatSchema = new Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  seat_row: {
    type: String,
    required: true,
  },
  seat_column: {
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
