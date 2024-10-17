const Room = require('../models/Room');
const Seat = require('../models/Seat');
const Theater = require('../models/Theater')

const RoomService = {
  create: async (roomData) => {
    const room = new Room(roomData);
    return await room.save();
  },

  getAll: async () => {
    return await Room.find();
  },

  getById: async (roomId) => {
    return await Room.findById(roomId);
  },

  update: async (roomId, roomData) => {
    return await Room.findByIdAndUpdate(roomId, roomData, { new: true });
  },

  delete: async (roomId) => {
    await Seat.deleteMany({ roomId: roomId });

    return await Room.findByIdAndDelete(roomId);
  },
  getRoomsByTheaterId: async (theaterId) => {
    const theater = await Theater.findById(theaterId).populate({
      path:"rooms"
    });
    return theater;
  }
};

module.exports = RoomService;
