const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: String,
  rows: {
    type: Number,
    required: true,
  },
  columns: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['2D', '3D', 'IMAX'],
    required: true,
  },
  seatLayout:[[Number]],
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
