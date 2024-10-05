const Room = require('../models/Room');
const Seat = require('../models/Seat');

const RoomService = {
  create: async (roomData) => {
    const room = new Room(roomData);
    return await room.save();
  },

  getAll: async () => {
    return await Room.find().populate('theater_id');
  },

  getById: async (roomId) => {
    return await Room.findById(roomId).populate('theater_id');
  },

  update: async (roomId, roomData) => {
    return await Room.findByIdAndUpdate(roomId, roomData, { new: true });
  },

  delete: async (roomId) => {
    await Seat.deleteMany({ roomId: roomId });

    return await Room.findByIdAndDelete(roomId);
  }
};

module.exports = RoomService;
