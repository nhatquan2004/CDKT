const jwt = require('jsonwebtoken');

/**
 * Đăng nhập admin - so khớp với biến môi trường, không có bảng User trong DB
 */
const adminLogin = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập tên đăng nhập và mật khẩu.' });
  }

  // So khớp với env variables (không hash vì chỉ 1 admin duy nhất)
  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
  }

  // Tạo JWT token, hết hạn sau 8 tiếng (đủ cho 1 ngày tổ chức sự kiện)
  const token = jwt.sign(
    { username, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({
    message: 'Đăng nhập thành công!',
    token,
    admin: { username },
  });
};

module.exports = { adminLogin };
