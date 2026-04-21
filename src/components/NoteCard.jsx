import React, { useState, useEffect, useRef } from 'react';
import { 
  MdPushPin, MdOutlinePushPin, MdArchive, MdMoreVert, 
  MdOutlineNotifications, MdPalette, MdImage, MdAccessTime,
  MdRestore, MdDeleteForever,
  MdPersonAdd
} from "react-icons/md";

// Import các Menu y hệt như bên RichNoteModal
import LabelMenu from "./RichNoteModal/LabelMenu";
import ColorMenu from "./RichNoteModal/ColorMenu";
import ReminderMenu from "./RichNoteModal/ReminderMenu";
import ShareModal from "./ShareModal";

function NoteCard({ 
  note, onClick, onDelete, onArchive, theme, 
  availableLabels = [], onUpdateNote, onRestore 
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); 
  const menuRef = useRef(null);
  const fileInputRef = useRef(null);
  const isDark = theme === 'dark';

  // State tạm cho ReminderMenu
  const [tempDate, setTempDate] = useState('');
  const [tempTime, setTempTime] = useState('08:00');

  // [CẬP NHẬT TÍNH NĂNG SHARE] State quản lý việc mở/đóng Modal Share
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (e, menuName) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const handleUpdate = (updates) => {
    if (onUpdateNote) onUpdateNote(note.id, { ...note, ...updates });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { handleUpdate({ image: reader.result }); };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCustomReminder = () => {
    if (tempDate && tempTime) {
      handleUpdate({ reminder: new Date(`${tempDate}T${tempTime}`).toISOString() });
      setActiveMenu(null);
    }
  };

  const setReminderDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(8, 0, 0, 0); 
    handleUpdate({ reminder: date.toISOString() });
    setActiveMenu(null);
  };

  return (
    <>
    <div 
      className={`card h-100 border-0 shadow-sm note-card position-relative note-bg-${note.bgColor || 'default'} ${isDark && (!note.bgColor || note.bgColor === 'default') ? 'bg-secondary text-light' : 'text-dark'}`} 
      onClick={(e) => {
        if (!activeMenu) onClick(e);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setActiveMenu(null); }}
      style={{ borderRadius: '12px', transition: 'all 0.2s ease-in-out', cursor: 'pointer', userSelect: 'none',overflow: activeMenu ? 'visible' : 'hidden' }}
    >
      {/* ẢNH BÌA */}
      {note.image && (
        <img src={note.image} alt="Cover" className="card-img-top w-100" style={{ height: '150px', objectFit: 'cover', borderRadius: '12px 12px 0 0' }} />
      )}

      <div className="card-body d-flex flex-column">
        
        {/* TIÊU ĐỀ & NÚT GHIM */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h6 className="card-title fw-bold text-truncate mb-0" style={{ maxWidth: '85%' }}>
            {note.title || 'Không có tiêu đề'}
          </h6>
          
          <div style={{ opacity: isHovered || note.isPinned ? 1 : 0, transition: 'opacity 0.2s' }}>
            <button 
              className="btn btn-sm p-0 border-0 text-muted" 
              onClick={(e) => { e.stopPropagation(); handleUpdate({ isPinned: !note.isPinned }); }}
            >
              {note.isPinned ? <MdPushPin size={20} color="#6366f1" /> : <MdOutlinePushPin size={20} />}
            </button>
          </div>
        </div>

        {/* NỘI DUNG */}
        <div 
          className="card-text mb-3 flex-grow-1 opacity-75"
          style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: '14px' }}
          dangerouslySetInnerHTML={{ __html: note.content || '...' }}
        />

        {/* PHẦN HIỂN THỊ LỜI NHẮC, NHÃN & AVATAR (Gom chung 1 chỗ) */}
        <div className="d-flex flex-wrap align-items-center gap-1 mb-2">
          {/* 1. Lời nhắc */}
          {note.reminder && (
            <span className={`badge rounded-pill fw-normal d-flex align-items-center gap-1 border ${isDark ? 'bg-dark text-white' : 'bg-light text-dark'}`} style={{ fontSize: '11px', padding: '4px 8px' }}>
              <MdAccessTime size={12} className="text-primary" />
              {new Date(note.reminder).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}

          {/* 2. Nhãn */}
          {note.labels && note.labels.map(lbl => (
            <span key={lbl} className={`badge rounded-pill fw-normal border ${isDark ? 'bg-dark text-light' : 'bg-light text-dark'}`} style={{ fontSize: '11px', padding: '4px 8px' }}>
              {lbl}
            </span>
          ))}

          {/* 3. Avatar (Đưa từ Footer lên đây) */}
          {note.collaborators && note.collaborators.map((email, index) => (
            <div 
              key={index} 
              title={email} 
              style={{
                width: '24px', height: '24px', borderRadius: '50%',
                backgroundColor: '#fbbc04', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: 'bold', 
                border: '1.5px solid white',
                marginLeft: index === 0 ? '4px' : '-6px', 
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              {email.charAt(0).toUpperCase()}
            </div>
          ))}
        </div>

        {/* FOOTER - CÁC NÚT TIỆN ÍCH */}
        <div className="d-flex justify-content-between align-items-center mt-auto" style={{ minHeight: '30px' }}>
          {note.isTrashed ? (
            <div 
              className="d-flex justify-content-end w-100 gap-2"
              style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s' }}
            >

              <button
                className={`btn btn-sm rounded-circle p-1 border-0 ${isDark ? 'text-light' : 'text-dark'}`}
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                title="Xóa vĩnh viễn"
              >
                <MdDeleteForever size={18} />
              </button>
              <button
                className={`btn btn-sm rounded-circle p-1 border-0 ${isDark ? 'text-light' : 'text-dark'}`}
                onClick={(e) => { e.stopPropagation(); onRestore(); }}
                title="Khôi phục"
              >
                <MdRestore size={18} />
              </button>

              
            </div>
          ) : (
            <>
              <div 
                className="d-flex justify-content-between align-items-center w-100 position-relative" 
                ref={menuRef}
                onClick={e => e.stopPropagation()}
                style={{ opacity: isHovered || activeMenu ? 1 : 0, transition: 'opacity 0.2s', padding: '0 4px' }} 
              >
                {/* Lời nhắc */}
                <div className="position-relative">
                <button className={`btn btn-sm rounded-circle p-1 border-0 ${activeMenu === 'reminders' ? 'bg-light text-dark' : (isDark ? 'text-light' : 'text-dark')}`} onClick={(e) => toggleMenu(e, 'reminders')} title="Nhắc tôi">
                  <MdOutlineNotifications size={18} />
                </button>
                {activeMenu === 'reminders' && (
                  <div className="position-absolute" style={{ bottom: '100%', left: '0', zIndex: 1300, marginBottom: '8px' }}>
                    <ReminderMenu theme={theme} tempDate={tempDate} setTempDate={setTempDate} tempTime={tempTime} setTempTime={setTempTime} handleSaveCustomReminder={handleSaveCustomReminder} setReminderDate={setReminderDate} />
                  </div>
                )}
              </div>

                {/* [CẬP NHẬT TÍNH NĂNG SHARE] Nút Cộng tác viên */}
                <button 
                  className={`btn btn-sm rounded-circle p-1 border-0 ${isDark ? 'text-light' : 'text-dark'}`} 
                  onClick={(e) => { e.stopPropagation(); setShowShareModal(true); }} 
                  title="Cộng tác viên"
                >
                  <MdPersonAdd size={18} />
                </button>

                {/* Đổi màu */}
                <div className="position-relative">
                  <button className={`btn btn-sm rounded-circle p-1 border-0 ${activeMenu === 'colors' ? 'bg-light text-dark' : (isDark ? 'text-light' : 'text-dark')}`} onClick={(e) => toggleMenu(e, 'colors')} title="Tùy chọn nền">
                    <MdPalette size={18} />
                  </button>
                  {activeMenu === 'colors' && (
                    <div className="position-absolute" style={{ bottom: '100%', left: '50%', transform: 'translateX(-50%)', zIndex: 1300, marginBottom: '8px' }}>
                      <ColorMenu theme={theme} bgColor={note.bgColor || 'default'} setBgColor={(color) => handleUpdate({ bgColor: color })} onClose={() => setActiveMenu(null)} />
                    </div>
                  )}
                </div>

                {/* Thêm ảnh */}
                <button className={`btn btn-sm rounded-circle p-1 border-0 ${isDark ? 'text-light' : 'text-dark'}`} onClick={() => fileInputRef.current.click()} title="Thêm hình ảnh">
                  <MdImage size={18} />
                </button>
                <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={handleImageUpload} />

                {/* Lưu trữ */}
                <button className={`btn btn-sm rounded-circle p-1 border-0 ${isDark ? 'text-light' : 'text-dark'}`} onClick={(e) => { e.stopPropagation(); if (onArchive) onArchive(); }} title="Lưu trữ">
                  <MdArchive size={18} />
                </button>

                {/* Nút 3 chấm */}
                <div className="position-relative">
                  <button 
                    className={`btn btn-sm rounded-circle p-1 border-0 ${activeMenu === 'more' || activeMenu === 'labels' ? 'bg-light text-dark' : (isDark ? 'text-light' : 'text-dark')}`} 
                    onClick={(e) => toggleMenu(e, 'more')} 
                    title="Thêm"
                  >
                    <MdMoreVert size={18} />
                  </button>

                  {/* Menu 3 chấm: Xóa, Thêm nhãn */}
                  {activeMenu === 'more' && (
                    <div 
                      className={`position-absolute shadow-lg rounded py-1 ${isDark ? 'bg-dark border border-secondary text-light' : 'bg-white border text-dark'}`}
                      style={{ 
                        bottom: '100%', // Đổi lên bottom để tránh bị lấp bởi cạnh dưới card
                        right: 0, 
                        zIndex: 1050, 
                        minWidth: '140px', 
                        fontSize: '14px', 
                        marginBottom: '8px' 
                      }}
                    >
                      <div 
                        className="dropdown-item px-3 py-2 cursor-pointer hover-bg" 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          onDelete(); 
                          setActiveMenu(null); 
                        }}
                      >
                        Xóa ghi chú
                      </div>
                      {!note.isTrashed && (
                        <div 
                          className="dropdown-item px-3 py-2 cursor-pointer hover-bg" 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setActiveMenu('labels'); // Chuyển trạng thái sang mở nhãn
                          }}
                        >
                          Thêm nhãn
                        </div>
                      )}
                    </div>
                  )}

                  {/* Bảng chọn nhãn (LabelMenu) */}
                  {activeMenu === 'labels' && (
                    <div 
                      className="position-absolute shadow-lg" 
                      style={{ 
                        bottom: '100%', 
                        right: 0, 
                        zIndex: 1300, 
                        marginBottom: '8px' 
                      }}
                      onClick={(e) => e.stopPropagation()} // Chống đóng menu khi click vào trong
                    >
                      <LabelMenu 
                        theme={theme} 
                        availableLabels={availableLabels} 
                        selectedLabels={note.labels || []} 
                        setSelectedLabels={(newLabels) => handleUpdate({ labels: newLabels })} 
                        // Thêm nút quay lại nếu cần, hoặc click ra ngoài để đóng
                      />
                    </div>
                  )}
                </div>

              </div>
            </>
          )}
        </div>
      </div>      
    </div>
    {showShareModal && (
      <ShareModal 
        note={note} 
        onClose={() => setShowShareModal(false)} 
        onSave={(newCollaborators) => {
          handleUpdate({ collaborators: newCollaborators });
          setShowShareModal(false);
        }}
      />
    )}
  </> 
  );
}

export default NoteCard;