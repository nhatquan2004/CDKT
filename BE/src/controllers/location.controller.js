const Location = require('../models/Location');

// Cache in-memory — 6 điểm cố định, chỉ invalidate khi admin cập nhật
let locationsCache = null;

// Lấy danh sách tất cả 6 điểm check-in
const getLocations = async (req, res) => {
  try {
    if (!locationsCache) {
      locationsCache = await Location.find().sort({ index: 1 }).lean();
    }
    res.json(locationsCache);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách điểm.' });
  }
};

// Cập nhật title/description của 1 điểm (chỉ admin)
const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const location = await Location.findByIdAndUpdate(
      id,
      { title, description },
      { new: true, runValidators: true }
    );

    if (!location) {
      return res.status(404).json({ message: 'Không tìm thấy điểm check-in.' });
    }

    // Invalidate cache — lần GET tiếp theo sẽ load lại từ DB
    locationsCache = null;

    res.json({ message: 'Cập nhật điểm thành công!', location });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi cập nhật điểm.' });
  }
};

module.exports = { getLocations, updateLocation };

