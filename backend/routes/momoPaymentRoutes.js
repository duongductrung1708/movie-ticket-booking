const express = require('express');
const momoController = require('../controllers/momoController');
const momoPaymentRouter = express.Router();

momoPaymentRouter.post("/callback", momoController.getPaymentCallBack)
momoPaymentRouter.post("/transaction-status", momoController.getTransactionStatus)
momoPaymentRouter.post("/", momoController.createPayment)


module.exports = momoPaymentRouter;

