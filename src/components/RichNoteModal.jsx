import React, { useState, useEffect, useRef } from 'react';
import { 
  MdPushPin, MdOutlinePushPin, MdPalette, MdImage, 
  MdOutlineNotifications, MdFormatBold, 
  MdFormatItalic, MdFormatUnderlined, MdFormatClear
} from "react-icons/md";

const COLORS = [
  { name: 'Mặc định', value: 'default' }, { name: 'Đỏ', value: 'red' },
  { name: 'Cam', value: 'orange' }, { name: 'Vàng', value: 'yellow' },
  { name: 'Xanh lá', value: 'green' }, { name: 'Xanh lục', value: 'teal' },
  { name: 'Xanh dương', value: 'blue' }, { name: 'Xanh đậm', value: 'darkblue' },
  { name: 'Tím', value: 'purple' }, { name: 'Hồng', value: 'pink' },
  { name: 'Nâu', value: 'brown' }, { name: 'Xám', value: 'gray' },
];

function RichNoteModal({ isOpen, onClose, initialData, onSave, theme }) {
  const [title, setTitle] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [bgColor, setBgColor] = useState('default');
  const [showColors, setShowColors] = useState(false);
  const [showFormat, setShowFormat] = useState(false);
  const [updatedTime, setUpdatedTime] = useState("");

  const editorRef = useRef(null);
  const paletteRef = useRef(null);
  const formatRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || '');
      setIsPinned(initialData?.isPinned || false);
      setBgColor(initialData?.bgColor || 'default');
      
      const now = new Date();
      setUpdatedTime(initialData?.updatedAt || `Đã chỉnh sửa ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`);

      setTimeout(() => { 
        if(editorRef.current) editorRef.current.innerHTML = initialData?.content || ''; 
      }, 50);
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (paletteRef.current && !paletteRef.current.contains(event.target)) setShowColors(false);
      if (formatRef.current && !formatRef.current.contains(event.target)) setShowFormat(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleSave = () => {
    const now = new Date();
    onSave({ 
      id: initialData?.id, title, content: editorRef.current.innerHTML, 
      isPinned, bgColor, updatedAt: `Đã chỉnh sửa ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`
    });
    onClose();
  };

  const execCmd = (cmd, value = null) => { 
    document.execCommand(cmd, false, value); 
    editorRef.current.focus(); 
  };

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
         style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1200 }}>
      
      <div className={`card border-0 shadow-lg note-bg-${bgColor}`} 
           style={{ width: '600px', maxWidth: '95vw', borderRadius: '12px', overflow: 'visible' }}>
        
        <div className="d-flex justify-content-between p-3 pb-0">
          <input type="text" placeholder="Tiêu đề" className="form-control shadow-none border-0 fw-bold fs-5 bg-transparent" value={title} onChange={(e) => setTitle(e.target.value)} />
          <button className="btn border-0" onClick={() => setIsPinned(!isPinned)}>
            {isPinned ? <MdPushPin size={24} color="#6366f1" /> : <MdOutlinePushPin size={24} className="opacity-50" />}
          </button>
        </div>

        <div className="p-3">
          <div ref={editorRef} contentEditable className="rich-editor-content" style={{ minHeight: '150px', outline: 'none' }} />
          <div className="text-end mt-2" style={{ fontSize: '0.75rem', opacity: 0.7 }}>{updatedTime}</div>
        </div>

        <div className="d-flex align-items-center justify-content-between p-2 px-3 border-top" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
          <div className="d-flex gap-1 position-relative">
            
            {/* MENU ĐỊNH DẠNG A - SỔ XUỐNG DƯỚI */}
            <div ref={formatRef} className="position-relative">
              <button className={`btn btn-sm text-muted ${showFormat ? 'bg-light rounded-circle shadow-sm' : ''}`} onClick={() => {setShowFormat(!showFormat); setShowColors(false);}}>
                <span style={{ fontSize: '1.1rem', fontWeight: 'bold', borderBottom: '2px solid' }}>A</span>
              </button>

              {showFormat && (
                <div className="position-absolute bg-white shadow-lg p-1 rounded-3 d-flex align-items-center gap-1 border animate__animated animate__fadeIn" 
                     style={{ top: '40px', left: '0', zIndex: 1300, whiteSpace: 'nowrap' }}>
                  <button className="btn btn-sm btn-light-hover fw-bold" onClick={() => execCmd('formatBlock', '<h1>')}>H1</button>
                  <button className="btn btn-sm btn-light-hover fw-bold" onClick={() => execCmd('formatBlock', '<h2>')}>H2</button>
                  <button className="btn btn-sm btn-light-hover fw-bold" onClick={() => execCmd('formatBlock', '<h3>')}>H3</button>
                  <div className="vr mx-1"></div>
                  <button className="btn btn-sm btn-light-hover" onClick={() => execCmd('bold')}><MdFormatBold size={20}/></button>
                  <button className="btn btn-sm btn-light-hover" onClick={() => execCmd('italic')}><MdFormatItalic size={20}/></button>
                  <button className="btn btn-sm btn-light-hover" onClick={() => execCmd('underline')}><MdFormatUnderlined size={20}/></button>
                  <div className="vr mx-1"></div>
                  <button className="btn btn-sm btn-light-hover" onClick={() => execCmd('removeFormat')}><MdFormatClear size={20}/></button>
                </div>
              )}
            </div>

            {/* BẢNG MÀU - SỔ XUỐNG DƯỚI */}
            <div ref={paletteRef} className="position-relative">
              <button className={`btn btn-sm text-muted ${showColors ? 'bg-light rounded-circle shadow-sm' : ''}`} onClick={() => {setShowColors(!showColors); setShowFormat(false);}}>
                <MdPalette size={20}/>
              </button>
              {showColors && (
                <div className="position-absolute bg-white shadow-lg p-2 rounded-3 d-flex flex-wrap gap-2 border animate__animated animate__fadeIn" 
                     style={{ top: '40px', left: '0', width: '250px', zIndex: 1300 }}>
                  {COLORS.map(c => (
                    <div key={c.value} className={`color-dot note-bg-${c.value} ${bgColor === c.value ? 'active' : ''}`} onClick={() => { setBgColor(c.value); setShowColors(false); }} />
                  ))}
                </div>
              )}
            </div>

            <button className="btn btn-sm text-muted"><MdOutlineNotifications size={20}/></button>
            <button className="btn btn-sm text-muted"><MdImage size={20}/></button>
          </div>

          <button className="btn btn-sm fw-bold text-dark px-3" onClick={handleSave}>Đóng</button>
        </div>
      </div>
    </div>
  );
}

export default RichNoteModal;