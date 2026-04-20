import React from 'react';

function ReminderMenu({ theme, tempDate, setTempDate, tempTime, setTempTime, handleSaveCustomReminder, setReminderDate }) {
  return (
    <div 
      className={`position-absolute shadow-sm rounded p-2 ${theme === 'dark' ? 'bg-dark border border-secondary' : 'bg-white border'}`}
      style={{ 
        top: '100%', 
        left: 0, 
        zIndex: 1050, 
        width: '210px', 
        marginTop: '8px', 
        fontSize: '13px' 
      }}
      onClick={(e) => e.stopPropagation()}
    >
      
      {/* NÚT CHỌN NHANH */}
      <div 
        className={`px-2 py-1 mb-1 rounded ${theme === 'dark' ? 'text-light hover-bg-secondary' : 'text-dark hover-bg-light'}`}
        onClick={() => setReminderDate(1)}
        style={{ cursor: 'pointer' }}
      >
        Ngày mai (08:00)
      </div>
      
      <div 
        className={`px-2 py-1 mb-2 rounded ${theme === 'dark' ? 'text-light hover-bg-secondary' : 'text-dark hover-bg-light'}`}
        onClick={() => setReminderDate(7)}
        style={{ cursor: 'pointer' }}
      >
        Tuần sau (08:00)
      </div>

      
      <div className="px-1 mt-2">
        <div className="mb-1 fw-bold text-muted" style={{ fontSize: '11px', textTransform: 'uppercase' }}>Tùy chỉnh ngày giờ</div>
        
        
        <input 
          type="date" 
          className={`form-control form-control-sm mb-2 shadow-none border-0 ${theme === 'dark' ? 'bg-secondary text-light' : 'bg-light text-dark'}`}
          value={tempDate} 
          onChange={(e) => setTempDate(e.target.value)} 
        />
        
       
        <input 
          type="time" 
          step="60" 
          className={`form-control form-control-sm mb-2 shadow-none border-0 ${theme === 'dark' ? 'bg-secondary text-light' : 'bg-light text-dark'}`}
          value={tempTime} 
          onChange={(e) => setTempTime(e.target.value)} 
        />

        {/* Nút lưu nhỏ lại */}
        <button 
          className="btn btn-primary btn-sm w-100 fw-medium mt-1" 
          onClick={handleSaveCustomReminder}
        >
          Lưu
        </button>
      </div>
    </div>
  );
}

export default ReminderMenu;