const express = require('express');
const router = express.Router();
const SeatController = require('../controllers/seatController');

router.post('/', SeatController.create);
router.get('/', SeatController.getAll);
router.get('/:id', SeatController.getById);
router.put('/:id', SeatController.update);
router.delete('/:id', SeatController.delete);

module.exports = router;
