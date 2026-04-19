import React from 'react';
import { MdOutlineDelete, MdPushPin, MdAccessTime } from "react-icons/md";

function NoteCard({ note, onClick, onDelete, theme }) {
  // Xác định class màu nền
  const bgClass = note.bgColor ? `note-bg-${note.bgColor}` : 'note-bg-default';

  return (
    <div 
      className={`h-100 position-relative pro-note-card ${bgClass}`} 
      onClick={onClick} 
      style={{ cursor: 'pointer', borderRadius: '16px', overflow: 'hidden' }}
    >
      {/* 1. HIỂN THỊ ẢNH BÌA */}
      {note.image && (
        <img 
          src={note.image} 
          alt="Cover" 
          className="w-100" 
          style={{ height: '140px', objectFit: 'cover' }} 
        />
      )}
      
      <div className="p-3 pb-5">
        {/* 2. Tiêu đề và Ghim */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="fw-bold m-0" style={{ fontSize: '1.05rem' }}>{note.title}</h5>
          {note.isPinned && <MdPushPin size={18} color="#6366f1" />}
        </div>
        
        {/* 3. Nội dung (ĐÃ SỬA LỖI MÀU CHỮ TRONG DARK MODE) */}
        <div 
          className="opacity-75" // Dùng opacity thay cho text-muted để nó tự chuyển đổi màu theo nền
          style={{ 
            fontSize: '0.9rem', 
            lineHeight: '1.5', 
            display: '-webkit-box', 
            WebkitLineClamp: '6', 
            WebkitBoxOrient: 'vertical', 
            overflow: 'hidden' 
          }}
          dangerouslySetInnerHTML={{ __html: note.content }}
        />

        {/* HIỂN THỊ LỜI NHẮC TRÊN THẺ */}
        {note.reminder && (
          <div className="badge rounded-pill bg-dark bg-opacity-10 text-dark border border-secondary mt-3 d-inline-flex align-items-center gap-1" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
            <MdAccessTime size={12} /> 
            {new Date(note.reminder).toLocaleDateString('vi-VN')}
          </div>
        )}
      </div>

      {/* 4. Nút xóa */}
      <div className="position-absolute" style={{ bottom: '12px', right: '12px' }}>
        <button 
          className={`btn btn-sm rounded-circle shadow-none p-2 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}
          style={{ backgroundColor: 'rgba(128,128,128,0.1)' }}
          onClick={(e) => { 
            e.stopPropagation(); 
            onDelete(); 
          }}
        >
          <MdOutlineDelete size={18} />
        </button>
      </div>
    </div>
  );
}

export default NoteCard;