import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import NotesArea from '../components/NotesArea';
import RichNoteModal from '../components/RichNoteModal';
import './Home.css';

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
  
  const [notes, setNotes] = useState([
    { id: 1, title: 'Chào mừng!', content: 'Bắt đầu ghi chú ngay thôi.', isPinned: true, bgColor: 'default', isArchived: false, isTrashed: false, reminder: null },
  ]);

  const handleSaveNote = (noteData) => {
    if (noteData.id) {
      setNotes(prev => prev.map(n => n.id === noteData.id ? noteData : n));
    } else {
      setNotes(prev => [{ ...noteData, id: Date.now(), isArchived: false, isTrashed: false }, ...prev]);
    }
  };

  const handleDeleteNote = (id) => {
    // Tìm xem ghi chú được click là ghi chú nào
    const noteToDelete = notes.find(n => n.id === id);

    if (noteToDelete.isTrashed) {
      // TRƯỜNG HỢP 1: NẾU ĐÃ Ở TRONG THÙNG RÁC -> XÓA VĨNH VIỄN
      if (window.confirm("Xóa vĩnh viễn ghi chú này? Bạn sẽ không thể khôi phục lại.")) {
        setNotes(prev => prev.filter(note => note.id !== id));
        showToast("Đã xóa ghi chú vĩnh viễn");
      }
    } else {
      // TRƯỜNG HỢP 2: NẾU Ở NGOÀI TRANG CHỦ -> ĐƯA VÀO THÙNG RÁC (XÓA MỀM)
      setNotes(prev => prev.map(n => 
        n.id === id ? { ...n, isPinned: false, isTrashed: true } : n
      ));
      showToast("Đã chuyển ghi chú vào thùng rác");
    }
  };

  const handleRestoreNote = (id) => {
    setNotes(prev => prev.map(n => 
      n.id === id ? { ...n, isTrashed: false } : n
    ));
    showToast("Đã phục hồi ghi chú");
    setIsModalOpen(false); // Đóng modal sau khi phục hồi
  };

  // Hàm phụ trợ để hiển thị thông báo trong 3 giây rồi tự tắt
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  // 1. Lọc theo Menu Sidebar
  const notesByTab = notes.filter(n => {
    if (activeTab === 'notes') return !n.isArchived && !n.isTrashed;
    if (activeTab === 'archive') return n.isArchived && !n.isTrashed;
    if (activeTab === 'reminders') return n.reminder && !n.isArchived && !n.isTrashed;
    if (activeTab === 'trash') return n.isTrashed;
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

      {/* COMPONENT SIDEBAR */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} theme={theme} />
      
      <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
        
        {/* COMPONENT HEADER */}
        <Header 
          theme={theme} setTheme={setTheme} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen}
          searchQuery={searchQuery} setSearchQuery={setSearchQuery} isGridView={isGridView} setIsGridView={setIsGridView}
          isPrefOpen={isPrefOpen} setIsPrefOpen={setIsPrefOpen} fontSize={fontSize} setFontSize={setFontSize}
        />

        <div className="flex-grow-1 overflow-auto" onClick={() => setIsPrefOpen(false)}>
          
          {/* NÚT TẠO GHI CHÚ CHỈ HIỆN Ở TRANG CHỦ */}
          {activeTab === 'notes' && (
            <div className="d-flex justify-content-center mt-4 px-3">
              <div className={`card shadow-sm quick-create-box px-4 py-3 d-flex flex-row align-items-center border-0 note-bg-default`} 
                   style={{ width: '100%', maxWidth: '600px', cursor: 'text', borderRadius: '12px' }} 
                   onClick={() => { setSelectedNote(null); setIsModalOpen(true); }}>
                <span className="text-muted">Ghi chú mới ngay...</span>
              </div>
            </div>
          )}

          {/* COMPONENT HIỂN THỊ DANH SÁCH GHI CHÚ (HOẶC BÁO RỖNG) */}
          <NotesArea 
            activeTab={activeTab} pinnedNotes={pinnedNotes} otherNotes={otherNotes} isGridView={isGridView} theme={theme}
            setSelectedNote={setSelectedNote} setIsModalOpen={setIsModalOpen} handleDeleteNote={handleDeleteNote}
          />

        </div>
      </div>

      <RichNoteModal 
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} 
        initialData={selectedNote} onSave={handleSaveNote} theme={theme} 
      />

      <RichNoteModal 
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} 
        initialData={selectedNote} onSave={handleSaveNote} theme={theme} 
      />

      {/* GIAO DIỆN THÔNG BÁO NHỎ Ở GÓC DƯỚI TRÁI */}
      {toastMessage && (
        <div 
          className="position-fixed bottom-0 start-0 m-4 px-4 py-2 bg-dark text-white rounded shadow-lg" 
          style={{ zIndex: 9999, transition: 'opacity 0.3s ease-in-out' }}
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default Home;