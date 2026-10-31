require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Device = require('./models/Device');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));

app.get('/api/devices', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { deviceId: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } },
          { room: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const devices = await Device.find(query);
    res.json(devices);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/devices/:id', async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) return res.status(404).json({ message: 'Không tìm thấy thiết bị' });
    res.json(device);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/devices', async (req, res) => {
  try {
    const newDevice = new Device(req.body);
    const savedDevice = await newDevice.save();
    res.status(201).json(savedDevice);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.put('/api/devices/:id', async (req, res) => {
  try {
    const updatedDevice = await Device.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedDevice);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.delete('/api/devices/:id', async (req, res) => {
  try {
    await Device.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xóa thiết bị' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));