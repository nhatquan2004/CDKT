const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema(
  {
    index: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
      max: 6,
    },
    // Toạ độ phần trăm trên ảnh bản đồ (0-100)
    x: { type: Number, required: true, default: 50 },
    y: { type: Number, required: true, default: 50 },
    title: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Location', LocationSchema);
