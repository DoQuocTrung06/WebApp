import React from 'react';

function LabelMenu({ theme, availableLabels, selectedLabels, setSelectedLabels }) {
  const toggleLabel = (label) => {
    if (selectedLabels.includes(label)) {
      setSelectedLabels(selectedLabels.filter(l => l !== label));
    } else {
      setSelectedLabels([...selectedLabels, label]);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div 
      className={`position-absolute shadow py-2 rounded border animate__animated animate__fadeIn ${isDark ? 'bg-dark border-secondary text-light' : 'bg-white border-light text-dark'}`}
      style={{ 
        top: '100%', 
        left: '0', 
        width: '200px', 
        zIndex: 1300,
        marginBottom: '8px',
        marginTop: '8px', 
        userSelect: 'none'
      }}
    >
      <div className="px-3 py-1 fw-bold border-bottom mb-2" style={{ fontSize: '14px' }}>
        Thêm nhãn
      </div>
      
      {/* RENDER DANH SÁCH NHÃN */}
      {(!availableLabels || availableLabels.length === 0) ? (
        <div className="px-3 py-2 text-muted small">Chưa có nhãn nào. Hãy tạo ở thanh menu.</div>
      ) : (
        availableLabels.map(label => (
          <div 
            key={label} 
            className={`px-3 py-1 d-flex align-items-center gap-2 cursor-pointer ${isDark ? 'hover-bg-secondary' : 'hover-bg-light'}`} 
            style={{ cursor: 'pointer' }}
            onClick={() => toggleLabel(label)}
          >
            <input 
              type="checkbox" 
              checked={selectedLabels.includes(label)} 
              readOnly 
              style={{ cursor: 'pointer' }} 
            />
            <span style={{ fontSize: '0.9rem' }}>{label}</span>
          </div>
        ))
      )}
    </div>
  );
}

export default LabelMenu;