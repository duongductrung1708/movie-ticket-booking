const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: String,
  type: {
    type: String,
    enum: ['2D', '3D', 'IMAX'],
    required: true,
  },
  seatLayout:[[Number]],
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
