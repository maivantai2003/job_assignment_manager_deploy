import React, { useRef, useState } from "react";
import axios from "axios";
import ModalWrapper from "../ModalWrapper";
import { BiX } from "react-icons/bi";
import { FaRegCheckCircle } from "react-icons/fa";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import ImageIcon from "@mui/icons-material/Image";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useDispatch } from "react-redux";
import { addFile} from "../../redux/file/fileSlice";
import { createChiTietFile } from "../../redux/fileassignment/fileassignmentSlice";
const FileUpload = ({ isOpen, onRequestClose, maPhanCong,maCongViec}) => {
  const inputRef = useRef();
  const dropRef = useRef();
  const dispatch = useDispatch();

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [progress, setProgress] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("select");
  const [previewFile, setPreviewFile] = useState(null);
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const filesArray = Array.from(event.target.files);
      const validFiles = filesArray.filter(
        (file) => file.size <= MAX_FILE_SIZE
      );

      if (validFiles.length < filesArray.length) {
        alert(
          "Một số tệp vượt quá kích thước cho phép (10 MB) và đã bị loại bỏ."
        );
      }

      setSelectedFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };
  const formatFileSize = (size) => {
    if (size === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };
  const clearFileInput = () => {
    inputRef.current.value = "";
    setSelectedFiles([]);
    setProgress([]);
    setUploadStatus("select");
  };

  const handleUpload = async () => {
    if (uploadStatus === "done") {
      clearFileInput();
      return;
    }

    try {
      setUploadStatus("uploading");
      const newProgress = Array(selectedFiles.length).fill(0);
      setProgress(newProgress);
      const responses = [];
      const uploadPromises = selectedFiles.map((file, index) => {
        const formData = new FormData();
        formData.append("file", file);

        return axios
          .post("https://localhost:7131/api/FileUpload/Upload", formData, {
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setTimeout(() => {
                newProgress[index] = percentCompleted;
                setProgress([...newProgress]);
              }, 200);
            },
          })
          .then((response) => {
            responses.push({
              name: file.name,
              url: response.data.url,
              extension: file.name.split(".").pop(),
              size: formatFileSize(file.size),
            });
          });
      });
      await Promise.all(uploadPromises);
      await Promise.all(
        responses.map(async (file) => {
          try {
            const result = await dispatch(
              addFile({
                tenFile: file.name,
                duongDan: file.url,
                loaiFile: file.extension,
                kichThuocFile: file.size,
              })
            ).unwrap();
            await dispatch(
              createChiTietFile({
                maPhanCong: maPhanCong,
                maFile: result.maFile,
              })
            );
          } catch (e) {
            console.error("Error adding file or file details:", e);
          }
        })
      );
      setUploadStatus("done");
    } catch (error) {
      console.error(error);
      setUploadStatus("select");
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      const filesArray = Array.from(files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };
  const [fileUrl, setFileUrl] = useState("");
  const handlePreviewFile = (file) => {
    const fileReader = new FileReader();

    // Check if it's a PDF, DOC, XLS, or PPT type
    if (
      file.type.includes("pdf") ||
      file.type.includes("txt") ||
      file.type.includes("word") ||
      file.type.includes("excel") ||
      file.type.includes("powerpoint")
    ) {
      // For Word, Excel, PowerPoint, use Google Docs Viewer
      const url = URL.createObjectURL(file);
      setPreviewFile({
        name: file.name,
        content: `https://docs.google.com/gview?url=${url}&embedded=true`,
        type: file.type,
      });
    } else if (file.type.includes("text")) {
      // Text file
      fileReader.onload = (e) => {
        setPreviewFile({
          name: file.name,
          content: e.target.result,
          type: file.type,
        });
      };
      fileReader.readAsText(file);
    } else {
      // Image files or other types
      fileReader.onload = (e) => {
        setPreviewFile({
          name: file.name,
          content: e.target.result,
          type: file.type,
        });
      };
      fileReader.readAsDataURL(file);
    }
  };
  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    const iconStyle = { color: "blue", fontSize: "24px" };

    switch (extension) {
      case "pdf":
        return <PictureAsPdfIcon style={iconStyle} />;
      case "doc":
      case "docx":
        return <DescriptionIcon style={iconStyle} />;
      case "ppt":
      case "pptx":
        return <SlideshowIcon style={iconStyle} />;
      case "jpg":
      case "jpeg":
      case "png":
        return <ImageIcon style={iconStyle} />;
      case "txt":
        return <TextSnippetIcon style={iconStyle} />;
      default:
        return <InsertDriveFileIcon style={iconStyle} />;
    }
  };

  return (
    <ModalWrapper open={isOpen} setOpen={onRequestClose}>
      <div
        className="relative p-2 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('url')" }}
      >
        <button
          onClick={onRequestClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
        >
          <BiX />
        </button>

        <input
          ref={inputRef}
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
          multiple
        />
        <div
          ref={dropRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-400 p-4 rounded-md text-center mb-4 bg-white/75"
        >
          <p className="mb-2">Nộp File Vào Đây</p>
          <button
            onClick={onChooseFile}
            className="inline-flex items-center px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            <span className="material-symbols-outlined mr-2">upload</span>
            Choose Files
          </button>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-4">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 border border-gray-300 rounded-md mb-2"
              >
                <div className="flex items-center flex-1">
                  <span className="material-symbols-outlined mr-2">
                    {getFileIcon(file.name)}
                  </span>
                  <div className="flex-1 overflow-hidden">
                    <h6
                      className="font-semibold cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis"
                      onClick={() => handlePreviewFile(file)}
                    >
                      {file.name}
                    </h6>
                    <div className="w-full h-1 bg-gray-200 rounded mt-1">
                      <div
                        className="h-full bg-blue-600 rounded"
                        style={{ width: `${progress[index] || 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                {uploadStatus === "select" ? (
                  <button
                    onClick={() => {
                      setSelectedFiles((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                      setProgress((prev) => prev.filter((_, i) => i !== index));
                    }}
                  >
                    <BiX />
                  </button>
                ) : (
                  <div className="flex items-center justify-center w-8 h-8 text-black rounded-full">
                    {uploadStatus === "uploading" ? (
                      `${progress[index] || 0}%`
                    ) : uploadStatus === "done" ? (
                      <span className="material-symbols-outlined">
                        <FaRegCheckCircle />
                      </span>
                    ) : null}
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={handleUpload}
              className={`mt-2 px-4 py-2 rounded text-white ${
                uploadStatus === "uploading"
                  ? "bg-gray-500"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={uploadStatus === "uploading"}
            >
              {uploadStatus === "select" || uploadStatus === "uploading"
                ? "Upload"
                : "Done"}
            </button>
          </div>
        )}
        {previewFile && (
          <ModalWrapper
            open={!!previewFile}
            setOpen={() => setPreviewFile(null)}
          >
            <div className="relative p-4 bg-white rounded shadow-md w-full max-w-7xl max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setPreviewFile(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              >
                <BiX />
              </button>

              <h2 className="text-lg font-semibold mb-4">{previewFile.name}</h2>
              {previewFile.type.includes("image") ? (
                <img
                  src={previewFile.content}
                  alt={previewFile.name}
                  className="max-w-full h-auto"
                />
              ) : previewFile.type.includes("pdf") ||
                previewFile.type.includes("word") ||
                previewFile.type.includes("excel") ||
                previewFile.type.includes("powerpoint") ? (
                <iframe
                  src={previewFile.content}
                  className="w-full h-[80vh]"
                  title="File Preview"
                />
              ) : previewFile.type.includes("text") ? (
                <pre className="whitespace-pre-wrap max-h-[80vh] overflow-y-auto">
                  {previewFile.content}
                </pre>
              ) : (
                <p>Cannot preview this file type</p>
              )}
            </div>
          </ModalWrapper>
        )}
      </div>
    </ModalWrapper>
  );
};

export default FileUpload;
