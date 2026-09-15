require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./src/config/db');
const teamRoutes = require('./src/routes/team.routes');
const locationRoutes = require('./src/routes/location.routes');
const submissionRoutes = require('./src/routes/submission.routes');
const adminRoutes = require('./src/routes/admin.routes');
const cloudinaryRoutes = require('./src/routes/cloudinary.routes');
const seedData = require('./src/seed');

const app = express();

// ⚡ Health check — route đầu tiên, không qua middleware nào, không query DB
// UptimeRobot ping mỗi 5 phút để giữ Render không sleep
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Kết nối MongoDB
connectDB().then(() => {
  // Seed dữ liệu mặc định sau khi kết nối thành công
  seedData();
});

// CORS: cho phép request từ frontend
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || '*',
    credentials: true,
  })
);

// Parse JSON body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/teams', teamRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);

module.exports = app;

