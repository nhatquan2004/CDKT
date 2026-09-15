const Team = require('../models/Team');

// Cache in-memory — tồn tại suốt vòng đời process (chỉ reset khi Render restart)
// Với 10 team cố định, không cần Redis hay bất kỳ cơ chế phức tạp nào
let teamsCache = null;

// Lấy danh sách tất cả team
const getTeams = async (req, res) => {
  try {
    if (!teamsCache) {
      // Lần đầu: query DB, .lean() trả về plain object thay vì Mongoose document
      teamsCache = await Team.find().sort({ name: 1 }).lean();
    }
    res.json(teamsCache);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách team.' });
  }
};

module.exports = { getTeams };

