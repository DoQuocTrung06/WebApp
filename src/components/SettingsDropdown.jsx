import React from 'react';

function SettingsDropdown({ theme, setTheme, fontSize, setFontSize }) {
  return (
    <div className={`settings-dropdown shadow-lg p-3 animate__animated animate__fadeIn ${theme === 'dark' ? 'bg-dark text-light border-secondary' : 'bg-white'}`}>
      <h6 className="fw-bold mb-3">Tùy chỉnh hệ thống</h6>
      
      {/* NÚT GẠT SÁNG/TỐI */}
      <div className="mb-4 d-flex align-items-center justify-content-between">
        <label className="small fw-bold opacity-75 mb-0" htmlFor="themeSwitch" style={{ cursor: 'pointer' }}>
          {theme === 'dark' ? 'Chế độ Tối' : 'Chế độ Sáng'}
        </label>
        <div className="form-check form-switch mb-0">
          <input 
            className="form-check-input shadow-none" 
            type="checkbox" 
            role="switch" 
            id="themeSwitch"
            style={{ width: '40px', height: '20px', cursor: 'pointer' }}
            checked={theme === 'dark'}
            onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="small fw-bold opacity-75 d-block mb-2">Cỡ chữ</label>
        <div className="btn-group w-100">
          {['small', 'medium', 'large'].map(size => (
            <button 
              key={size}
              className={`btn btn-sm ${theme === 'dark' ? 'btn-outline-light' : 'btn-outline-primary'} ${fontSize === size ? 'active' : ''}`}
              onClick={() => setFontSize(size)}
            >
              {size === 'small' ? 'Nhỏ' : size === 'medium' ? 'Vừa' : 'Lớn'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SettingsDropdown;