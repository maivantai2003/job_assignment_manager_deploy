import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiDownload, FiEye, FiFile } from "react-icons/fi";
import { Document, Page } from 'react-pdf';
import {
  AiFillFilePdf,
  AiFillFileWord,
  AiFillFileExcel,
  AiFillFilePpt,
  AiFillFileImage,
} from "react-icons/ai";
import { Modal } from "@mui/material";
import { FaFileArchive, FaProjectDiagram, FaVideo } from "react-icons/fa";
import { FaFileZipper } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { fetchByIdTask } from "../../redux/task/taskSlice";
import { fetchChiTietFileByPhanCong } from "../../redux/fileassignment/fileassignmentSlice";
import { fetchAllFile } from "../../redux/file/fileSlice";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import PdfViewer from "./PdfViewer";
import API_ENDPOINTS from "../../constant/linkapi";
const FileView = () => {
  const { id } = useParams();
  const maCongViec = Number(id);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [connection, setConnection] = useState(null);
  const [allFile, setAllFile] = useState([]);
  const dispatch = useDispatch();
  const phancong = useSelector((state) =>
    state.tasks.list.find((task) => task.maCongViec === maCongViec)
  );
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch task and files in parallel
        const [phancongs, files] = await Promise.all([
          dispatch(fetchByIdTask(maCongViec)).unwrap(),
          dispatch(fetchAllFile()).unwrap(),
        ]);

        const allFiles = await Promise.all(
          phancongs.phanCongs.map((item) =>
            dispatch(fetchChiTietFileByPhanCong(item.maPhanCong)).unwrap()
          )
        );

        setAllFile(allFiles.flat());

        const detailedFiles = allFiles.flat().map((fileDetail) => {
          const relatedAssignment = phancongs.phanCongs.find(
            (item) => item.maPhanCong === fileDetail.maPhanCong
          );
          return {
            ...fileDetail,
            tenNguoiGui:
              relatedAssignment?.nhanVien.maNhanVien +
              "-" +
              relatedAssignment?.nhanVien.tenNhanVien,
            ngayGui: fileDetail?.ngayGui
              ? new Date(fileDetail.ngayGui).toLocaleString()
              : null,
          };
        });

        const matchingFiles = files.filter((file) =>
          detailedFiles.some((detail) => detail.maFile === file.maFile)
        );

        const enrichedFiles = matchingFiles.map((file) => ({
          ...file,
          tenNguoiGui: detailedFiles.find(
            (detail) => detail.maFile === file.maFile
          )?.tenNguoiGui,
          ngayGui: detailedFiles.find((detail) => detail.maFile === file.maFile)
            ?.ngayGui,
        }));

        setFilteredFiles(enrichedFiles);
      } catch (error) {
        console.error("Error fetching task:", error);
      } finally {
        setLoading(false);
      }
    };

    if (maCongViec) {
      fetchData();
    }
  }, [maCongViec, dispatch]);
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(API_ENDPOINTS.HUB_URL)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();
    setConnection(newConnection);
  }, []);
  useEffect(() => {
    const startConnection = async () => {
      if (connection && connection.state === "Disconnected") {
        try {
          await connection.start();
          console.log("Connection started");
          connection.on("loadFile", async () => {
            setLoading(true);
            try {
              // Fetch task and files in parallel
              const [phancongs, files] = await Promise.all([
                dispatch(fetchByIdTask(maCongViec)).unwrap(),
                dispatch(fetchAllFile()).unwrap(),
              ]);

              const allFiles = await Promise.all(
                phancongs.phanCongs.map((item) =>
                  dispatch(fetchChiTietFileByPhanCong(item.maPhanCong)).unwrap()
                )
              );

              setAllFile(allFiles.flat());

              const detailedFiles = allFiles.flat().map((fileDetail) => {
                const relatedAssignment = phancongs.phanCongs.find(
                  (item) => item.maPhanCong === fileDetail.maPhanCong
                );
                return {
                  ...fileDetail,
                  tenNguoiGui:
                    relatedAssignment?.nhanVien.maNhanVien +
                    "-" +
                    relatedAssignment?.nhanVien.tenNhanVien,
                  ngayGui: fileDetail?.ngayGui
                    ? new Date(fileDetail.ngayGui).toLocaleString()
                    : null,
                };
              });

              const matchingFiles = files.filter((file) =>
                detailedFiles.some((detail) => detail.maFile === file.maFile)
              );

              const enrichedFiles = matchingFiles.map((file) => ({
                ...file,
                tenNguoiGui: detailedFiles.find(
                  (detail) => detail.maFile === file.maFile
                )?.tenNguoiGui,
                ngayGui: detailedFiles.find(
                  (detail) => detail.maFile === file.maFile
                )?.ngayGui,
              }));

              setFilteredFiles(enrichedFiles);
            } catch (error) {
              console.error("Error fetching task:", error);
            } finally {
              setLoading(false);
            }
          });
        } catch (err) {
          console.error("Error while starting connection: ", err);
        }
      }
    };

    if (connection) {
      startConnection();
    }

    return () => {
      if (connection) {
        connection.off("loadFile");
        connection.off("loadCongViec");
      }
    };
  }, [connection, dispatch, maCongViec]);
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100px",
        }}
      >
        <div
          style={{
            border: "4px solid rgba(0, 0, 0, 0.1)",
            borderLeftColor: "#3b82f6",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            animation: "spin 1s linear infinite",
          }}
        />
      </div>
    );
  }
  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return <AiFillFilePdf className="text-red-500 text-4xl" />;
      case "doc":
      case "docx":
        return <AiFillFileWord className="text-blue-500 text-4xl" />;
      case "xls":
      case "xlsx":
        return <AiFillFileExcel className="text-green-500 text-4xl" />;
      case "ppt":
      case "pptx":
        return <AiFillFilePpt className="text-orange-500 text-4xl" />;
      case "txt":
        return <FiFile className="text-gray-500 text-4xl" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <AiFillFileImage className="text-purple-500 text-4xl" />; // Icon cho file ảnh
      case "mp4":
      case "avi":
      case "mov":
      case "wmv":
        return <FaVideo className="text-blue-500 text-4xl" />; // Icon cho video
      case "zip":
        return <FaFileZipper className="text-yellow-500 text-4xl" />; // Icon cho file ZIP
      case "rar":
        return <FaFileArchive className="text-orange-500 text-4xl" />; // Icon cho file RAR
      case "mpp":
        return <FaProjectDiagram className="text-teal-500 text-4xl" />;
      default:
        return <FiFile className="text-gray-500 text-4xl" />;
    }
  };

  // Mở modal preview
  const handlePreview = (file) => {
    console.log(file);
    setSelectedFile(file);
    if (file.tenFile.match(/\.sql$/)) {
      fetch(file.duongDan)
        .then((response) => response.text())
        .then((content) => setFileContent(content));
    }else {
      setFileContent("");
    }
    setShowPreview(true);
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        Công Việc {phancong.tenCongViec}
      </h2>
      <h3> Danh Sách File Đã Nộp</h3>
      <br />
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-y-auto"
        style={{ maxHeight: "500px" }}
      >
        {loading ? (
          <div>Loading...</div>
        ) : (
          filteredFiles.map((file) => (
            <div
              key={file.maFile}
              className="bg-white shadow-md rounded-lg p-4"
            >
              <div className="flex items-center mb-2">
                {getFileIcon(file.tenFile)}
                <div className="ml-4">
                  <p
                    className="text-gray-600 truncate"
                    style={{ maxWidth: "150px" }}
                  >
                    {file.tenFile}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    <span className="font-semibold">Người gửi: </span>
                    {file.tenNguoiGui.split("-")[0]===localStorage.getItem("userId")?"Tôi":file.tenNguoiGui || "Không có thông tin"}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Thời gian gửi: </span>
                    {file.ngayGui || "Không có thông tin"}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
              <span
                className={`inline-block px-2 py-1 mt-2 rounded ${
                  file.trangThai === 1
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {file.kichThuocFile}
              </span>
              <div className="flex mt-4 space-x-4">
                <button
                  onClick={() => handlePreview(file)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FiEye className="inline-block mr-1" />
                </button>
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch(file.duongDan);
                      if (!response.ok) {
                        throw new Error("Network response was not ok");
                      }
                      const blob = await response.blob();
                      const link = document.createElement("a");
                      link.href = window.URL.createObjectURL(blob);
                      link.download = file.tenFile;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    } catch (error) {
                      console.error("Error downloading file:", error);
                    }
                  }}
                  className="text-green-500 hover:text-green-700"
                >
                  <FiDownload className="inline-block mr-1" />
                </button>
              </div>
              </div>
            </div>
          ))
        )}
      </div>
      {showPreview && selectedFile && (
        <Modal
          open={showPreview}
          onClose={() => setShowPreview(false)}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="bg-white p-4 rounded-lg max-w-2xl w-full h-full relative">
            <h2 className="text-lg font-bold mb-4">Preview File</h2>
            <div className="overflow-auto" style={{ height: "80vh" }}>
              {selectedFile.tenFile.match(/\.(jpeg|jpg|png|gif|jfif)$/) ? (
                <img
                  src={selectedFile.duongDan}
                  alt="File Preview"
                  className="w-full h-auto"
                />
              ) : selectedFile.tenFile.match(/\.txt$/) ||
                selectedFile.tenFile.match(/\.sql$/) ? (
                <pre className="whitespace-pre-wrap text-gray-700">
                  {fileContent}
                </pre>
              ) : (
                <iframe
                  src={`https://docs.google.com/gview?url=${encodeURIComponent(
                    selectedFile.duongDan
                  )}&embedded=true`}
                  width="100%"
                  height="100%"
                  allowFullScreen
                  title="File Preview"
                />
              )}
            </div>
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-md px-2 py-1 hover:bg-red-600"
            >
              Đóng
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FileView;
