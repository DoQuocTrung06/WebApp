import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import NotesArea from '../components/NotesArea';
import RichNoteModal from '../components/RichNoteModal';
import EditLabelsModal from '../components/EditLabelsModal';
import './Home.css';
import { MdDeleteForever } from "react-icons/md"; 


function Home() {
  const [activeTab, setActiveTab] = useState('notes');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPrefOpen, setIsPrefOpen] = useState(false); 
  const [isGridView, setIsGridView] = useState(true);
  const [theme, setTheme] = useState('light'); 
  const [fontSize, setFontSize] = useState('medium'); 
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [availableLabels, setAvailableLabels] = useState([]);
  const [noteToDelete, setNoteToDelete] = useState(null)
  // STATE CHỨA DANH SÁCH NHÃN
 const [isEditLabelsModalOpen, setIsEditLabelsModalOpen] = useState(false);
  
  const [notes, setNotes] = useState([
    // Thêm trường labels: [] vào dữ liệu mặc định để không bị lỗi
    { id: 1, title: 'Chào mừng!', content: 'Bắt đầu ghi chú ngay thôi.', isPinned: true, bgColor: 'default', isArchived: false, isTrashed: false, reminder: null, labels: [] },
  ]);

  const handleSaveNote = (noteData) => {
    const plainTextContent = noteData.content ? noteData.content.replace(/(<([^>]+)>)/gi, "").trim() : '';
    const titleText = noteData.title ? noteData.title.trim() : '';
    
    // Ghi chú được coi là rỗng nếu: Không có tiêu đề + Không có chữ + Không có ảnh
    const isEmpty = titleText === '' && plainTextContent === '' && !noteData.image;

    if (isEmpty) {
      // Nếu là tạo mới mà rỗng -> Hủy bỏ, không làm gì cả
      if (!noteData.id) {
        return; 
      }
    }

    // 2. Nếu có nội dung thì lưu bình thường
    if (noteData.id) {
      setNotes(prev => prev.map(n => n.id === noteData.id ? noteData : n));
    } else {
      setNotes(prev => [{ ...noteData, id: Date.now(), isArchived: false, isTrashed: false }, ...prev]);
    }
  };

  // 1. Hàm đưa vào thùng rác HOẶC mở hộp thoại xác nhận nếu đã ở trong thùng rác
  const handleDeleteNote = (noteId) => {
    const note = notes.find(n => n.id === noteId);
    if (note && note.isTrashed) {
      // Nếu đã ở thùng rác -> Mở Modal xác nhận (thay vì dùng window.confirm xấu xí)
      setNoteToDelete(noteId);
    } else {
      // Nếu ở ngoài -> Cho vào thùng rác bình thường
      setNotes(notes.map(n => n.id === noteId ? { ...n, isTrashed: true, isPinned: false } : n));
    }
  };

  // 2. Hàm thực sự Xóa vĩnh viễn (được gọi khi bấm "Xóa" ở hộp thoại mới)
  const confirmDeletePermanently = () => {
    if (noteToDelete) {
      setNotes(notes.filter(note => note.id !== noteToDelete));
      setNoteToDelete(null); 
      setIsModalOpen(false); 
    }
  };

  const handleArchiveNote = (id) => {
    setNotes(prev => {
      let isNowArchived = false;
      const updatedNotes = prev.map(n => {
        if (n.id === id) {
          isNowArchived = !n.isArchived; // Đảo ngược trạng thái
          // Nếu lưu trữ thì tự động bỏ ghim
          return { ...n, isArchived: isNowArchived, isPinned: isNowArchived ? false : n.isPinned }; 
        }
        return n;
      });
      
      // Hiện thông báo tùy theo trạng thái
      showToast(isNowArchived ? "Đã chuyển ghi chú vào lưu trữ" : "Đã hủy lưu trữ ghi chú");
      return updatedNotes;
    });
    
    setIsModalOpen(false); // Đóng modal
  };

  const handleRestoreNote = (id) => {
    setNotes(prev => prev.map(n => 
      n.id === id ? { ...n, isTrashed: false } : n
    ));
    showToast("Đã phục hồi ghi chú");
    setIsModalOpen(false); 
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleUpdateNote = (id, updatedData) => {
    setNotes(prev => prev.map(n => n.id === id ? updatedData : n));
  };
  // 1. Lọc theo Menu Sidebar (ĐÃ CẬP NHẬT ĐỂ LỌC THEO NHÃN)
  const notesByTab = notes.filter(n => {
    if (activeTab === 'notes') return !n.isArchived && !n.isTrashed;
    if (activeTab === 'archive') return n.isArchived && !n.isTrashed;
    if (activeTab === 'reminders') return n.reminder && !n.isArchived && !n.isTrashed;
    if (activeTab === 'trash') return n.isTrashed;
    
    // Nếu activeTab đang là tên của một Nhãn (ví dụ: '123')
    if (availableLabels.includes(activeTab)) {
      return n.labels && n.labels.includes(activeTab) && !n.isTrashed;
    }
    
    return true;
  });

  // 2. Lọc theo thanh Tìm kiếm
  const searchedNotes = notesByTab.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedNotes = searchedNotes.filter(n => n.isPinned);
  const otherNotes = searchedNotes.filter(n => !n.isPinned);

  return (
    <div className={`app-container d-flex ${theme === 'dark' ? 'dark bg-dark' : 'bg-light'}`} 
         style={{ height: '100vh', overflow: 'hidden', fontSize: fontSize === 'small' ? '14px' : fontSize === 'large' ? '18px' : '16px' }}>
      
      {isMobileMenuOpen && <div className="sidebar-overlay d-md-none" onClick={() => setIsMobileMenuOpen(false)}></div>}

      {/* COMPONENT SIDEBAR (TRUYỀN THÊM availableLabels) */}
      <Sidebar 
        activeTab={activeTab} setActiveTab={setActiveTab} 
        isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} 
        theme={theme}
        availableLabels={availableLabels} 
        openEditLabelsModal={() => setIsEditLabelsModalOpen(true)}
      />
      
      <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
        
        <Header 
          theme={theme} setTheme={setTheme} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen}
          searchQuery={searchQuery} setSearchQuery={setSearchQuery} isGridView={isGridView} setIsGridView={setIsGridView}
          isPrefOpen={isPrefOpen} setIsPrefOpen={setIsPrefOpen} fontSize={fontSize} setFontSize={setFontSize}
        />

        <div className="flex-grow-1 overflow-auto" onClick={() => setIsPrefOpen(false)}>
          
          {activeTab === 'notes' && (
            <div className="d-flex justify-content-center mt-4 px-3">
              <div className={`card shadow-sm quick-create-box px-4 py-3 d-flex flex-row align-items-center border-0 note-bg-default`} 
                   style={{ width: '100%', maxWidth: '600px', cursor: 'text', borderRadius: '12px' }} 
                   onClick={() => { setSelectedNote(null); setIsModalOpen(true); }}>
                <span className="text-muted">Ghi chú mới ngay...</span>
              </div>
            </div>
          )}

          <NotesArea 
            activeTab={activeTab} 
              pinnedNotes={pinnedNotes} 
              otherNotes={otherNotes} 
              isGridView={isGridView} 
              theme={theme}
              setSelectedNote={setSelectedNote} 
              setIsModalOpen={setIsModalOpen} 
              handleDeleteNote={handleDeleteNote}
              handleArchiveNote={handleArchiveNote}
              onUpdateNote={handleUpdateNote}     
              availableLabels={availableLabels}
              handleRestoreNote={handleRestoreNote}
          />

        </div>
      </div>

      {/* COMPONENT RICH NOTE MODAL (TRUYỀN THÊM CÁC HÀM VÀ BIẾN CẦN THIẾT) */}
      <RichNoteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={selectedNote} 
        onSave={handleSaveNote} 
        onDelete={handleDeleteNote}     // Phục vụ cho Thùng rác
        onRestore={handleRestoreNote}   // Phục vụ cho Thùng rác
        onArchive={handleArchiveNote}
        theme={theme} 
        activeTab={activeTab}           // Để Modal biết có đang ở trong Thùng rác không
        availableLabels={availableLabels} // Truyền danh sách nhãn vào
      />

      <EditLabelsModal 
        isOpen={isEditLabelsModalOpen}
        onClose={() => setIsEditLabelsModalOpen(false)}
        availableLabels={availableLabels}
        setAvailableLabels={setAvailableLabels}
        theme={theme}
      />

      {toastMessage && (
        <div 
          className="position-fixed bottom-0 start-0 m-4 px-4 py-2 bg-dark text-white rounded shadow-lg animate__animated animate__fadeInUp" 
          style={{ zIndex: 9999, transition: 'opacity 0.3s ease-in-out' }}
        >
          {toastMessage}
        </div>
      )}

      {/* MODAL XÁC NHẬN XÓA VĨNH VIỄN */}
      {noteToDelete && (
        <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
      )}

      <div 
        className={`modal fade ${noteToDelete ? 'show d-block' : ''}`} 
        tabIndex="-1" 
        style={{ zIndex: 1050 }}
      >
        <div className="modal-dialog modal-dialog-centered modal-sm">
          <div className={`modal-content border-0 shadow-lg ${theme === 'dark' ? 'bg-dark text-light' : 'bg-white text-dark'}`} style={{ borderRadius: '16px' }}>
            <div className="modal-body p-4 text-center">

              <div className="mb-3">
                <div className="d-inline-flex align-items-center justify-content-center bg-danger bg-opacity-10 rounded-circle" style={{ width: '60px', height: '60px' }}>
                  <MdDeleteForever size={32} className="text-danger" />
                </div>
              </div>

              <h5 className="fw-bold mb-2">Xóa vĩnh viễn?</h5>

              <p className="text-muted small mb-4">
                Ghi chú này sẽ bị xóa vĩnh viễn và bạn sẽ không thể khôi phục lại được.
              </p>

              <div className="d-flex justify-content-center gap-2">
                <button 
                  className={`btn ${theme === 'dark' ? 'btn-outline-light' : 'btn-light'} rounded-pill px-4`} 
                  onClick={() => setNoteToDelete(null)}
                >
                  Hủy
                </button>

                <button 
                  className="btn btn-danger rounded-pill px-4" 
                  onClick={confirmDeletePermanently}
                >
                  Xóa luôn
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;