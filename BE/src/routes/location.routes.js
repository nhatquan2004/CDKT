const express = require('express');
const router = express.Router();
const { getLocations, updateLocation } = require('../controllers/location.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Public: lấy danh sách điểm
router.get('/', getLocations);

// Admin: cập nhật title/description điểm
router.put('/:id', authMiddleware, updateLocation);

module.exports = router;
