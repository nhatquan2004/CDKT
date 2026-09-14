const Team = require('./models/Team');
const Location = require('./models/Location');

/**
 * Seed dữ liệu mặc định:
 * - 10 Team (TEAM 1 -> TEAM 10)
 * - 6 Location với toạ độ x,y phần trăm trên ảnh bản đồ
 * Chỉ seed nếu collection rỗng
 */
const seedData = async () => {
  try {
    // Seed Teams
    const teamCount = await Team.countDocuments();
    if (teamCount === 0) {
      const teams = Array.from({ length: 10 }, (_, i) => ({
        name: `TEAM ${i + 1}`,
        code: `team-${i + 1}`,
      }));
      await Team.insertMany(teams);
      console.log('✅ Đã seed 10 team mặc định.');
    }

    // Seed Locations (6 điểm trên bản đồ TP.HCM)
    const locationCount = await Location.countDocuments();
    if (locationCount === 0) {
      const locations = [
        {
          index: 1,
          x: 20,
          y: 25,
          title: 'Điểm 1 – Nhà thờ Đức Bà',
          description: 'Hãy chụp ảnh cùng biển trước cổng Nhà thờ Đức Bà và hoàn thành thử thách bí mật!',
        },
        {
          index: 2,
          x: 45,
          y: 18,
          title: 'Điểm 2 – Bến Nhà Rồng',
          description: 'Check in tại cầu cảng lịch sử và trả lời câu hỏi về Bác Hồ.',
        },
        {
          index: 3,
          x: 70,
          y: 35,
          title: 'Điểm 3 – Chợ Bến Thành',
          description: 'Tìm biển hiệu chợ màu vàng và chụp ảnh toàn cảnh cổng chính.',
        },
        {
          index: 4,
          x: 30,
          y: 60,
          title: 'Điểm 4 – Dinh Độc Lập',
          description: 'Hoàn thành mini-game tại sân trước Dinh Độc Lập để nhận mã thử thách tiếp theo.',
        },
        {
          index: 5,
          x: 60,
          y: 65,
          title: 'Điểm 5 – Phố đi bộ Nguyễn Huệ',
          description: 'Chụp ảnh cả team trước đài phun nước và ghi lại video ngắn 15 giây.',
        },
        {
          index: 6,
          x: 80,
          y: 78,
          title: 'Điểm 6 – Công viên Tao Đàn',
          description: 'Đây là điểm đích! Hoàn thành thử thách cuối cùng để về đích.',
        },
      ];
      await Location.insertMany(locations);
      console.log('✅ Đã seed 6 điểm check-in mặc định.');
    }
  } catch (error) {
    console.error('❌ Lỗi seed dữ liệu:', error.message);
  }
};

module.exports = seedData;
