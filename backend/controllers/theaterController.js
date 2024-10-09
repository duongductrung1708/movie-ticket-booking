const TheaterService = require('../services/theaterService');

const TheaterController = {
  create: async (req, res) => {
    try {
      const theater = await TheaterService.create(req.body);
      res.status(201).json(theater);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const theaters = await TheaterService.getAll();
      res.status(200).json(theaters);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const theater = await TheaterService.getById(req.params.id);
      if (theater) {
        res.status(200).json(theater);
      } else {
        res.status(404).json({ message: 'Theater not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message, message: 'Theater not found' });
    }
  },

  update: async (req, res) => {
    try {
      const updatedTheater = await TheaterService.update(req.params.id, req.body);
      res.status(200).json(updatedTheater);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      await TheaterService.delete(req.params.id);
      res.status(204).json({ message: "delete theater success" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getShowtimesByTheater: async (req, res) => {
    try {
      const showtimes = await TheaterService.getShowtimesByTheater(req.params.id);
      if (showtimes.length > 0) {
        res.status(200).json(showtimes);
      } else {
        res.status(404).json({ message: 'No showtimes found for this theater' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createTheater: async (req, res) => {
    res.json(req)
  }
};

module.exports = TheaterController;
