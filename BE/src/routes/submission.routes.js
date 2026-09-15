const express = require('express');
const router = express.Router();
const { createSubmission, getSubmissions, getMySubmissions } = require('../controllers/submission.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Public: lấy danh sách locationId đã check-in của 1 team (dùng để sync trạng thái bản đồ)
router.get('/my/:teamId', getMySubmissions);

// Public: team nộp minh chứng — imageUrl đã được upload thẳng lên Cloudinary từ client
router.post('/', createSubmission);

// Admin: xem tất cả minh chứng
router.get('/', authMiddleware, getSubmissions);

module.exports = router;
