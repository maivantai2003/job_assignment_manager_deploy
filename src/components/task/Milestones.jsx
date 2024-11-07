import React, { useEffect, useState } from 'react';
import { FaSmile } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';
import Dropzone from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReminders } from '../../redux/reminder/reminderSlice';
import { checkPermission } from '../../redux/permissiondetail/permissionDetailSlice';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const dispacth=useDispatch()
  const reminders=useSelector((state)=>state.reminders.list)
  const [permissionAction,setpermissionAction]=useState([])
  useEffect(()=>{
    const fetchData=async ()=>{
      await dispacth(fetchReminders())
      const result=await dispacth(checkPermission({maQuyen:3,tenChucNang:"Công Việc"})).unwrap()
      setpermissionAction(result)
    }
    fetchData()
  },[dispacth])
  console.log(reminders)
  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, file: null }]);
      setInput('');
    }
  };

  const handleDrop = (acceptedFiles) => {
    const newMessage = {
      text: 'Sent a file',
      file: acceptedFiles[0],
    };
    setMessages([...messages, newMessage]);
  };

  const onEmojiClick = (event, emojiObject) => {
    setInput(input + emojiObject.emoji);
  };
  console.log(permissionAction)
  return (
    <div className="chat-box">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index}>
            <p>{msg.text}</p>
            {msg.file && <p>File: {msg.file.name}</p>}
          </div>
        ))}
      </div>

      <div className="input-area">
        <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          <FaSmile />
        </button>
        {showEmojiPicker && <EmojiPicker onEmojiClick={onEmojiClick} />}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={handleSend}>Send</button>

        <Dropzone onDrop={handleDrop}>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
          )}
        </Dropzone>
        {permissionAction.includes("Thêm") && <button>Thêm</button>}
        {permissionAction.includes("Xóa") && <button>Xóa</button>}
        {permissionAction.includes("Sửa") && <button>Sửa</button>}
      </div>
    </div>
  );
};

export default ChatBox;
