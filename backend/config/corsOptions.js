const cors = require('cors');

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  // Thêm các origin khác vào đây
];

const corsOptions = {
  origin: (origin, callback) => {
    // Kiểm tra nếu origin trong danh sách được phép hoặc nếu không có origin (dành cho các request không có CORS, ví dụ như postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Cho phép gửi cookie và các thông tin chứng thực khác
};


module.exports = cors(corsOptions);
