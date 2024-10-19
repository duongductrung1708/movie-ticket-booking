const express = require('express');
const momoController = require('../controllers/momoController');
const momoPaymentRouter = express.Router();

momoPaymentRouter.post("/", momoController.createPayment)

module.exports = momoPaymentRouter;

