import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdNoteAlt, MdOutlineSearch, MdArrowBack, MdCheckCircleOutline } from "react-icons/md";
import './Auth.css';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false); // Trạng thái đã gửi yêu cầu

  const handleSearch = (e) => {
    e.preventDefault();
    // Giả lập gửi API lên Backend (giống như logic PHP trong PDF)
    console.log("Tìm kiếm tài khoản với email:", email);
    
    // Sau khi gọi API thành công:
    setIsSubmitted(true);
  };

  // Nếu đã gửi thành công, hiển thị màn hình thông báo thay vì form
  if (isSubmitted) {
    return (
      <div className="auth-container">
        <div className="auth-card text-center" style={{ maxWidth: '460px' }}>
          <div className="text-success mb-3">
            <MdCheckCircleOutline size={60} />
          </div>
          <h3 className="auth-title">Kiểm tra Email của bạn</h3>
          <p className="auth-subtitle mb-4">
            Chúng tôi đã gửi một liên kết đặt lại mật khẩu đến <strong>{email}</strong>. 
            Vui lòng kiểm tra hộp thư đến (hoặc thư rác).
          </p>
          <button className="btn-auth" onClick={() => navigate('/login')}>
            Quay lại đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '460px' }}>
        <div className="auth-logo">
          <MdNoteAlt size={30} />
        </div>
        <h3 className="auth-title">Tìm tài khoản của bạn</h3>
        <p className="auth-subtitle mb-4 mt-2" style={{ fontSize: '0.92rem' }}>
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
              style={{ flex: 1, padding: '12px' }}
            >
              <MdArrowBack size={20} /> Hủy
            </button>
            <button 
              type="submit" 
              className="btn-login-main m-0 d-flex justify-content-center align-items-center gap-2"
              style={{ flex: 1, padding: '12px' }}
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