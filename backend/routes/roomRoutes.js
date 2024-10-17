const express = require('express');
const router = express.Router();
const RoomController = require('../controllers/roomController');

router.post('/', RoomController.create);
router.get('/', RoomController.getAll);
router.get('/theater/:id', RoomController.getRoomsByTheaterId);
router.get('/:id', RoomController.getById);
router.put('/:id', RoomController.update);
router.delete('/:id', RoomController.delete);

module.exports = router;
