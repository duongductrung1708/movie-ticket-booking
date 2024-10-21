const axios = require('axios');
const crypto = require('crypto');
const { createPayment, updatePayment } = require('../services/paymentService');
const { updateBooking } = require('../services/bookingService');
const { updateSeatLayout } = require('../services/showtimeService');


var accessKey = 'F8BBA842ECF85';
var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const publicPort = 'https://a8b7-118-70-211-232.ngrok-free.app'

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
      const booking = await updateBooking(bookingId, "done");
      await updatePayment(paymentId, "success")
      await updateSeatLayout(booking.showtime_id, booking.seat)
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