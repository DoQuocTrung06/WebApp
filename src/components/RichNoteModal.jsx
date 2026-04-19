import React, { useState, useEffect, useRef } from 'react';
import { 
  MdPushPin, MdOutlinePushPin, MdPalette, MdImage, 
  MdOutlineNotifications, MdFormatBold, MdFormatItalic, 
  MdFormatUnderlined, MdFormatClear, MdClose, MdAccessTime,
  MdArchive, MdUnarchive
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
  const [isArchived, setIsArchived] = useState(false);
  const [bgColor, setBgColor] = useState('default');
  const [coverImage, setCoverImage] = useState(null); // Ảnh bìa
  const [reminder, setReminder] = useState(null); // Lời nhắc
  const [tempDate, setTempDate] = useState('');
  const [tempTime, setTempTime] = useState('08:00');

  const [showColors, setShowColors] = useState(false);
  const [showFormat, setShowFormat] = useState(false);
  const [showReminder, setShowReminder] = useState(false); // Bật tắt menu Lời nhắc
  const [disableFormat, setDisableFormat] = useState(false)
  
  const editorRef = useRef(null);
  const paletteRef = useRef(null);
  const formatRef = useRef(null);
  const reminderRef = useRef(null);
  const fileInputRef = useRef(null); // Ref cho input chọn file

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || '');
      setIsPinned(initialData?.isPinned || false);
      setIsArchived(initialData?.isArchived || false);
      setBgColor(initialData?.bgColor || 'default');
      setCoverImage(initialData?.image || null);
      setReminder(initialData?.reminder || null);

      setTimeout(() => { 
        if(editorRef.current) editorRef.current.innerHTML = initialData?.content || ''; 
      }, 50);
    }
  }, [isOpen, initialData]);

  // Đóng các menu con khi click lung tung
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (paletteRef.current && !paletteRef.current.contains(event.target)) setShowColors(false);
      if (formatRef.current && !formatRef.current.contains(event.target)) setShowFormat(false);
      if (reminderRef.current && !reminderRef.current.contains(event.target)) setShowReminder(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  // HÀM LƯU GHI CHÚ
  const handleSave = () => {
    onSave({ 
      id: initialData?.id, 
      title, 
      content: editorRef.current.innerHTML, 
      isPinned, 
      isArchived,
      bgColor, 
      image: coverImage,
      reminder: reminder,
      updatedAt: `Đã chỉnh sửa ${new Date().getHours()}:${new Date().getMinutes().toString().padStart(2, '0')}`
    });
    onClose();
  };

  // HÀM XỬ LÝ UPLOAD ẢNH (Dùng FileReader để đọc ảnh dưới dạng Base64)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // HÀM XỬ LÝ LỜI NHẮC
  const handleSaveCustomReminder = () => {
    if (tempDate && tempTime) {
      const combinedDateTime = new Date(`${tempDate}T${tempTime}`);
      setReminder(combinedDateTime.toISOString());
      setShowReminder(false); // Chỉ đóng menu khi đã bấm Lưu
    }
  };

  const execCmd = (cmd, value = null) => { 
    document.execCommand(cmd, false, value); 
    editorRef.current.focus(); 
  };

  const setReminderDate = (daysToAdd) => {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  date.setHours(8, 0, 0, 0); 
  
  const isoString = date.toISOString();
  setReminder(isoString); // Lưu vào lời nhắc chính
  
  // Cập nhật luôn vào ô nhập liệu để đồng bộ giao diện
  setTempDate(isoString.split('T')[0]);
  setTempTime("08:00");
  
  setShowReminder(false); // Đóng menu
};

  return (
    // THAY ĐỔI 1: Thêm handleSave vào onMouseDown của lớp mờ (overlay) để click ra ngoài là lưu
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
         style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1200 }}
         onMouseDown={handleSave}>
      
      {/* THAY ĐỔI 2: Thêm e.stopPropagation() để click vào cái hộp thì KHÔNG bị đóng */}
      <div className={`card border-0 shadow-lg note-bg-${bgColor}`} 
           style={{ width: '600px', maxWidth: '95vw', borderRadius: '12px', overflow: 'visible' }}
           onMouseDown={(e) => e.stopPropagation()}>
        
        {/* HIỂN THỊ ẢNH BÌA NẾU CÓ */}
        {coverImage && (
          <div className="position-relative">
            <img src={coverImage} alt="Cover" className="w-100" style={{ height: '200px', objectFit: 'cover', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }} />
            <button className="btn btn-dark btn-sm position-absolute rounded-circle p-1" style={{ top: '10px', right: '10px' }} onClick={() => setCoverImage(null)}>
              <MdClose size={20} color="#fff" />
            </button>
          </div>
        )}

        <div className="d-flex justify-content-between p-3 pb-0">
          <input 
            type="text" 
            placeholder="Tiêu đề" 
            className={`form-control shadow-none border-0 fw-bold fs-5 bg-transparent ${theme === 'dark' ? 'text-light' : 'text-dark'}`} 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            onFocus={() => { setDisableFormat(true); setShowFormat(false); }}  
          />
          <button className="btn border-0" onClick={() => setIsPinned(!isPinned)}>
            {isPinned ? <MdPushPin size={24} color="#6366f1" /> : <MdOutlinePushPin size={24} className="opacity-50" />}
          </button>
        </div>

        <div className="p-3">
          {/* Lời nhắc hiển thị dạng Chip nhỏ gọn */}
          {reminder && (
            <div 
              className={`badge rounded-pill mb-2 d-inline-flex align-items-center gap-1 border ${theme === 'dark' ? 'bg-dark border-secondary text-white' : 'bg-light border-secondary text-dark'}`} 
              style={{ padding: '6px 12px', cursor: 'pointer' }}
              onClick={() => {
                setShowReminder(true); // Mở menu lời nhắc
                setShowColors(false);
                setShowFormat(false);
              }}
            >
              {/* Thêm class text-primary để icon có màu xanh dương */}
              <MdAccessTime size={14} className="text-primary" /> 
              {new Date(reminder).toLocaleDateString('vi-VN')} {new Date(reminder).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
              
              {/* Nút X: Thêm e.stopPropagation() để khi bấm xóa sẽ không bị mở menu cài đặt */}
              <MdClose 
                className="ms-1 text-muted" 
                style={{cursor: 'pointer'}} 
                onClick={(e) => {
                  e.stopPropagation(); 
                  setReminder(null);
                }}
              />
            </div>
          )}

          <div 
            ref={editorRef} 
            contentEditable 
            className={`rich-editor-content ${theme === 'dark' ? 'text-light' : 'text-dark'}`}  
            style={{ minHeight: '150px', outline: 'none' }} 
            onFocus={() => setDisableFormat(false)}
          />
        </div>
        
        {/* CÁC THANH CÔNG CỤ */}
        <div className="d-flex align-items-center justify-content-between p-2 px-3 border-top" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
          <div className="d-flex gap-1 position-relative">
            
            {/* ĐỊNH DẠNG CHỮ */}
            <div ref={formatRef} className="position-relative">
              <button 
                className={`btn btn-sm text-muted border-0 ${showFormat ? 'bg-light rounded-circle shadow-sm' : 'bg-transparent shadow-none'} ${disableFormat ? 'opacity-25' : ''}`} 
                disabled={disableFormat}
                style={{ outline: 'none' }}
                onClick={() => {setShowFormat(!showFormat); setShowColors(false); setShowReminder(false);}}
              >
                <span style={{ fontSize: '1.1rem', fontWeight: 'bold', borderBottom: '2px solid' }}>A</span>
              </button>
              {showFormat && (
                <div className={`position-absolute shadow-lg p-1 rounded-3 d-flex align-items-center gap-1 border animate__animated animate__fadeIn ${theme === 'dark' ? 'bg-dark border-secondary' : 'bg-white'}`} style={{ top: '40px', left: '0', zIndex: 1300, whiteSpace: 'nowrap' }}>
                  
                  {/* Trả H1, H2 về kích thước chuẩn của thanh công cụ */}
                  <button className="btn btn-sm btn-light-hover fw-bold" onClick={() => execCmd('formatBlock', '<h1>')}>H1</button>
                  <button className="btn btn-sm btn-light-hover fw-bold" onClick={() => execCmd('formatBlock', '<h2>')}>H2</button>
                  <button className="btn btn-sm btn-light-hover fw-bold" onClick={() => execCmd('formatBlock', '<div>')}>H3</button>
                  
                  <div className="vr mx-1"></div>
                  
                  {/* Các nút in đậm, in nghiêng, gạch chân */}
                  <button className="btn btn-sm btn-light-hover" onClick={() => execCmd('bold')}><MdFormatBold size={20}/></button>
                  <button className="btn btn-sm btn-light-hover" onClick={() => execCmd('italic')}><MdFormatItalic size={20}/></button>
                  <button className="btn btn-sm btn-light-hover" onClick={() => execCmd('underline')}><MdFormatUnderlined size={20}/></button>
                  
                  {/* Xóa định dạng */}
                  <button 
                    className="btn btn-sm btn-light-hover text-muted" 
                    title="Xóa định dạng"
                    onClick={() => {
                      execCmd('removeFormat');
                      execCmd('formatBlock', '<div>');
                    }}
                  >
                    <MdFormatClear size={20}/>
                  </button>
                  
                </div>
              )}
            </div>

            {/* BẢNG MÀU */}
            <div ref={paletteRef} className="position-relative">
              <button className={`btn btn-sm text-muted ${showColors ? 'bg-light rounded-circle shadow-sm' : ''}`} onClick={() => {setShowColors(!showColors); setShowFormat(false); setShowReminder(false);}}>
                <MdPalette size={20}/>
              </button>
              {showColors && (
                <div className={`position-absolute shadow-lg p-2 rounded-3 d-flex flex-wrap gap-2 border animate__animated animate__fadeIn ${theme === 'dark' ? 'bg-dark border-secondary' : 'bg-white'}`} style={{ top: '40px', left: '0', width: '250px', zIndex: 1300 }}>
                  {COLORS.map(c => (
                    <div key={c.value} className={`color-dot note-bg-${c.value} ${bgColor === c.value ? 'active' : ''}`} onClick={() => { setBgColor(c.value); setShowColors(false); }} />
                  ))}
                </div>
              )}
            </div>

            {/* THAY ĐỔI 3: MENU LỜI NHẮC */}
            {/* MENU LỜI NHẮC */}
            <div ref={reminderRef} className="position-relative">
              <button className={`btn btn-sm text-muted ${showReminder ? 'bg-light rounded-circle shadow-sm' : ''}`} onClick={() => {setShowReminder(!showReminder); setShowColors(false); setShowFormat(false);}}>
                <MdOutlineNotifications size={20}/>
              </button>
              
              {showReminder && (
                <div className={`position-absolute shadow-lg py-2 rounded-3 border animate__animated animate__fadeIn ${theme === 'dark' ? 'bg-dark border-secondary text-light' : 'bg-white text-dark'}`} 
                     style={{ top: '40px', left: '0', width: '280px', zIndex: 1300 }}>
                  
                  {/* Các lựa chọn nhanh */}
                  <div className="px-3 py-2 btn-light-hover cursor-pointer d-flex align-items-center gap-2" onClick={() => setReminderDate(1)}>Hôm sau (8:00 Sáng)</div>
                  <div className="px-3 py-2 btn-light-hover cursor-pointer d-flex align-items-center gap-2" onClick={() => setReminderDate(7)}>Tuần sau (8:00 Sáng)</div>
                  
                  <hr className={`my-2 ${theme === 'dark' ? 'border-secondary' : ''}`}/>
                  
                  {/* Chọn ngày giờ tùy chỉnh (Giống Google Keep) */}
                  <div className="px-3 py-1">
                    <input 
                      type="date" 
                      className="form-control form-control-sm mb-2 custom-datetime-input shadow-none" 
                      value={tempDate} 
                      onChange={(e) => setTempDate(e.target.value)} 
                    />
                    <input 
                      type="time" 
                      className="form-control form-control-sm custom-datetime-input shadow-none" 
                      value={tempTime} 
                      onChange={(e) => setTempTime(e.target.value)} 
                    />
                    
                    {/* NÚT LƯU GIỐNG ẢNH MẪU */}
                    <div className="text-end mt-3">
                      <button 
                        className={`btn btn-sm fw-bold border-0 px-3 ${theme === 'dark' ? 'text-light' : 'text-dark'}`} 
                        onClick={handleSaveCustomReminder}
                      >
                        Lưu
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* THAY ĐỔI 4: NÚT TẢI ẢNH (Kích hoạt thẻ input ẩn) */}
            <button className="btn btn-sm text-muted" onClick={() => fileInputRef.current.click()}><MdImage size={20}/></button>
            <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={handleImageUpload} />

            {/* BƯỚC 4: NÚT LƯU TRỮ */}
            <button 
              className={`btn btn-sm text-muted ${isArchived ? 'bg-light rounded-circle shadow-sm' : ''}`} 
              onClick={() => setIsArchived(!isArchived)}
              title={isArchived ? "Hủy lưu trữ" : "Lưu trữ"}
            >
              {isArchived ? <MdUnarchive size={20}/> : <MdArchive size={20}/>}
            </button>
          </div>

          <button className={`btn btn-sm fw-bold px-3 ${theme === 'dark' ? 'text-light' : 'text-dark'}`} onClick={handleSave}>Đóng</button>
        </div>
      </div>
    </div>
  );
}

export default RichNoteModal;