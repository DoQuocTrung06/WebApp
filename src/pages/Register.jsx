import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdNoteAlt } from "react-icons/md";
import './Auth.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const handleRegister = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }
    // Backend sẽ xử lý băm mật khẩu (bcrypt) tại đây
    console.log("Đăng ký người dùng:", formData);
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <MdNoteAlt size={30} />
        </div>
        <h2 className="auth-title">Tạo tài khoản</h2>
        <p className="auth-subtitle">Bắt đầu hành trình ghi chú chuyên nghiệp của bạn</p>

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">Họ và tên</label>
            <input 
              type="text" 
              className="form-control form-control-pro" 
              placeholder="Nguyễn Văn A"
              required
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-control form-control-pro" 
              placeholder="name@example.com"
              required
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mật khẩu</label>
            <input 
              type="password" 
              className="form-control form-control-pro" 
              placeholder="Tối thiểu 8 ký tự"
              required
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Xác nhận mật khẩu</label>
            <input 
              type="password" 
              className="form-control form-control-pro" 
              placeholder="Nhập lại mật khẩu"
              required
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
          </div>

          <button type="submit" className="btn-auth">Đăng ký</button>
        </form>

        <div className="auth-footer">
          Đã có tài khoản? <Link to="/login" className="auth-link">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;