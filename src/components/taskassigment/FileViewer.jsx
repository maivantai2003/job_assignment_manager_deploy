// FileViewer.js
import React from 'react';
import Modal from 'react-modal';

const FileViewer = ({ isOpen, onClose, fileUrl }) => {
  // Tạo URL cho Google Docs Viewer
  const googleDocsUrl = `https://docs.google.com/gview?url=${fileUrl}&embedded=true`;

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} ariaHideApp={false}>
      <button onClick={onClose}>Đóng</button>
      <iframe
        src={googleDocsUrl}
        style={{ width: '100%', height: '100vh' }}
        title="File Viewer"
      />
    </Modal>
  );
};

export default FileViewer;
