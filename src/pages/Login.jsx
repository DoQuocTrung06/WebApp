import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdNoteAlt, MdVisibility, MdVisibilityOff } from "react-icons/md";
import './Auth.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Đăng nhập với:", formData);
    navigate('/');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <MdNoteAlt size={30} />
        </div>
        
        <h2 className="auth-title">Chào mừng trở lại</h2>
        <p className="auth-subtitle mb-4">Vui lòng đăng nhập để tiếp tục</p>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input 
              type="email" 
              className="form-control form-control-pro" 
              placeholder="Email của bạn"
              required
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="mb-2">
            <div className="position-relative">
              <input 
                type={showPassword ? "text" : "password"} 
                className="form-control form-control-pro input-password-pro" 
                placeholder="Mật khẩu"
                required
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button 
                type="button" 
                className="password-toggle-btn shadow-none"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-login-main">Đăng nhập</button>
          
          <button 
            type="button" 
            className="btn-forgot-pass"
            onClick={() => navigate('/forgot-password')} // Chuyển trang
          >
            Quên mật khẩu?
          </button>

          <div className="auth-divider"></div>

          <button 
            type="button" 
            className="btn-create-account"
            onClick={() => navigate('/register')}
          >
            Tạo tài khoản mới
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;