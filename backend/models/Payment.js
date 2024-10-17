const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    paymentMethodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PaymentMethod',
        required: true,
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
    },
    status: {
        type: String,
        enum:
            ['pending', 'success', 'failed'],
    }
}, {
    timestamps: {
        type: String
    },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;