// src/components/EditLabelsModal.jsx
import React, { useState } from 'react';
import { MdCheck, MdClose, MdOutlineEdit, MdDeleteOutline, MdLabelOutline } from 'react-icons/md';

function EditLabelsModal({ isOpen, onClose, availableLabels, setAvailableLabels, theme }) {
  const [newLabel, setNewLabel] = useState('');
  const [editingLabel, setEditingLabel] = useState(null);
  const [editChange, setEditChange] = useState('');

  if (!isOpen) return null;

  // Xử lý thêm nhãn mới
  const handleCreateLabel = () => {
    const trimmed = newLabel.trim();
    if (trimmed && !availableLabels.includes(trimmed)) {
      setAvailableLabels([...availableLabels, trimmed]);
      setNewLabel(''); 
    }
  };

  // Xử lý xóa nhãn
  const handleDeleteLabel = (labelToDelete) => {
    setAvailableLabels(availableLabels.filter(label => label !== labelToDelete));
  };

  // Xử lý lưu nhãn khi đang sửa
  const handleSaveEdit = (oldLabel) => {
    const trimmed = editChange.trim();
    if (trimmed && trimmed !== oldLabel && !availableLabels.includes(trimmed)) {
      setAvailableLabels(availableLabels.map(label => label === oldLabel ? trimmed : label));
    }
    setEditingLabel(null); 
  };

  const isDark = theme === 'dark';

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
         style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
      
      <div className={`card shadow-lg border-0 ${isDark ? 'bg-dark text-light' : 'bg-white text-dark'}`} 
           style={{ width: '300px', borderRadius: '8px' }}>
        
        <div className="card-body p-3">
          <h6 className="fw-bold mb-3">Chỉnh sửa nhãn</h6>
          
          {/* Ô NHẬP NHÃN MỚI */}
          <div className="d-flex align-items-center mb-3">
            <span className="text-muted me-2 cursor-pointer" onClick={() => setNewLabel('')}>
              <MdClose size={20} />
            </span>
            <input 
              type="text" 
              className={`form-borderless flex-grow-1 border-0 border-bottom outline-none bg-transparent ${isDark ? 'text-light' : 'text-dark'}`}
              placeholder="Tạo nhãn mới"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateLabel()}
              style={{ boxShadow: 'none', outline: 'none' }}
            />
            <span className="text-muted ms-2 cursor-pointer" onClick={handleCreateLabel}>
              <MdCheck size={20} />
            </span>
          </div>

          {/* DANH SÁCH NHÃN HIỆN CÓ */}
          <div className="label-list" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {availableLabels.map((label) => (
              <div key={label} className="d-flex align-items-center py-2 group-hover">
                
                {/* Nếu đang ở chế độ Sửa nhãn này */}
                {editingLabel === label ? (
                  <>
                    <span className="text-muted me-2 cursor-pointer" onClick={() => handleDeleteLabel(label)}>
                      <MdDeleteOutline size={20} />
                    </span>
                    <input 
                      type="text"
                      className={`form-borderless flex-grow-1 border-0 border-bottom bg-transparent ${isDark ? 'text-light' : 'text-dark'}`}
                      value={editChange}
                      onChange={(e) => setEditChange(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(label)}
                      style={{ boxShadow: 'none', outline: 'none' }}
                      autoFocus
                    />
                    <span className="text-muted ms-2 cursor-pointer" onClick={() => handleSaveEdit(label)}>
                      <MdCheck size={20} />
                    </span>
                  </>
                ) : (
                  // Trạng thái hiển thị bình thường
                  <>
                    <span className="text-muted me-2 group-hover-icon">
                      <MdLabelOutline size={20} />
                    </span>
                    <span className="flex-grow-1 text-truncate">{label}</span>
                    <span className="text-muted ms-2 cursor-pointer" onClick={() => { setEditingLabel(label); setEditChange(label); }}>
                      <MdOutlineEdit size={20} />
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* NÚT XONG */}
        <div className="card-footer border-0 bg-transparent text-end pb-3 pe-3 pt-0">
          <button className={`btn btn-sm fw-bold ${isDark ? 'text-light' : 'text-dark'}`} onClick={onClose}>
            Xong
          </button>
        </div>

      </div>
    </div>
  );
}

export default EditLabelsModal;