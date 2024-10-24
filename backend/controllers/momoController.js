const axios = require('axios');
const crypto = require('crypto');
const { createPayment, updatePayment } = require('../services/paymentService');
const { updateBooking } = require('../services/bookingService');
const { updateSeatLayout } = require('../services/showtimeService');
// paymentController.js
const { clearBookingTimeout } = require('../services/timeoutManager');
const User = require('../models/User');
const Booking = require('../models/Booking');
const sendEmail = require('../utils/sendEmail');

var accessKey = 'F8BBA842ECF85';
var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const publicPort = 'https://3a5b-116-96-47-119.ngrok-free.app'
// const publicPort = 'https://2475-2001-ee0-40c1-5d82-6189-13b5-9db6-72b4.ngrok-free.app'

const momoController = {
  createPayment: async (req, res) => {
    let paymentResponse;
    try {
      const { orderInfo, amount, bookingId } = req.body;
      paymentResponse = await createPayment(amount, bookingId, "momo", "pending")
      console.log(paymentResponse);
    } catch (error) {
      console.log("Payment: ", error);

    }


    //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
    //parameters body {orderInfo,amount, items}
    var orderInfo = req.body.orderInfo + "-" + paymentResponse._id;
    var partnerCode = 'MOMO';
    var redirectUrl = 'http://localhost:3000/booking-result';
    var ipnUrl = publicPort + '/api/momo/callback';
    var requestType = "payWithMethod";
    var amount = req.body.amount;
    var orderId = partnerCode + new Date().getTime();
    var requestId = orderId;
    var extraData = '';
    var orderGroupId = '';
    var autoCapture = true;
    var lang = 'en';

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
    //puts raw signature
    // console.log("--------------------RAW SIGNATURE----------------")
    // console.log(rawSignature)
    //signature
    var signature = crypto.createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');
    // console.log("--------------------SIGNATURE----------------")
    // console.log(signature)

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      orderExpireTime: 300000000,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      signature: signature
    });

    const options = {
      method: 'POST',
      url: 'https://test-payment.momo.vn/v2/gateway/api/create',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
      data: requestBody,
    }

    let result;
    try {
      result = await axios(options);
      return res.status(200).json(result.data);
    } catch (error) {
      return res.status(500).json({
        message: error
      })
    }
  },

  getPaymentCallBack: async (req, res) => {
    console.log("CALLBACKK");
    console.log(req.body);
    if (req.body.message == "Successful.") {
      const [bookingId, paymentId] = req.body.orderInfo.split('-');

      // Clear the booking timeout as payment is successful
      clearBookingTimeout(bookingId);

      const booking = await updateBooking(bookingId, "done");
      await updatePayment(paymentId, "success")
      await updateSeatLayout(booking.showtime_id, booking.seat)
      const bookingDetailsUrl = `${process.env.FRONT_END_URL}/booking/${bookingId}`

      //send email booking
      const emailTemplate = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 20px;
          }
          .container {
              border: 1px solid #ddd;
              padding: 20px;
              max-width: 400px;
              margin: auto;
              box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
          }
          .qr-code {
              margin: 20px 0;
          }
          .button {
              background-color: #4CAF50;
              color: white;
              padding: 10px 20px;
              text-align: center;
              text-decoration: none;
              display: inline-block;
              font-size: 16px;
              border-radius: 5px;
          }
          .button:hover {
              background-color: #45a049;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h2>Booking Confirmation</h2>
          <p>🎉 <strong>Success!</strong> You've successfully booked your film tickets!</p>
          <p>Please click on the QR code below or scan it to know more details about your booking:</p>
          <div class="qr-code">
              <a href="${bookingDetailsUrl}" target="_blank">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?data=${bookingDetailsUrl}&amp;size=100x100" alt="QR Code" title="Scan to see booking details">
              </a>
          </div>
          <a href="${bookingDetailsUrl}" class="button">View Booking Details</a>
      </div>
  </body>
  </html>
  `;
      const user = await User.findById(booking.user_id);

      await sendEmail(
        user.email,
        "Booking Movie Success",
        emailTemplate
      );
    }
  },
  getTransactionStatus: async (req, res) => {
    const { orderId } = req.body;

    const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = JSON.stringify({
      partnerCode: "MOMO",
      requestId: orderId,
      orderId: orderId,
      signature,
      lang: 'en'
    })

    const options = {
      method: 'POST',
      url: 'https://test-payment.momo.vn/v2/gateway/api/query',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
      data: requestBody,
    }

    let result = await axios(options)
    return res.status(200).json(result.data)
  }
}

module.exports = momoController;