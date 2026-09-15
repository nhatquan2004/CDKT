const express = require('express');
const router = express.Router();
const { getSignature } = require('../controllers/cloudinary.controller');

// Tạo signed signature để client upload thẳng lên Cloudinary (không cần auth vì file đi thẳng)
router.post('/signature', getSignature);

module.exports = router;
