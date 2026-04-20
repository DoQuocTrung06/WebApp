import React from 'react';
import { MdLogin, MdClose, MdAccountCircle } from "react-icons/md";
import { useNavigate } from 'react-router-dom';


function UserProfile({ theme, isOpen, toggleProfile, closeMenu }) {
  const navigate = useNavigate();

  return (
    <div className="position-relative ms-2 d-flex align-items-center">
      {/* Nút Avatar */}
      <div 
        onClick={toggleProfile}
        style={{ cursor: 'pointer' }}
        title="Tài khoản (Chưa đăng nhập)"
      >
        <MdAccountCircle 
          size={38} 
          className={`rounded-circle hover-opacity ${theme === 'dark' ? 'text-secondary' : 'text-secondary'}`}
          style={{ transition: 'opacity 0.2s' }}
        />
      </div>

      {/* Menu xổ xuống */}
      {isOpen && (
        <div 
          className={`position-absolute end-0 shadow-lg p-0 animate__animated animate__fadeIn ${theme === 'dark' ? 'text-light' : 'bg-white text-dark border'}`}
          style={{ 
            top: '120%', width: '350px', zIndex: 1050, 
            borderRadius: '24px', 
            backgroundColor: theme === 'dark' ? '#2b2d31' : '#ffffff', 
          }}
        >
          {/* Nút Đóng */}
          <div className="d-flex justify-content-end px-3 pt-3 pb-1">
            <button 
              className={`btn btn-sm rounded-circle p-1 ${theme === 'dark' ? 'text-light hover-bg-secondary' : 'text-dark hover-bg-light'}`}
              onClick={closeMenu} 
              style={{ border: 'none' }}
            >
              <MdClose size={22} />
            </button>
          </div>

          {/* MAIN PROFILE */}
          <div className="d-flex flex-column align-items-center pb-4 px-4">
            <MdAccountCircle size={80} className="text-secondary mb-2 opacity-75" />
            
            <h5 className="mb-2 mt-1 fw-normal text-center" style={{ fontSize: '20px' }}>
              Chưa đồng bộ dữ liệu
            </h5>
            <p className="text-center mb-4" style={{ fontSize: '14px', opacity: 0.7 }}>
              Các ghi chú hiện chỉ được lưu tạm thời. Hãy đăng nhập để đồng bộ và sao lưu an toàn trên mọi thiết bị.
            </p>

            <button 
              className="btn btn-primary rounded-pill px-4 py-2 fw-medium w-100 d-flex justify-content-center align-items-center gap-2"
              style={{ fontSize: '15px' }}
              onClick={() => {
                closeMenu(); 
                navigate('/login'); 
              }}
            >
              <MdLogin size={20} /> Đăng nhập / Đăng ký
            </button>
          </div>

          {/* FOOTER */}
          <div 
            className={`d-flex justify-content-center align-items-center py-3 ${theme === 'dark' ? 'bg-dark' : 'bg-light'}`} 
            style={{ borderRadius: '0 0 24px 24px', fontSize: '12px', opacity: 0.7 }}
          >
            <span style={{ cursor: 'pointer' }} className="hover-underline">Chính sách quyền riêng tư</span>
            <span className="mx-2">•</span>
            <span style={{ cursor: 'pointer' }} className="hover-underline">Điều khoản dịch vụ</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;