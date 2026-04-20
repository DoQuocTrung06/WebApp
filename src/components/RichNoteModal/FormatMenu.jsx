import React from 'react';
import { MdFormatBold, MdFormatItalic, MdFormatUnderlined, MdFormatClear } from "react-icons/md";

function FormatMenu({ theme, execCmd }) {
  return (
    <div className={`position-absolute shadow-lg p-1 rounded-3 d-flex align-items-center gap-1 border animate__animated animate__fadeIn ${theme === 'dark' ? 'bg-dark border-secondary' : 'bg-white'}`} 
         style={{ top: '40px', left: '0', zIndex: 1300, whiteSpace: 'nowrap' }}>
      
      <button className="btn btn-sm btn-light-hover fw-bold" onClick={() => execCmd('formatBlock', '<h1>')}>H1</button>
      <button className="btn btn-sm btn-light-hover fw-bold" onClick={() => execCmd('formatBlock', '<h2>')}>H2</button>
      <button className="btn btn-sm btn-light-hover fw-bold" onClick={() => execCmd('formatBlock', '<div>')}>H3</button>
      
      <div className="vr mx-1"></div>
      
      <button className="btn btn-sm btn-light-hover" onClick={() => execCmd('bold')}><MdFormatBold size={20}/></button>
      <button className="btn btn-sm btn-light-hover" onClick={() => execCmd('italic')}><MdFormatItalic size={20}/></button>
      <button className="btn btn-sm btn-light-hover" onClick={() => execCmd('underline')}><MdFormatUnderlined size={20}/></button>
      
      <button 
        className="btn btn-sm btn-light-hover text-muted" title="Xóa định dạng"
        onClick={() => { execCmd('removeFormat'); execCmd('formatBlock', '<div>'); }}
      >
        <MdFormatClear size={20}/>
      </button>
    </div>
  );
}

export default FormatMenu;