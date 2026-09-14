require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  console.log(`📌 API Base: http://localhost:${PORT}/api`);
  console.log(`☁️ Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME ? 'Đã cấu hình (' + process.env.CLOUDINARY_CLOUD_NAME + ')' : 'Chưa cấu hình'}`);
});
