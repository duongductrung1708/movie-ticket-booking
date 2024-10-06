const express = require('express');
const { createPayment, updatePayment, getPayment, getPaymentById } = require('../controllers/paymentController');

const paymentRouter = express.Router()

//get all payment
paymentRouter.get('/', getPayment)

//get payment by :id
paymentRouter.get('/:id', getPaymentById)

//create payment
paymentRouter.post('/', createPayment)

//update payment
paymentRouter.put('/:id', updatePayment)
