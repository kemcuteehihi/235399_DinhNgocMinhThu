import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Liên kết file giao diện

const API_URL = import.meta.env.VITE_API_URL || 'https://api-235399.onrender.com/api/devices';

function App() {
  const [devices, setDevices] = useState([]);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ deviceId: '', name: '', deviceType: '', room: '', status: 'Đang sử dụng' });

  useEffect(() => { fetchDevices(); }, []);

  const fetchDevices = async (searchQuery = '') => {
    try {
      const res = await axios.get(`${API_URL}?search=${searchQuery}`);
      setDevices(res.data);
    } catch (err) { console.error('Lỗi tải dữ liệu:', err); }
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
      } else {
        await axios.post(API_URL, formData);
      }
      setFormData({ deviceId: '', name: '', deviceType: '', room: '', status: 'Đang sử dụng' });
      fetchDevices();
    } catch (err) { alert('Lỗi xử lý: Trùng mã thiết bị hoặc thiếu thông tin'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa thiết bị này khỏi hệ thống?')) {
      await axios.delete(`${API_URL}/${id}`);
      fetchDevices();
    }
  };

  // Hàm chọn màu sắc cho trạng thái
  const getStatusClass = (status) => {
    switch (status) {
      case 'Đang sử dụng': return 'status-badge status-ok';
      case 'Hư hỏng': return 'status-badge status-error';
      case 'Đang sửa chữa': return 'status-badge status-warn';
      case 'Ngừng sử dụng': return 'status-badge status-stop';
      default: return 'status-badge';
    }
  };

  return (
    <div className="container">
      <h2>🎓 QUẢN LÝ THIẾT BỊ PHÒNG HỌC</h2>
      <p className="subtitle">Sinh viên thực hiện: Đinh Ngọc Minh Thư (235399)</p>
      
      <input 
        type="text" 
        className="search-box"
        placeholder="🔍 Nhập mã, tên hoặc phòng để tìm kiếm..." 
        value={search} 
        onChange={handleSearch} 
      />

      <form className="form-container" onSubmit={handleSubmit}>
        <input placeholder="Mã TB..." value={formData.deviceId} onChange={e => setFormData({...formData, deviceId: e.target.value})} required />
        <input placeholder="Tên thiết bị..." value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
        <input placeholder="Loại (VD: Máy chiếu)..." value={formData.deviceType} onChange={e => setFormData({...formData, deviceType: e.target.value})} required />
        <input placeholder="Phòng (VD: 101)..." value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})} required />
        <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
          <option>Đang sử dụng</option>
          <option>Hư hỏng</option>
          <option>Đang sửa chữa</option>
          <option>Ngừng sử dụng</option>
        </select>
        <button type="submit" className="btn-submit">
          {formData._id ? '💾 Cập nhật' : '➕ Thêm mới'}
        </button>
      </form>

      <table className="device-table">
        <thead>
          <tr>
            <th>Mã</th><th>Tên</th><th>Loại</th><th>Phòng</th><th>Trạng thái</th><th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {devices.map(d => (
            <tr key={d._id}>
              <td><strong>{d.deviceId}</strong></td>
              <td>{d.name}</td>
              <td>{d.deviceType}</td>
              <td>{d.room}</td>
              <td><span className={getStatusClass(d.status)}>{d.status}</span></td>
              <td>
                <button type="button" className="btn-edit" onClick={() => setFormData(d)}>Sửa</button>
                <button type="button" className="btn-delete" onClick={() => handleDelete(d._id)}>Xóa</button>
              </td>
            </tr>
          ))}
          {devices.length === 0 && (
            <tr>
              <td colSpan="6" style={{textAlign: 'center', padding: '30px', color: '#999'}}>
                Chưa có dữ liệu thiết bị nào trong hệ thống.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;