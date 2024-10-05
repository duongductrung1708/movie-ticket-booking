const Theater = require('../models/Theater');

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
    return await Theater.findByIdAndDelete(theaterId);
  }
};

module.exports = TheaterService;
