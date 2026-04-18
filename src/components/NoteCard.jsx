import React from 'react';
import { MdOutlineDelete, MdPushPin } from "react-icons/md";

function NoteCard({ note, onClick, onDelete }) {
  // Xác định class màu nền, nếu không có thì mặc định là default
  const bgClass = note.bgColor ? `note-bg-${note.bgColor}` : 'note-bg-default';

  return (
    <div 
      className={`h-100 position-relative pro-note-card ${bgClass}`} 
      onClick={onClick} 
      style={{ cursor: 'pointer', borderRadius: '16px', overflow: 'hidden' }}
    >
      {/* 1. Hiển thị ảnh nếu có */}
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
        
        {/* 3. Nội dung (Chỉ Render 1 lần duy nhất) */}
        <div 
          className="text-muted" 
          style={{ 
            fontSize: '0.9rem', 
            lineHeight: '1.5', 
            display: '-webkit-box', 
            WebkitLineClamp: '6', // Giới hạn tối đa 6 dòng cho gọn
            WebkitBoxOrient: 'vertical', 
            overflow: 'hidden' 
          }}
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
      </div>

      {/* 4. Nút xóa ở góc dưới bên phải */}
      <div className="position-absolute" style={{ bottom: '12px', right: '12px' }}>
        <button 
          className="btn btn-sm rounded-circle shadow-none text-muted p-2"
          style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
          onClick={(e) => { 
            e.stopPropagation(); // Ngăn việc mở modal khi bấm xóa
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