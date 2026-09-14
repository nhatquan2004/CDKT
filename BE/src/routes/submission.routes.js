const express = require('express');
const router = express.Router();
const { createSubmission, getSubmissions } = require('../controllers/submission.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

// Public: team nộp minh chứng (multipart/form-data với field 'image')
router.post('/', upload.single('image'), createSubmission);

// Admin: xem tất cả minh chứng
router.get('/', authMiddleware, getSubmissions);

module.exports = router;
