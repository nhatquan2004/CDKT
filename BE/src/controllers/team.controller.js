const Team = require('../models/Team');

// Lấy danh sách tất cả team
const getTeams = async (req, res) => {
  try {
    const teams = await Team.find().sort({ name: 1 });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách team.' });
  }
};

module.exports = { getTeams };
