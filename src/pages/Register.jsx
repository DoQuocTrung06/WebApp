import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdNoteAlt, MdVisibility, MdVisibilityOff } from "react-icons/md";
import './Auth.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState(''); 

 
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError(''); 

    
    if (!validatePassword(formData.password)) {
      setError("Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.");
      return;
    }

    
    if (formData.password !== formData.confirmPassword) {
      setError("Xác nhận mật khẩu không khớp!");
      return;
    }

    
    console.log("Đăng ký người dùng thành công:", formData);
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

  
        {error && (
          <div className="alert alert-danger py-2 mb-3" style={{ fontSize: '14px' }}>
            {error}
          </div>
        )}

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
          <div className="position-relative"> 
            <input 
              type={showPassword ? "text" : "password"} 
              className="form-control form-control-pro" 
              placeholder="Tối thiểu 8 ký tự, có chữ hoa và số"
              required
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={{ paddingRight: '45px' }} 
            />
            <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
            </button>
          </div>
        </div>

          <div className="mb-4">
          <label className="form-label">Xác nhận mật khẩu</label>
          <div className="position-relative">
            <input 
              type={showConfirmPassword ? "text" : "password"}
              className="form-control form-control-pro" 
              placeholder="Nhập lại mật khẩu"
              required
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              style={{ paddingRight: '45px' }}
            />
            <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
            >
              {showConfirmPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
            </button>
          </div>
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