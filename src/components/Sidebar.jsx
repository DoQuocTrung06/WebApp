import React from 'react';
import { 
  MdLightbulbOutline, MdOutlineNotifications, MdOutlineEdit, 
  MdOutlineArchive, MdOutlineDelete, MdNoteAlt 
} from "react-icons/md";

const SIDEBAR_MENU = [
  { id: 'notes', label: 'Ghi chú', icon: <MdLightbulbOutline /> },
  { id: 'reminders', label: 'Lời nhắc', icon: <MdOutlineNotifications /> },
  { id: 'labels', label: 'Chỉnh sửa nhãn', icon: <MdOutlineEdit /> },
  { id: 'archive', label: 'Lưu trữ', icon: <MdOutlineArchive /> },
  { id: 'trash', label: 'Thùng rác', icon: <MdOutlineDelete /> },
];

function Sidebar({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen, theme }) {
  return (
    <div className={`app-sidebar py-4 px-3 d-flex flex-column border-end ${theme === 'dark' ? 'border-secondary bg-dark text-light' : 'bg-white text-dark'} ${isMobileMenuOpen ? 'open' : ''}`} style={{ width: '280px' }}>
      <div className="d-flex align-items-center mb-5 px-2">
        <div className="bg-primary text-white rounded p-2 me-3"><MdNoteAlt size={24} /></div>
        <h4 className="fw-bold mb-0 text-primary">ProNotes</h4>
      </div>

      {SIDEBAR_MENU.map(item => (
        <div 
          key={item.id} 
          className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`} 
          onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
        >
          <span className="sidebar-icon">{item.icon}</span>
          {item.label}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;