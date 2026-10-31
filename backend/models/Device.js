const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  deviceType: { type: String, required: true },
  room: { type: String, required: true },
  brand: String,
  model: String,
  quantity: { type: Number, default: 1 },
  status: { type: String, enum: ['Đang sử dụng', 'Hư hỏng', 'Đang sửa chữa', 'Ngừng sử dụng'], default: 'Đang sử dụng' },
  purchaseDate: Date,
  description: String
});

module.exports = mongoose.model('Device', deviceSchema);