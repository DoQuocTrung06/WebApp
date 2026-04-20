import React, { useState, useEffect, useRef } from 'react';
import { MdUndo, MdRedo } from "react-icons/md";
import { 
  MdPushPin, MdOutlinePushPin, MdPalette, MdImage, 
  MdOutlineNotifications, MdClose, MdAccessTime,
  MdArchive, MdUnarchive, MdOutlineLabel, MdDeleteForever, MdRestore, MdMoreVert
} from "react-icons/md";

// Import các Menu đã tách
import FormatMenu from './FormatMenu';
import ColorMenu from './ColorMenu';
import ReminderMenu from './ReminderMenu';
import LabelMenu from './LabelMenu';

function RichNoteModal({ 
  isOpen, onClose, initialData, onSave, onDelete, onRestore, 
  theme, activeTab, onArchive, availableLabels = [] // Nhận availableLabels từ Home
}) {
  const [title, setTitle] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [bgColor, setBgColor] = useState('default');
  const [coverImage, setCoverImage] = useState(null);
  const [reminder, setReminder] = useState(null);
  const [labels, setLabels] = useState([]); 

  // Menu States
  const [activeMenu, setActiveMenu] = useState(null); 
  const [disableFormat, setDisableFormat] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false); 
  const moreMenuRef = useRef(null);


  const [tempDate, setTempDate] = useState('');
  const [tempTime, setTempTime] = useState('08:00');

  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const menuContainerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || '');
      setIsPinned(initialData?.isPinned || false);
      setIsArchived(initialData?.isArchived || false);
      setBgColor(initialData?.bgColor || 'default');
      setCoverImage(initialData?.image || null);
      setReminder(initialData?.reminder || null);
      setLabels(initialData?.labels || []);
      
      setTimeout(() => { if(editorRef.current) editorRef.current.innerHTML = initialData?.content || ''; }, 50);
    }
  }, [isOpen, initialData]);

  // Click ra ngoài đóng menu
 useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(e.target)) setActiveMenu(null);
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) setShowMoreMenu(false); // <--- THÊM DÒNG NÀY
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const isTrash = activeTab === 'trash';

  const handleSave = () => {
  if (isTrash) { onClose(); return; }

  let content = editorRef.current.innerHTML;

  // chỉ xử lý string, KHÔNG set lại DOM
  content = content
    .replace(/·/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/<div><br><\/div>/g, '')
    .replace(/<div>/g, '<br>')
    .replace(/<\/div>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  onSave({ 
    id: initialData?.id,
    title,
    isPinned,
    isArchived,
    bgColor,
    image: coverImage,
    reminder,
    labels,
    content, 
    updatedAt: `Đã chỉnh sửa ${new Date().getHours()}:${new Date().getMinutes().toString().padStart(2, '0')}`
  });

  onClose();
};

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const execCmd = (cmd, value = null) => { 
    document.execCommand(cmd, false, value); 
    editorRef.current.focus(); 
  };
  

  const handleSaveCustomReminder = () => {
    if (tempDate && tempTime) {
      setReminder(new Date(`${tempDate}T${tempTime}`).toISOString());
      setActiveMenu(null);
    }
  };

  const setReminderDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(8, 0, 0, 0); 
    setReminder(date.toISOString());
    setActiveMenu(null);
  };

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-start"
      style={{ 
        backgroundColor: 'rgba(0,0,0,0.6)', 
        zIndex: 1200, 
        paddingTop: '22vh' 
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          handleSave();
        }
      }}
    >
      
      <div 
        className={`card border-0 shadow-lg note-bg-${bgColor}`} 
        style={{ width: '600px', maxWidth: '95vw', borderRadius: '12px' }} 
        onMouseDown={(e) => e.stopPropagation()}
      >
        
        {/* ẢNH BÌA */}
        {coverImage && (
          <div className="position-relative">
            <img src={coverImage} alt="Cover" className="w-100" style={{ height: '200px', objectFit: 'cover', borderRadius: '12px 12px 0 0' }} />
            {!isTrash && (
              <button className="btn btn-dark btn-sm position-absolute rounded-circle p-1" style={{ top: '10px', right: '10px' }} onClick={() => setCoverImage(null)}>
                <MdClose size={20} color="#fff" />
              </button>
            )}
          </div>
        )}

        <div className="d-flex justify-content-between p-3 pb-0">
          <input type="text" placeholder="Tiêu đề" readOnly={isTrash}
                 className={`form-control shadow-none border-0 fw-bold fs-5 bg-transparent ${theme === 'dark' ? 'text-light' : 'text-dark'}`} 
                 value={title} onChange={(e) => setTitle(e.target.value)} onFocus={() => { setDisableFormat(true); setActiveMenu(null); }} />
          {!isTrash && (
            <button className="btn border-0" onClick={() => setIsPinned(!isPinned)}>
              {isPinned ? <MdPushPin size={24} color="#6366f1" /> : <MdOutlinePushPin size={24} className="opacity-50" />}
            </button>
          )}
        </div>

        <div className="p-3">
          {reminder && (
            <div className={`badge rounded-pill mb-2 me-2 border ${theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark'}`} style={{ padding: '6px 12px' }}>
              <MdAccessTime size={14} className="text-primary me-1" /> 
              
              {new Date(reminder).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - {new Date(reminder).toLocaleDateString('vi-VN')}
              {!isTrash && <MdClose className="ms-1 cursor-pointer" onClick={() => setReminder(null)} />}
            </div>
          )}
          
          {labels.map(lbl => (
            <div key={lbl} className={`badge rounded-pill mb-2 me-2 border ${theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark'}`} style={{ padding: '6px 12px' }}>
              {lbl}
              {!isTrash && <MdClose className="ms-1 cursor-pointer" onClick={() => setLabels(labels.filter(l => l !== lbl))} />}
            </div>
          ))}

          <div 
            ref={editorRef} 
            contentEditable={!isTrash} 
            suppressContentEditableWarning={true}
            spellCheck={false}
            className={`rich-editor-content ${theme === 'dark' ? 'text-light' : 'text-dark'}`} 
            style={{ minHeight: '150px', outline: 'none' }} 
            onFocus={() => setDisableFormat(false)}
          />
        </div>
        
        <div className="d-flex align-items-center justify-content-between p-2 px-3 border-top" ref={menuContainerRef}>
          {isTrash ? (
            
            <div className="d-flex justify-content-between align-items-center w-100">
              <div className="d-flex gap-1">
                <button className="btn btn-sm text-muted rounded-circle p-2" style={{ backgroundColor: 'rgba(128,128,128,0.1)' }} onClick={() => onDelete(initialData.id)} title="Xóa vĩnh viễn"><MdDeleteForever size={20} /></button>
                <button className="btn btn-sm text-muted rounded-circle p-2" style={{ backgroundColor: 'rgba(128,128,128,0.1)' }} onClick={() => onRestore(initialData.id)} title="Khôi phục"><MdRestore size={20} /></button>
              </div>
              <span className="text-muted" style={{ fontSize: '0.75rem', fontStyle: 'italic' }}>Note in Trash • {initialData?.updatedAt}</span>
            </div>
          ) : (
            // GIAO DIỆN BÌNH THƯỜNG
            <div className="d-flex gap-1 position-relative">
              
              {/* Định dạng chữ */}
              <button className={`btn btn-sm text-muted border-0 ${activeMenu === 'format' ? 'bg-light rounded-circle' : ''} ${disableFormat ? 'opacity-25' : ''}`} disabled={disableFormat} onClick={() => setActiveMenu(activeMenu === 'format' ? null : 'format')}>
                <span style={{ fontSize: '1.1rem', fontWeight: 'bold', borderBottom: '2px solid' }}>A</span>
              </button>
              {activeMenu === 'format' && <FormatMenu theme={theme} execCmd={execCmd} />}

              {/* Bảng màu */}
              <button className={`btn btn-sm text-muted ${activeMenu === 'colors' ? 'bg-light rounded-circle' : ''}`} onClick={() => setActiveMenu(activeMenu === 'colors' ? null : 'colors')}><MdPalette size={20}/></button>
              {activeMenu === 'colors' && <ColorMenu theme={theme} bgColor={bgColor} setBgColor={setBgColor} onClose={() => setActiveMenu(null)} />}

              {/* Lời nhắc */}
              <button className={`btn btn-sm text-muted ${activeMenu === 'reminder' ? 'bg-light rounded-circle' : ''}`} onClick={() => setActiveMenu(activeMenu === 'reminder' ? null : 'reminder')}><MdOutlineNotifications size={20}/></button>
              {activeMenu === 'reminder' && <ReminderMenu theme={theme} tempDate={tempDate} setTempDate={setTempDate} tempTime={tempTime} setTempTime={setTempTime} handleSaveCustomReminder={handleSaveCustomReminder} setReminderDate={setReminderDate} />}
              
              
              {/* Upload Ảnh */}
              <button className="btn btn-sm text-muted" onClick={() => fileInputRef.current.click()}><MdImage size={20}/></button>
              <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={handleImageUpload} />

              <button 
                className={`btn btn-sm text-muted ${isArchived ? 'bg-light rounded-circle' : ''}`} 
                onClick={() => {
                  if (initialData?.id) {
                    
                    onArchive(initialData.id); 
                  } else {
                    
                    setIsArchived(!isArchived);
                  }
                }} 
                title={isArchived ? "Hủy lưu trữ" : "Lưu trữ"}
              >
                {isArchived ? <MdUnarchive size={20} color="#6366f1"/> : <MdArchive size={20}/>}
              </button>

              <div className="d-flex align-items-center gap-1">

                {/* Undo */}
                <button 
                  className={`btn btn-sm rounded-circle p-2 border-0 ${theme === 'dark' ? 'text-light hover-bg-dark' : 'text-muted hover-bg-light'}`}
                  onMouseDown={(e) => e.preventDefault()} // 
                  onClick={() => {
                    document.execCommand('undo');
                    editorRef.current.focus();
                  }}
                  title="Hoàn tác (Ctrl+Z)"
                >
                  <MdUndo size={18} />
                </button>

                {/* Redo */}
                <button 
                  className={`btn btn-sm rounded-circle p-2 border-0 ${theme === 'dark' ? 'text-light hover-bg-dark' : 'text-muted hover-bg-light'}`}
                  onMouseDown={(e) => e.preventDefault()} // 
                  onClick={() => {
                    document.execCommand('redo');
                    editorRef.current.focus();
                  }}
                  title="Làm lại (Ctrl+Y)"
                >
                  <MdRedo size={18} />
                </button>

              </div>
                {/*them nut 3 cham */}
              <div className="position-relative" ref={moreMenuRef}>
                <button 
                  className={`btn btn-sm text-muted ${(showMoreMenu || activeMenu === 'labels') ? 'bg-light rounded-circle' : ''}`}
                  onClick={() => {
                    setShowMoreMenu(!showMoreMenu);
                    if (activeMenu === 'labels') setActiveMenu(null); 
                  }}
                >
                  <MdMoreVert size={20} />
                </button>

                
                {showMoreMenu && (
                  <div className={`position-absolute shadow rounded py-1 ${theme === 'dark' ? 'bg-dark border border-secondary' : 'bg-white border'}`}
                       style={{ 
                         top: '100%', 
                         left: 0, 
                         zIndex: 1050, 
                         minWidth: '150px', 
                         marginTop: '8px', 
                         fontSize: '14px',
                         userSelect: 'none' 
                       }}>
                    
                    <div className={`dropdown-item px-3 py-2 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}
                         style={{ cursor: 'pointer' }} 
                         onClick={() => { if (initialData && initialData.id) onDelete(initialData.id); onClose(); }}>
                      Xóa ghi chú
                    </div>

                    <div className={`dropdown-item px-3 py-2 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}
                         style={{ cursor: 'pointer' }} 
                         onClick={() => {
                           setShowMoreMenu(false); 
                           setActiveMenu('labels'); 
                         }}>
                      Thêm nhãn
                    </div>
                  </div>
                )}

                
                {activeMenu === 'labels' && (
                  <LabelMenu 
                    theme={theme} 
                    availableLabels={availableLabels} 
                    selectedLabels={labels} 
                    setSelectedLabels={setLabels} 
                  />
                )}
              </div>
            </div>
          )}

          {!isTrash && <button className={`btn btn-sm fw-bold px-3 ${theme === 'dark' ? 'text-light' : 'text-dark'}`} onClick={handleSave}>Đóng</button>}
        </div>
      </div>
    </div>
  );
}

export default RichNoteModal;