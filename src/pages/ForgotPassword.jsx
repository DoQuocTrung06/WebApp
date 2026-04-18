import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdNoteAlt, MdOutlineSearch, MdArrowBack } from "react-icons/md";
import './Auth.css';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Tìm kiếm tài khoản với email:", email);
    alert(`Hệ thống đang tìm kiếm tài khoản: ${email}\nKết quả sẽ được gửi qua email nếu tài khoản tồn tại.`);
  };

  return (
    <div className="auth-container">
      {/* Nới rộng khung ra một xíu (460px) để chứa đủ dòng chữ trên 1 hàng */}
      <div className="auth-card" style={{ maxWidth: '460px' }}>
        <div className="auth-logo">
          <MdNoteAlt size={30} />
        </div>

        <h3 className="auth-title">Tìm tài khoản của bạn</h3>
        
        {/* Ép chữ không được xuống hàng bằng whiteSpace: 'nowrap' */}
        <p className="auth-subtitle mb-4 mt-2" style={{ whiteSpace: 'nowrap', fontSize: '0.92rem' }}>
          Vui lòng nhập email để tìm kiếm tài khoản của bạn.
        </p>

        <form onSubmit={handleSearch}>
          <div className="mb-4">
            <input 
              type="email" 
              className="form-control form-control-pro" 
              placeholder="Nhập email của bạn..."
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="d-flex gap-3">
            <button 
              type="button" 
              className="btn-forgot-pass m-0 d-flex justify-content-center align-items-center gap-2"
              onClick={() => navigate('/login')}
              style={{ flex: 1, padding: '12px', fontSize: '1.05rem' }}
            >
              <MdArrowBack size={20} /> Hủy
            </button>
            
            <button 
              type="submit" 
              className="btn-login-main m-0 d-flex justify-content-center align-items-center gap-2"
              style={{ flex: 1, padding: '12px', fontSize: '1.05rem' }}
            >
              <MdOutlineSearch size={20} /> Tìm kiếm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;