const express = require('express');
const router = express.Router();
const { createSubmission, getSubmissions } = require('../controllers/submission.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Public: team nộp minh chứng — imageUrl đã được upload thẳng lên Cloudinary từ client
router.post('/', createSubmission);

// Admin: xem tất cả minh chứng
router.get('/', authMiddleware, getSubmissions);

module.exports = router;
