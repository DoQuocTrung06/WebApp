import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteCard from '../components/NoteCard';
import RichNoteModal from '../components/RichNoteModal';
import './Home.css';

import { 
  MdLightbulbOutline, MdOutlineNotifications, MdOutlineEdit, 
  MdOutlineArchive, MdOutlineDelete, MdSearch,
  MdViewAgenda, MdGridView, MdSettings, MdNoteAlt, MdLogout, MdMenu
} from "react-icons/md";

// Khai báo menu tiếng Việt cho Sidebar
const SIDEBAR_MENU = [
  { id: 'notes', label: 'Ghi chú', icon: <MdLightbulbOutline /> },
  { id: 'reminders', label: 'Lời nhắc', icon: <MdOutlineNotifications /> },
  { id: 'labels', label: 'Chỉnh sửa nhãn', icon: <MdOutlineEdit /> },
  { id: 'archive', label: 'Lưu trữ', icon: <MdOutlineArchive /> },
  { id: 'trash', label: 'Thùng rác', icon: <MdOutlineDelete /> },
];

function Home() {
  const navigate = useNavigate(); 
  const [activeTab, setActiveTab] = useState('notes');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPrefOpen, setIsPrefOpen] = useState(false); // Trạng thái mở menu bánh răng
  const [isGridView, setIsGridView] = useState(true);
  const [theme, setTheme] = useState('light'); 
  const [fontSize, setFontSize] = useState('medium');
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [notes, setNotes] = useState([
    { id: 1, title: 'Chào mừng!', content: 'Bắt đầu ghi chú ngay thôi.', isPinned: true, bgColor: 'default' },
  ]);

  const handleSaveNote = (noteData) => {
    if (noteData.id) {
      setNotes(prev => prev.map(n => n.id === noteData.id ? noteData : n));
    } else {
      setNotes(prev => [{ ...noteData, id: Date.now() }, ...prev]);
    }
  };

  const handleDeleteNote = (id) => {
    if (window.confirm("Xác nhận xóa ghi chú này?")) {
      setNotes(prev => prev.filter(note => note.id !== id));
    }
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedNotes = filteredNotes.filter(n => n.isPinned);
  const otherNotes = filteredNotes.filter(n => !n.isPinned);

  const bgStyle = theme === 'dark' ? '#111827' : '#f9fafb';
  const textColor = theme === 'dark' ? '#f3f4f6' : '#1f2937';

  return (
    <div className={`d-flex ${theme === 'dark' ? 'dark' : ''}`} 
         style={{ height: '100vh', overflow: 'hidden', backgroundColor: bgStyle, color: textColor, fontSize: fontSize === 'small' ? '14px' : fontSize === 'large' ? '18px' : '16px' }}>
      
      {/* Overlay cho Mobile */}
      {isMobileMenuOpen && <div className="sidebar-overlay d-md-none" onClick={() => setIsMobileMenuOpen(false)}></div>}

      {/* SIDEBAR - Đã đổi sang tiếng Việt và Icon mới */}
      <div className={`app-sidebar py-4 px-3 d-flex flex-column border-end ${theme === 'dark' ? 'border-secondary bg-dark' : 'bg-white'} ${isMobileMenuOpen ? 'open' : ''}`} style={{ width: '280px' }}>
        <div className="d-flex align-items-center mb-5 px-2">
          <div className="bg-primary text-white rounded p-2 me-3"><MdNoteAlt size={24} /></div>
          <h4 className="fw-bold mb-0 text-primary">ProNotes</h4>
        </div>

        {SIDEBAR_MENU.map(item => (
          <div 
            key={item.id} 
            className={`sidebar-item ${activeTab === item.id ? 'active' : ''} ${theme === 'dark' && activeTab !== item.id ? 'text-light' : ''}`} 
            onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {item.label}
          </div>
        ))}
        
        
      </div>
      
      {/* MAIN CONTENT */}
      <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
        
        {/* HEADER */}
        <div className={`p-3 d-flex align-items-center justify-content-between ${theme === 'dark' ? 'bg-dark border-bottom border-secondary' : 'bg-white shadow-sm'}`} style={{ height: '70px', zIndex: 10 }}>
          <div className="d-flex align-items-center flex-grow-1">
            <button className={`btn me-2 d-md-none ${theme === 'dark' ? 'text-white' : 'text-dark'}`} onClick={() => setIsMobileMenuOpen(true)}>
              <MdMenu size={28} />
            </button>
            <div className="input-group ms-md-4 search-container" style={{ maxWidth: '600px' }}>
              <span className={`input-group-text border-0 rounded-start-pill ${theme === 'dark' ? 'bg-secondary text-white' : 'bg-light'}`}><MdSearch size={22}/></span>
              <input type="text" className={`form-control border-0 rounded-end-pill shadow-none ${theme === 'dark' ? 'bg-secondary text-white' : 'bg-light'}`} placeholder="Tìm kiếm trong ghi chú..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>

          {/* NHÓM NÚT CÀI ĐẶT & CHẾ ĐỘ XEM */}
          <div className="me-2 d-flex gap-2 position-relative">
            <button className="btn" onClick={() => setIsGridView(!isGridView)} title="Đổi chế độ xem">
              {isGridView ? <MdViewAgenda size={22}/> : <MdGridView size={22}/>}
            </button>
            
            {/* NÚT BÁNH RĂNG */}
            <button className={`btn ${isPrefOpen ? 'text-primary' : ''}`} onClick={() => setIsPrefOpen(!isPrefOpen)} title="Cài đặt">
              <MdSettings size={22}/>
            </button>

            {/* DROPDOWN CÀI ĐẶT (Menu bánh răng) */}
            {isPrefOpen && (
              <div className="settings-dropdown shadow-lg p-3 animate__animated animate__fadeIn">
                <h6 className="fw-bold mb-3">Tùy chỉnh hệ thống</h6>
                
                <div className="mb-3">
                  <label className="small fw-bold opacity-75 d-block mb-1">Giao diện</label>
                  <select className="form-select form-select-sm" value={theme} onChange={(e) => setTheme(e.target.value)}>
                    <option value="light">Chế độ Sáng</option>
                    <option value="dark">Chế độ Tối</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="small fw-bold opacity-75 d-block mb-1">Cỡ chữ</label>
                  <div className="btn-group w-100">
                    {['small', 'medium', 'large'].map(size => (
                      <button 
                        key={size}
                        className={`btn btn-sm btn-outline-primary ${fontSize === size ? 'active' : ''}`}
                        onClick={() => setFontSize(size)}
                      >
                        {size === 'small' ? 'Nhỏ' : size === 'medium' ? 'Vừa' : 'Lớn'}
                      </button>
                    ))}
                  </div>
                </div>

                <hr />
                <button className="btn btn-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-2" onClick={() => navigate('/login')}>
                  <MdLogout /> Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>

        {/* PHẦN NỘI DUNG CHÍNH (Đóng Menu cài đặt khi click vào đây) */}
        <div className="flex-grow-1 overflow-auto" onClick={() => setIsPrefOpen(false)}>
          {/* Ô TẠO GHI CHÚ */}
          <div className="d-flex justify-content-center mt-4 px-3">
            <div className={`card shadow-sm quick-create-box px-4 py-3 d-flex flex-row align-items-center border-0 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-white'}`} 
                 style={{ width: '100%', maxWidth: '600px', cursor: 'text', borderRadius: '12px' }} 
                 onClick={() => { setSelectedNote(null); setIsModalOpen(true); }}>
              <span className="text-muted">Ghi chú mới ngay...</span>
            </div>
          </div>

          {/* LƯỚI GHI CHÚ */}
          <div className="p-3 p-md-5 notes-area">
            {pinnedNotes.length > 0 && (
              <div className="mb-5">
                <small className="text-muted fw-bold ms-2 mb-3 d-block">ĐÃ GHIM</small>
                <div className={isGridView ? "row g-3" : "d-flex flex-column gap-3 mx-auto"} style={!isGridView ? { maxWidth: '700px' } : {}}>
                  {pinnedNotes.map(n => (
                    <div className={isGridView ? "col-12 col-sm-6 col-md-4 col-lg-3" : "col-12"} key={n.id}>
                      <NoteCard note={n} onClick={() => { setSelectedNote(n); setIsModalOpen(true); }} onDelete={() => handleDeleteNote(n.id)} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
               {pinnedNotes.length > 0 && <small className="text-muted fw-bold ms-2 mb-3 d-block">KHÁC</small>}
              <div className={isGridView ? "row g-3" : "d-flex flex-column gap-3 mx-auto"} style={!isGridView ? { maxWidth: '700px' } : {}}>
                {otherNotes.map(n => (
                  <div className={isGridView ? "col-12 col-sm-6 col-md-4 col-lg-3" : "col-12"} key={n.id}>
                    <NoteCard note={n} onClick={() => { setSelectedNote(n); setIsModalOpen(true); }} onDelete={() => handleDeleteNote(n.id)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <RichNoteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={selectedNote} 
        onSave={handleSaveNote} 
        theme={theme} 
      />
    </div>
  );
}

export default Home;