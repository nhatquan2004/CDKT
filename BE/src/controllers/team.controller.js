const Team = require('../models/Team');

// Cache in-memory — tồn tại suốt vòng đời process (chỉ reset khi Render restart)
// Với 10 team cố định, không cần Redis hay bất kỳ cơ chế phức tạp nào
let teamsCache = null;

// Lấy danh sách tất cả team
const getTeams = async (req, res) => {
  try {
    if (!teamsCache) {
      const raw = await Team.find().lean();
      // Sort theo số trong tên: "Team 2" trước "Team 10" (tránh sort chữ cái)
      teamsCache = raw.sort((a, b) => {
        const numA = parseInt(a.name.replace(/\D/g, ''), 10) || 0;
        const numB = parseInt(b.name.replace(/\D/g, ''), 10) || 0;
        return numA - numB;
      });
    }
    res.json(teamsCache);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách team.' });
  }
};

module.exports = { getTeams };

