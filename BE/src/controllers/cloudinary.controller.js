const cloudinary = require('../config/cloudinary');

// Tạo chữ ký để client upload thẳng lên Cloudinary
const getSignature = (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = 'cdkt-checkin';

    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      folder,
    });
  } catch (error) {
    console.error('Lỗi tạo chữ ký Cloudinary:', error);
    res.status(500).json({ message: 'Không thể tạo chữ ký upload.' });
  }
};

module.exports = { getSignature };
