const Payment = require("../models/Payment");
const PaymentMethod = require("../models/PaymentMethod")

const paymentService = {
    createPayment: async (amount, bookingId, method, status) => {
        try {
            const paymentMethod = await PaymentMethod.findOne({ name: method })
            console.log(paymentMethod._id.toString());
            const payment = new Payment({
                amount: amount,
                bookingId: bookingId,
                paymentMethodId: paymentMethod._id.toString(),
                status: status
            })
            await payment.save()
            return payment;
        } catch (error) {
            console.log(error);
        }
    },
    updatePayment: async (id, status) => {
        try {
            const payment = await Payment.findById(id)
            payment.status = status
            await payment.save()
            console.log("Payment", payment);
            return payment;
        } catch (error) {
            console.log(error);
        }
    },
}

module.exports = paymentService