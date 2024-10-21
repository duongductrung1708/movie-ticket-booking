const Payment = require('../models/Payment')

//get all payment
const getPayment = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('paymentMethodId') 
            .populate('bookingId')
            .exec();
        console.log(payments);
        
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//get payment by id
const getPaymentById = async (req, res) => {
    try {
        const id = req.params.id
        const payment = await Payment.findById(id)
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" })
        }
        res.status(200).json(payment)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


//create payment
// const createPayment = async (req, res) => {
//     try {
//         const { amount, paymentMethod } = req.body;
//         const payment = await Payment.create({ amount, paymentMethod });
//         res.status(201).json(payment);
//     } catch (error) {
//         res.status(500).json({ message: 'Error creating payment' });
//     }
// }
const createPayment = async (req, res) => {
    try {
        const { amount, paymentMethodId, bookingId, status } = req.body;
        const payment = new Payment({
            amount,
            paymentMethodId,
            bookingId,
            status,
        });
        await payment.save();
        res.status(201).json(payment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


//update payment
const updatePayment = async (req, res) => {
    try {
        const { amount, paymentMethodId } = req.body;
        const paymentId = req.params.id;
        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        payment.amount = amount;
        payment.paymentMethodId = paymentMethodId;
        await payment.save();
        return res.json(payment);
    } catch {
        return res.status(400).json({ message: "Invalid request" });
    }
}


module.exports = {
    getPayment,
    getPaymentById,
    createPayment,
    updatePayment,
}