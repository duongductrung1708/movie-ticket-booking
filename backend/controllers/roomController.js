const RoomService = require('../services/roomService');

const RoomController = {
  create: async (req, res) => {
    try {
      const room = await RoomService.create(req.body);
      res.status(201).json(room);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const rooms = await RoomService.getAll();
      res.status(200).json(rooms);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const room = await RoomService.getById(req.params.id);
      if (room) {
        res.status(200).json(room);
      } else {
        res.status(404).json({ message: 'Room not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const updatedRoom = await RoomService.update(req.params.id, req.body);
      res.status(200).json(updatedRoom);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      await RoomService.delete(req.params.id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = RoomController;
