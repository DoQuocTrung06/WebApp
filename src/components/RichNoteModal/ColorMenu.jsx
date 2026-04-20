import React from 'react';

const COLORS = [
  { name: 'Mặc định', value: 'default' }, { name: 'Đỏ', value: 'red' },
  { name: 'Cam', value: 'orange' }, { name: 'Vàng', value: 'yellow' },
  { name: 'Xanh lá', value: 'green' }, { name: 'Xanh lục', value: 'teal' },
  { name: 'Xanh dương', value: 'blue' }, { name: 'Xanh đậm', value: 'darkblue' },
  { name: 'Tím', value: 'purple' }, { name: 'Hồng', value: 'pink' },
  { name: 'Nâu', value: 'brown' }, { name: 'Xám', value: 'gray' },
];

function ColorMenu({ theme, bgColor, setBgColor, onClose }) {
  return (
    <div className={`position-absolute shadow-lg p-2 rounded-3 d-flex flex-wrap gap-2 border animate__animated animate__fadeIn ${theme === 'dark' ? 'bg-dark border-secondary' : 'bg-white'}`} 
         style={{ top: '40px', left: '0', width: '250px', zIndex: 1300 }}>
      {COLORS.map(c => (
        <div 
          key={c.value} 
          className={`color-dot note-bg-${c.value} ${bgColor === c.value ? 'active' : ''}`} 
          onClick={() => { setBgColor(c.value); onClose(); }} 
        />
      ))}
    </div>
  );
}

export default ColorMenu;