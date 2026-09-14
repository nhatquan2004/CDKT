const express = require('express');
const router = express.Router();
const { adminLogin } = require('../controllers/admin.controller');

// Đăng nhập admin - public
router.post('/login', adminLogin);

module.exports = router;
