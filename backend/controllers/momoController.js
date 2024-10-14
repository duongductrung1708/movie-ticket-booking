const PaymentRepository = require('../../repositories/payment/payment.repository');
const joinedSubjectRepo = require('../../repositories/trainee/joinedSubject.repository');

async function createPaymentLink(req, res, next) {
  const crypto = require('crypto');
  const fetch = require('node-fetch'); // Ensure node-fetch is installed and required

  const accessKey = 'F8BBA842ECF85';
  const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
  const orderInfo = req.body.userId + '-' + req.body.subjectId;
  const partnerCode = 'MOMO';
  const redirectUrl = 'http://localhost:3000/trainee/my-subject';
  const ipnUrl = ' https://b9cc-58-186-240-4.ngrok-free.app/payment/receive-momo-data';
  const requestType = "captureWallet";
  const amount = req.body.amount;
  const orderId = partnerCode + new Date().getTime();
  const requestId = orderId;
  const extraData = '';
  const orderGroupId = '';
  const autoCapture = true;
  const lang = 'vi';

  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
  const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: orderGroupId,
    signature: signature
  });

  const option = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody)
    },
    body: requestBody
  };

  try {
    const response = await fetch('https://test-payment.momo.vn/v2/gateway/api/create', option);
    const result = await response.json();

    if (response.ok) {
      return res.status(200).json(result);
    } else {
      console.error('Error response from MoMo:', result);
      return res.status(response.status).json(result);
    }
  } catch (error) {
    next(error)
  }
}

async function receiveDataFromMomo(req, res, next) {
  try {
    // Ensure req.body is present
    if (!req.body) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    let newTransaction;
    let newJoinedSubject;

    // Check if the resultCode indicates success
    if (req.body.resultCode === 0) {
      const orderInfo = req.body.orderInfo;
      console.log('Order Info:', orderInfo);

      // Split orderInfo to get traineeId and subjectId
      const [traineeId, subjectId] = orderInfo.split('-');
      console.log('Trainee ID:', traineeId, 'Subject ID:', subjectId);

      // Add joined subject to the database
      newJoinedSubject = await joinedSubjectRepo.addJoinedSubject({ traineeId, subjectId });

      // Create a new payment record in the database
      newTransaction = await PaymentRepository.createPayment(req.body);
    } else {
      // Handle cases where payment was not successful
      return res.status(400).json({ message: 'Payment failed or was not completed' });
    }

    // Return a response with details of newTransaction and newJoinedSubject
    return res.status(200).json({
      newJoinedSubject: newJoinedSubject || null,
      newTransaction: newTransaction || null
    });
  } catch (error) {
    // Pass errors to the error-handling middleware
    next(error);
  }
}


const MomoController = {
  createPaymentLink, receiveDataFromMomo
};
module.exports = MomoController;