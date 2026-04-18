import React from 'react';

function PreferencesModal({ isOpen, onClose, theme, setTheme, fontSize, setFontSize }) {
  if (!isOpen) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered">
        {/* Đổi màu nền Modal tùy thuộc vào chế độ Sáng hay Tối */}
        <div className={`modal-content border-0 shadow-lg ${theme === 'dark' ? 'bg-dark text-white' : 'bg-white'}`} style={{ borderRadius: '12px' }}>
          
          <div className="modal-header border-bottom-0">
            <h5 className="modal-title fw-bold">⚙️ Cài đặt giao diện</h5>
          </div>
          
          <div className="modal-body px-4">
            {/* Cài đặt Chế độ Sáng / Tối */}
            <div className="mb-4">
              <label className="fw-bold mb-2">Chế độ hiển thị</label>
              <select 
                className={`form-select shadow-none ${theme === 'dark' ? 'bg-secondary text-white border-secondary' : 'bg-light border-0'}`}
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                <option value="light">☀️ Giao diện Sáng (Light)</option>
                <option value="dark">🌙 Giao diện Tối (Dark)</option>
              </select>
            </div>

            {/* Cài đặt Cỡ chữ */}
            <div className="mb-3">
              <label className="fw-bold mb-2">Cỡ chữ hiển thị</label>
              <select 
                className={`form-select shadow-none ${theme === 'dark' ? 'bg-secondary text-white border-secondary' : 'bg-light border-0'}`}
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
              >
                <option value="small">Nhỏ (Small)</option>
                <option value="medium">Vừa (Mặc định)</option>
                <option value="large">Lớn (Large)</option>
              </select>
            </div>
          </div>

          <div className="modal-footer border-top-0">
            <button className="btn btn-warning fw-bold px-4 rounded-pill" onClick={onClose}>Hoàn tất</button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PreferencesModal;