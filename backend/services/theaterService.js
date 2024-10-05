const Theater = require('../models/Theater');
const Room = require('../models/Room');
const Seat = require('../models/Seat');

const TheaterService = {
  create: async (theaterData) => {
    const theater = new Theater(theaterData);
    return await theater.save();
  },

  getAll: async () => {
    return await Theater.find();
  },

  getById: async (theaterId) => {
    return await Theater.findById(theaterId);
  },

  update: async (theaterId, theaterData) => {
    return await Theater.findByIdAndUpdate(theaterId, theaterData, { new: true });
  },

  delete: async (theaterId) => {
    const rooms = await Room.find({ theater_id: theaterId });
    
    for (let room of rooms) {
      await Seat.deleteMany({ roomId: room._id });
    }

    await Room.deleteMany({ theater_id: theaterId });

    return await Theater.findByIdAndDelete(theaterId);
  }
};

module.exports = TheaterService;
