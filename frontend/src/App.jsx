import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/devices';

function App() {
  const [devices, setDevices] = useState([]);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ deviceId: '', name: '', deviceType: '', room: '', status: 'Đang sử dụng' });

  useEffect(() => { fetchDevices(); }, []);

  const fetchDevices = async (searchQuery = '') => {
    try {
      const res = await axios.get(`${API_URL}?search=${searchQuery}`);
      setDevices(res.data);
    } catch (err) { alert('Lỗi tải dữ liệu'); }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchDevices(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData._id) {
        await axios.put(`${API_URL}/${formData._id}`, formData);
        alert('Cập nhật thành công');
      } else {
        await axios.post(API_URL, formData);
        alert('Thêm thành công');
      }
      setFormData({ deviceId: '', name: '', deviceType: '', room: '', status: 'Đang sử dụng' });
      fetchDevices();
    } catch (err) { alert('Lỗi xử lý: Trùng mã thiết bị hoặc thiếu thông tin'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa?')) {
      await axios.delete(`${API_URL}/${id}`);
      fetchDevices();
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Quản lý thiết bị phòng học - Đinh Ngọc Minh Thư (235399)</h2>
      
      <input type="text" placeholder="Tìm kiếm (Mã, tên, phòng)..." value={search} onChange={handleSearch} style={{ marginBottom: '20px', padding: '8px', width: '300px' }} />

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input placeholder="Mã TB" value={formData.deviceId} onChange={e => setFormData({...formData, deviceId: e.target.value})} required />
        <input placeholder="Tên TB" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
        <input placeholder="Loại" value={formData.deviceType} onChange={e => setFormData({...formData, deviceType: e.target.value})} required />
        <input placeholder="Phòng" value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})} required />
        <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
          <option>Đang sử dụng</option>
          <option>Hư hỏng</option>
          <option>Đang sửa chữa</option>
          <option>Ngừng sử dụng</option>
        </select>
        <button type="submit" style={{ padding: '5px 15px', cursor: 'pointer' }}>{formData._id ? 'Cập nhật' : 'Thêm mới'}</button>
      </form>

      <table border="1" width="100%" cellPadding="10" style={{ borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ backgroundColor: '#f2f2f2' }}>
          <tr>
            <th>Mã</th><th>Tên</th><th>Loại</th><th>Phòng</th><th>Trạng thái</th><th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {devices.map(d => (
            <tr key={d._id}>
              <td>{d.deviceId}</td><td>{d.name}</td><td>{d.deviceType}</td><td>{d.room}</td>
              <td style={{ color: d.status === 'Hư hỏng' ? 'red' : 'green', fontWeight: 'bold' }}>{d.status}</td>
              <td>
                <button onClick={() => setFormData(d)} style={{ marginRight: '5px', cursor: 'pointer' }}>Sửa</button>
                <button onClick={() => handleDelete(d._id)} style={{ cursor: 'pointer' }}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;