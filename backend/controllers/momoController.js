const axios = require('axios');

const momoController = {
  createPayment: async (req, res) => {
    //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
    //parameters body {orderInfo,amount, items}
    var accessKey = 'F8BBA842ECF85';
    var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    var orderInfo = req.body.orderInfo;
    var partnerCode = 'MOMO';
    var redirectUrl = 'https://localhost:3000';
    var ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
    var requestType = "payWithMethod";
    var amount = req.body.amount;
    var orderId = partnerCode + new Date().getTime();
    var requestId = orderId;
    var extraData = '';
    var orderGroupId = '';
    var autoCapture = true;
    var lang = 'vi';
    // var items = req.body.items;
    // var items = [
    //   {
    //     "id": "204727",
    //     "name": "YOMOST Bac Ha&Viet Quat 170ml",
    //     "description": "YOMOST Sua Chua Uong Bac Ha&Viet Quat 170ml/1 Hop",
    //     "category": "beverage",
    //     "imageUrl": "https://momo.vn/uploads/product1.jpg",
    //     "manufacturer": "Vinamilk",
    //     "price": 11000,
    //     "quantity": 5,
    //     "unit": "hộp",
    //     "totalPrice": 55000,
    //     "taxAmount": "200"
    //   }
    // ]

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
    //puts raw signature
    console.log("--------------------RAW SIGNATURE----------------")
    console.log(rawSignature)
    //signature
    const crypto = require('crypto');
    var signature = crypto.createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');
    console.log("--------------------SIGNATURE----------------")
    console.log(signature)

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId: requestId,
      // items,
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
        message: error.data
      })
    }
  }
}

module.exports = momoController;