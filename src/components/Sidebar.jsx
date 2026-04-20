import React from 'react';
import { 
  MdLightbulbOutline, MdOutlineNotifications, MdOutlineEdit, 
  MdOutlineArchive, MdOutlineDelete, MdNoteAlt, MdOutlineLabel 
} from "react-icons/md";

// Nhận prop openEditLabelsModal từ Home.jsx truyền xuống
function Sidebar({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen, theme, availableLabels = [], openEditLabelsModal }) {
  
  return (
    <div className={`app-sidebar py-4 px-3 d-flex flex-column border-end ${theme === 'dark' ? 'border-secondary bg-dark text-light' : 'bg-white text-dark'} ${isMobileMenuOpen ? 'open' : ''}`} style={{ width: '280px' }}>
      
      <div className="d-flex align-items-center mb-5 px-2">
        <div className="bg-primary text-white rounded p-2 me-3"><MdNoteAlt size={24} /></div>
        <h4 className="fw-bold mb-0 text-primary">ProNotes</h4>
      </div>

      {/* 1. GHI CHÚ VÀ LỜI NHẮC */}
      <div 
        className={`sidebar-item ${activeTab === 'notes' ? 'active' : ''}`} 
        onClick={() => { setActiveTab('notes'); setIsMobileMenuOpen(false); }}
      >
        <span className="sidebar-icon"><MdLightbulbOutline /></span>
        Ghi chú
      </div>
      
      <div 
        className={`sidebar-item ${activeTab === 'reminders' ? 'active' : ''}`} 
        onClick={() => { setActiveTab('reminders'); setIsMobileMenuOpen(false); }}
      >
        <span className="sidebar-icon"><MdOutlineNotifications /></span>
        Lời nhắc
      </div>

      {/* 2. HIỂN THỊ DANH SÁCH NHÃN (Bấm vào đây là để CHUYỂN TAB) */}
      {availableLabels.map(label => (
        <div 
          key={label} 
          className={`sidebar-item ${activeTab === label ? 'active' : ''}`} 
          onClick={() => { setActiveTab(label); setIsMobileMenuOpen(false); }}
        >
          <span className="sidebar-icon"><MdOutlineLabel /></span>
          {label}
        </div>
      ))}

      {/* 3. NÚT TẠO / CHỈNH SỬA NHÃN (Bấm vào đây mới MỞ MODAL) */}
      <div 
        className="sidebar-item" 
        onClick={openEditLabelsModal}
        style={{ cursor: 'pointer' }}
      >
        <span className="sidebar-icon"><MdOutlineEdit /></span>
        Chỉnh sửa nhãn
      </div>

      {/* 4. LƯU TRỮ VÀ THÙNG RÁC */}
      <div 
        className={`sidebar-item ${activeTab === 'archive' ? 'active' : ''}`} 
        onClick={() => { setActiveTab('archive'); setIsMobileMenuOpen(false); }}
      >
        <span className="sidebar-icon"><MdOutlineArchive /></span>
        Lưu trữ
      </div>
      
      <div 
        className={`sidebar-item ${activeTab === 'trash' ? 'active' : ''}`} 
        onClick={() => { setActiveTab('trash'); setIsMobileMenuOpen(false); }}
      >
        <span className="sidebar-icon"><MdOutlineDelete /></span>
        Thùng rác
      </div>

    </div>
  );
}

export default Sidebar;