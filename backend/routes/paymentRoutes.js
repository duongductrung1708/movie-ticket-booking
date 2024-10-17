const express = require("express");
const {
  createPayment,
  updatePayment,
  getPayment,
  getPaymentById,
} = require("../controllers/paymentController");
// const MomoController = require("../controllers/momoController");

const paymentRouter = express.Router();

// Get all payments
paymentRouter.get("/", getPayment);

// Get payment by ID
paymentRouter.get("/:id", getPaymentById);

// Create a payment
paymentRouter.post("/", createPayment);

// Update payment by ID
paymentRouter.put("/:id", updatePayment);

// Route to create a payment link (MoMo)
// paymentRouter.post("/create-momo-link", MomoController.createPaymentLink);

// Route to receive data from MoMo IPN (Instant Payment Notification)
// paymentRouter.post("/receive-momo-data", MomoController.receiveDataFromMomo);

module.exports = paymentRouter;
