import React from 'react';
import NoteCard from './NoteCard';
import { MdOutlineArchive, MdOutlineDelete, MdLightbulbOutline, MdOutlineNotifications } from "react-icons/md";

function NotesArea({ activeTab, pinnedNotes, otherNotes, isGridView, theme, setSelectedNote, setIsModalOpen, handleDeleteNote }) {
  const isEmpty = pinnedNotes.length === 0 && otherNotes.length === 0;

  // Xử lý hiển thị màn hình trống tùy theo Tab
  if (isEmpty) {
    let EmptyIcon = MdLightbulbOutline;
    let emptyText = "Ghi chú bạn thêm sẽ xuất hiện ở đây";

    if (activeTab === 'archive') { EmptyIcon = MdOutlineArchive; emptyText = "Ghi chú lưu trữ của bạn sẽ xuất hiện ở đây"; }
    else if (activeTab === 'trash') { EmptyIcon = MdOutlineDelete; emptyText = "Không có ghi chú nào trong Thùng rác"; }
    else if (activeTab === 'reminders') { EmptyIcon = MdOutlineNotifications; emptyText = "Ghi chú có lời nhắc sẽ xuất hiện ở đây"; }

    return (
      <div className="d-flex flex-column align-items-center justify-content-center text-muted" style={{ height: '50vh' }}>
        <EmptyIcon size={100} className="mb-4 opacity-25" />
        <h5>{emptyText}</h5>
      </div>
    );
  }

  return (
    <div className="p-3 p-md-5 notes-area">
      {pinnedNotes.length > 0 && (
        <div className="mb-5">
          <small className="text-muted fw-bold ms-2 mb-3 d-block">ĐÃ GHIM</small>
          <div className={isGridView ? "row g-3" : "d-flex flex-column gap-3 mx-auto"} style={!isGridView ? { maxWidth: '700px' } : {}}>
            {pinnedNotes.map(n => (
              <div className={isGridView ? "col-12 col-sm-6 col-md-4 col-lg-3" : "col-12"} key={n.id}>
                <NoteCard note={n} onClick={() => { setSelectedNote(n); setIsModalOpen(true); }} onDelete={() => handleDeleteNote(n.id)} theme={theme} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        {pinnedNotes.length > 0 && otherNotes.length > 0 && <small className="text-muted fw-bold ms-2 mb-3 d-block">KHÁC</small>}
        <div className={isGridView ? "row g-3" : "d-flex flex-column gap-3 mx-auto"} style={!isGridView ? { maxWidth: '700px' } : {}}>
          {otherNotes.map(n => (
            <div className={isGridView ? "col-12 col-sm-6 col-md-4 col-lg-3" : "col-12"} key={n.id}>
              <NoteCard note={n} onClick={() => { setSelectedNote(n); setIsModalOpen(true); }} onDelete={() => handleDeleteNote(n.id)} theme={theme} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NotesArea;