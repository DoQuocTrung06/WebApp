import React from 'react';
import { MdSearch, MdViewAgenda, MdGridView, MdSettings, MdMenu } from "react-icons/md";
import SettingsDropdown from './SettingsDropdown';

function Header({ 
  theme, setTheme, isMobileMenuOpen, setIsMobileMenuOpen, 
  searchQuery, setSearchQuery, isGridView, setIsGridView, 
  isPrefOpen, setIsPrefOpen, fontSize, setFontSize 
}) {
  return (
    <div className={`p-3 d-flex align-items-center justify-content-between ${theme === 'dark' ? 'bg-dark text-light border-bottom border-secondary' : 'bg-white shadow-sm'}`} style={{ height: '70px', zIndex: 10 }}>
      <div className="d-flex align-items-center flex-grow-1">
        <button className={`btn me-2 d-md-none ${theme === 'dark' ? 'text-white' : 'text-dark'}`} onClick={() => setIsMobileMenuOpen(true)}>
          <MdMenu size={28} />
        </button>
        <div className="input-group ms-md-4 search-container" style={{ maxWidth: '600px' }}>
          <span className={`input-group-text border-0 rounded-start-pill ${theme === 'dark' ? 'bg-secondary text-white' : 'bg-light'}`}><MdSearch size={22}/></span>
          <input type="text" className={`form-control border-0 rounded-end-pill shadow-none ${theme === 'dark' ? 'bg-secondary text-white placeholder-light' : 'bg-light'}`} placeholder="Tìm kiếm trong ghi chú..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>

      <div className="me-2 d-flex gap-2 position-relative">
        <button className={`btn ${theme === 'dark' ? 'text-light' : 'text-dark'}`} onClick={() => setIsGridView(!isGridView)} title="Đổi chế độ xem">
          {isGridView ? <MdViewAgenda size={22}/> : <MdGridView size={22}/>}
        </button>
        
        <button className={`btn ${isPrefOpen ? 'text-primary' : (theme === 'dark' ? 'text-light' : 'text-dark')}`} onClick={() => setIsPrefOpen(!isPrefOpen)} title="Cài đặt">
          <MdSettings size={22}/>
        </button>

        {isPrefOpen && (
          <SettingsDropdown theme={theme} setTheme={setTheme} fontSize={fontSize} setFontSize={setFontSize} />
        )}
      </div>
    </div>
  );
}

export default Header;