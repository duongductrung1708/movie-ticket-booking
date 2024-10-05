const Seat = require('../models/Seat');

const SeatService = {
  create: async (seatData) => {
    const seat = new Seat(seatData);
    return await seat.save();
  },

  getAll: async () => {
    return await Seat.find().populate('roomId');
  },

  getById: async (seatId) => {
    return await Seat.findById(seatId).populate('roomId');
  },

  update: async (seatId, seatData) => {
    return await Seat.findByIdAndUpdate(seatId, seatData, { new: true });
  },

  delete: async (seatId) => {
    return await Seat.findByIdAndDelete(seatId);
  }
};

module.exports = SeatService;
