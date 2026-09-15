const Submission = require('../models/Submission');
const Team = require('../models/Team');
const Location = require('../models/Location');

// Team nộp ảnh minh chứng
const createSubmission = async (req, res) => {
  try {
    const { teamId, locationId, imageUrl } = req.body;

    // Kiểm tra có URL ảnh không
    if (!imageUrl) {
      return res.status(400).json({ message: 'Vui lòng tải lên ảnh minh chứng.' });
    }

    // Kiểm tra team tồn tại
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Không tìm thấy team.' });
    }

    // Kiểm tra location tồn tại
    const location = await Location.findById(locationId);
    if (!location) {
      return res.status(404).json({ message: 'Không tìm thấy điểm check-in.' });
    }

    const submission = await Submission.create({
      team: teamId,
      location: locationId,
      imageUrl,
    });

    // Log ra console theo định dạng yêu cầu
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0]; // HH:mm:ss
    console.log(`\n📍 TEAM: ${team.name}`);
    console.log(`   CHECK IN ĐIỂM: ${location.index} - ${location.title || '(Chưa đặt tên)'}`);
    console.log(`   THỜI GIAN: ${timeStr}\n`);

    res.status(201).json({
      message: 'Đã nộp minh chứng thành công!',
      submission: await submission.populate(['team', 'location']),
    });
  } catch (error) {
    console.error('Lỗi tạo submission:', error);
    res.status(500).json({ message: 'Lỗi server khi nộp minh chứng.' });
  }
};

// Lấy danh sách tất cả submissions (chỉ admin)
const getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate('team', 'name code')
      .populate('location', 'index title')
      .sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách minh chứng.' });
  }
};

// Lấy danh sách locationId đã check-in của 1 team (public — không cần auth)
const getMySubmissions = async (req, res) => {
  try {
    const { teamId } = req.params;
    const submissions = await Submission.find({ team: teamId }, 'location').lean();
    const locationIds = submissions.map((s) => s.location.toString());
    res.json(locationIds);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server.' });
  }
};

module.exports = { createSubmission, getSubmissions, getMySubmissions };
