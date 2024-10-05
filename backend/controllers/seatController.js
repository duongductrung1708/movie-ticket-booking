const SeatService = require('../services/seatService');

const SeatController = {
  create: async (req, res) => {
    try {
      const seat = await SeatService.create(req.body);
      res.status(201).json(seat);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const seats = await SeatService.getAll();
      res.status(200).json(seats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const seat = await SeatService.getById(req.params.id);
      if (seat) {
        res.status(200).json(seat);
      } else {
        res.status(404).json({ message: 'Seat not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const updatedSeat = await SeatService.update(req.params.id, req.body);
      res.status(200).json(updatedSeat);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      await SeatService.delete(req.params.id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = SeatController;
