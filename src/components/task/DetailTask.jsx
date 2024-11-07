// DetailTask.jsx
import React, { useEffect, useState } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import Picker from "emoji-picker-react";
import { FaSmile } from "react-icons/fa";
import { FaPaperclip } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import API_ENDPOINTS from "../../constant/linkapi";
const DetailTask = ({
  expanded,
  setExpanded,
  task,
  titleTask,
  name,
  date,
  userTeam,
  roleTeam,
}) => {
  const maCongViec = task.maCongViec + "";
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showComments, setShowComment] = useState(true);
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(API_ENDPOINTS.HUB_URL)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();
    newConnection
      .start()
      .then(() => {
        console.log("Connected!");
        setConnection(newConnection);

        // Tham gia nhóm
        newConnection
          .invoke("ThamGiaNhom", maCongViec)
          .then(() => {
            console.log(`Joined group: ${maCongViec}`);
          })
          .catch((err) => console.error("Error joining group: ", err));
        //newConnection.off("ReceiveMessage");
        newConnection.on("ReceiveMessage", (user, message) => {
          const newMessage = { user, message };
          console.log(newMessage);
          setMessages((prevMessages) => [...prevMessages, newMessage]);
          console.log(newMessage);
        });
        newConnection.on("UserJoined", (message) => {
          console.log(message);
        });
      })
      .catch((err) => console.error("Connection failed: ", err));
    return () => {
      if (newConnection) {
        newConnection.stop();
        console.log("Connection stopped.");
      }
    };
  }, [maCongViec]);
  const handleSendComment = async () => {
    if (newComment.trim() === "") return;
    
    const messageContent = selectedFile
      ? `Uploaded file: ${selectedFile.name}`
      : newComment;
    try {
      await connection.invoke(
        "TraoDoiThongTin",
        maCongViec,
        localStorage.getItem("name"),
        messageContent
      );
      setNewComment("");
      setSelectedFile(null);
      setShowEmojiPicker(false);
    } catch (err) {
      console.error("Error sending message: ", err);
      setErrorMessage("Failed to send message.");
    } finally {
      //setLoading(false);
    }
  };
  const onEmojiClick = (emoji) => {
    setNewComment((prev) => prev + emoji.emoji);
    setShowEmojiPicker(false);
  };
  const handleFileChange = (event) => {
    //setSelectedFile(event.target.files[0]);
    setSelectedFiles([...selectedFiles, ...event.target.files]);
  };
  return (
    <>
      <div
        className={`fixed overflow-auto top-0 right-0 h-full bg-white shadow-lg w-1/2 transform ${
          expanded ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
        style={{
          position: "absolute",
          zIndex: 10,
          borderLeft: "1px solid #e5e7eb",
        }}
      >
        {/* Close button */}
        <div className="flex justify-between p-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full focus:outline-none">
            Mark Complete
          </button>
          <button
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={() => setExpanded(false)}
          >
            ✖️
          </button>
        </div>

        {/* Task Title */}
        <div className="mb-4 px-6">
          <h2 className="text-2xl font-semibold text-gray-800">{titleTask}</h2>
        </div>
        {/* Assignee and Due Date */}
        <div className="mb-4 px-6 flex justify-between items-center">
          <div className="flex items-center">
            {roleTeam.map((member, index) => (
              <div
                key={index}
                className="rounded-full h-10 w-10 bg-purple-600 flex items-center justify-center text-xl text-white mr-2"
              >
                {member.nhanVien?.tenNhanVien.slice(0, 2)}
              </div>
            ))}
            <span className="ml-3 text-gray-700">
              {roleTeam[0]?.nhanVien?.email}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-red-600 mr-3 text-sm">{date}</span>
            <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs">
              Limited access
            </span>
          </div>
        </div>
        <div className="mb-6 px-6">
          <p className="text-gray-700 font-medium">Mô Tả</p>
          <textarea
            className="w-full bg-gray-50 p-3 mt-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="What is this task about?"
            rows="2"
            value={task.moTa}
            readOnly
          ></textarea>
        </div>

        {/* Collaborators Section */}
        <div className="mb-6 px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-gray-700 font-medium">Thành Viên:</span>
              <div className="flex -space-x-2 ml-3">
                {userTeam.map((m, index) => {
                  return (
                    <div
                      className="rounded-full h-8 w-8 bg-purple-500 flex items-center justify-center text-xs text-white"
                      key={index}
                    >
                      {m.nhanVien?.tenNhanVien.slice(0, 2)}
                    </div>
                  );
                })}
                <div
                  style={{
                    cursor: "pointer",
                  }}
                  className="rounded-full h-8 w-8 bg-gray-400 flex items-center justify-center text-xs text-white"
                >
                  +
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-4 px-6 bg-gray-100">
          <div
            className=" rounded border-t-2"
            style={{ maxHeight: "200px", overflowY: "auto" }} // Thanh trượt
          >
            <div className="border">
              <button
                onClick={() => {
                  setShowComment(true);
                }}
                className="px-2 py font-bold border-r-2"
              >
                comments
              </button>
              <button
                onClick={() => {
                  setShowComment(false);
                }}
                className="px-2 py font-bold"
              >
                histories
              </button>
            </div>
            {showComments ? (
              <div className="py-2">
                {messages.map((comment, index) => (
                  <div
                    key={index}
                    className="mb-2 bg-gray-50 p-2 border rounded-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="rounded-full h-8 w-8 bg-purple-500 flex items-center justify-center text-xs text-white">
                          {comment.user.slice(0, 2)}
                        </div>
                        <span className="ml-3 text-gray-700">
                          {comment.user===localStorage.getItem("name")?"Bạn":comment.user}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">{new Date().toISOString()}</span>
                    </div>
                    <p className="ml-11 text-gray-600">{comment.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div>histories</div>
            )}
          </div>
        </div>

        <div className="mb-4 px-6 absolute bottom-0 w-full">
          <div className="flex items-center">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full bg-gray-50 p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a comment"
            />
            {newComment.trim() === "" ? (
              <button
                className=" text-gray-400 px-4 py-2 rounded-full ml-3 focus:outline-none"
                disabled
              >
                <IoMdSend size={30} />
              </button>
            ) : (
              <button
                className=" text-black px-4 py-2 rounded-full ml-3 focus:outline-none"
                onClick={handleSendComment}
              >
                <IoMdSend size={30} />
              </button>
            )}
            {/* Emoji Picker Toggle */}
            <button
              className="ml-3 focus:outline-none"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <FaSmile className="text-2xl text-gray-600" />
            </button>
            <label className="ml-3 cursor-pointer">
              <FaPaperclip className="text-2xl text-gray-600" />
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              />
            </label>
            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div
                className="top-0 right-10 -translate-y-full"
                style={{ position: "absolute", zIndex: 20 }}
              >
                <Picker onEmojiClick={onEmojiClick} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
const handleUpload = async () => {
  try {
    const newProgress = Array(selectedFiles.length).fill(0);
    setProgress(newProgress);
    const responses = [];

    const uploadPromises = selectedFiles.map((file, index) => {
      const formData = new FormData();
      formData.append("file", file);

      return axios
        .post("https://localhost:7131/api/FileUpload/Upload", formData)
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
    return responses;
  } catch (error) {
    console.error(error);
    setUploadStatus("select");
    return [];
  }
};

export default DetailTask;
