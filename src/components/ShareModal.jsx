import React, { useState } from 'react';
import { MdPerson, MdClose, MdPersonAdd, MdCheck } from "react-icons/md";
import './ShareModal.css';

// Các Props nhận từ RichNoteModal:
// - note: Dữ liệu ghi chú hiện tại
// - onClose: Gọi khi bấm Hủy/Lưu (Chỉ tắt Share, quay lại RichNote)
// - onCloseAll: Gọi khi bấm ra ngoài (Tắt cả Share lẫn RichNote)
// - onSave: Gọi để lưu danh sách email mới vào Note
function ShareModal({ note, onClose, onCloseAll, onSave }) {
  const [emailInput, setEmailInput] = useState('');
  
  // Lấy email chủ sở hữu (Giả lập). Sau này Backend sẽ trả về trong note.owner
  const ownerEmail = note?.owner || 'doquoctrung2k@gmail.com';

  // Khởi tạo danh sách từ dữ liệu của Ghi chú (nếu click lại icon thì nó vẫn còn)
  const [collaborators, setCollaborators] = useState(note?.collaborators || []);

  const handleAddEmail = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    
    // Kiểm tra trùng lặp
    if (collaborators.includes(emailInput) || emailInput === ownerEmail) {
      setEmailInput('');
      return; 
    }

    setCollaborators([...collaborators, emailInput]);
    setEmailInput(''); 
  };

  const handleRemove = (emailToRemove) => {
    setCollaborators(collaborators.filter(email => email !== emailToRemove));
  };

  const handleSaveClick = () => {
    // Truyền danh sách mới ngược lại cho thẻ Note lớn để nó hiển thị Avatar
    onSave(collaborators); 
    // Sau này ở hàm onSave của thẻ Note lớn, bạn sẽ gọi API Backend: 
    // axios.post(`/api/notes/${note.id}/collaborators`, { collaborators })
    
    onClose(); // Tắt ShareModal, quay lại RichNote
  };

  return (
    <div className="share-modal-overlay" onMouseDown={onCloseAll}>
      {/* Ngăn click xuyên qua. Bấm vào trong thẻ thì không bị tắt */}
      <div className="share-modal-card" onMouseDown={(e) => e.stopPropagation()}>
        
        <div className="share-modal-header">
          <h5>Cộng tác viên</h5>
        </div>
        
        <div className="share-modal-body">
          <div className="shared-list">
            {/* 1. Hiển thị Chủ sở hữu (Cố định ở đầu) */}
            <div className="shared-item">
              <div className="user-avatar owner-avatar">
                <MdPerson size={20} />
              </div>
              <div className="user-info">
                <span className="user-email fw-bold">{ownerEmail}</span>
                <span className="user-role fst-italic text-muted"> (Chủ sở hữu)</span>
              </div>
            </div>

            {/* 2. Hiển thị danh sách Cộng tác viên */}
            {collaborators.map((email, index) => (
              <div key={index} className="shared-item">
                <div className="user-avatar collab-avatar">
                  {/* Hiển thị chữ cái đầu của Email làm Avatar giống Keep */}
                  {email.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <span className="user-email fw-bold">{email}</span>
                </div>
                <button type="button" className="btn-remove" onClick={() => handleRemove(email)}>
                  <MdClose size={20} />
                </button>
              </div>
            ))}
          </div>

          <form className="add-collaborator-form" onSubmit={handleAddEmail}>
            <div className="user-avatar add-avatar">
              <MdPersonAdd size={20} />
            </div>
            <input 
              type="email" 
              placeholder="Người hoặc email để chia sẻ..." 
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
            {emailInput.trim() && (
              <button type="submit" className="btn-check-add">
                <MdCheck size={20} />
              </button>
            )}
          </form>
        </div>

        <div className="share-modal-footer">
          <button className="btn-keep-cancel" onClick={onClose}>Hủy</button>
          <button className="btn-keep-save" onClick={handleSaveClick}>Lưu</button>
        </div>

      </div>
    </div>
  );
}

export default ShareModal;