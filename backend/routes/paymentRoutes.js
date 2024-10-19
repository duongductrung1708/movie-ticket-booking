const express = require("express");
const {
  createPayment,
  updatePayment,
  getPayment,
  getPaymentById,
} = require("../controllers/paymentController");

const paymentRouter = express.Router();

// Get all payments
paymentRouter.get("/", getPayment);

// Get payment by ID
paymentRouter.get("/:id", getPaymentById);

// Create a payment
paymentRouter.post("/", createPayment);

// Update payment by ID
paymentRouter.put("/:id", updatePayment);

module.exports = paymentRouter;
