import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Modal from 'react-modal'; // Thư viện Modal (bạn có thể sử dụng thư viện khác nếu thích)
import ModalWrapper from '../ModalWrapper';

const FileUploadModal = ({ isOpen, onRequestClose }) => {
  const [files, setFiles] = useState([]);

  const onDrop = (acceptedFiles) => {
    setFiles([...files, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleUpload = () => {
    // Xử lý upload file ở đây
    console.log("Uploading files: ", files);
    onRequestClose(); // Đóng modal sau khi upload
  };

  return (
    <ModalWrapper open={isOpen} setOpen={onRequestClose}>
      <h2 className="text-lg font-bold mb-4">Upload Files</h2>
      <div 
        {...getRootProps({ className: 'border-2 border-dashed border-blue-500 rounded-md p-4 mb-4 cursor-pointer hover:border-blue-700' })} 
      >
        <input {...getInputProps()} />
        <p className="text-center text-gray-600">Kéo thả file vào đây, hoặc nhấn để chọn file</p>
      </div>
      <button 
        onClick={handleUpload} 
        disabled={files.length === 0} 
        className={`bg-blue-600 text-white rounded-md py-2 px-4 ${files.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
      >
        Upload
      </button>
      <button 
        onClick={onRequestClose} 
        className="mt-2 text-gray-700 hover:text-gray-900"
      >
        Close
      </button>
      <div className="mt-4">
        {files.map((file, index) => (
          <div key={index} className="text-gray-800">{file.name}</div>
        ))}
      </div>
    </ModalWrapper>
  );
};

export default FileUploadModal;
