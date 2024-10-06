const mongoose = require("mongoose");

const paymentMethodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    fee: {
        type: Number,
        required: false,
    },
}, {
    timestamps: true
});

const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);

module.exports = PaymentMethod;