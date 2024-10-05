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
      res.status(500).json({ error: error.message });
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
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = TheaterController;
