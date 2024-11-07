import clsx from "clsx";
import moment from "moment";
import React, { useState } from "react";
import { FaBug, FaTasks, FaThumbsUp, FaUser } from "react-icons/fa";
import { GrInProgress } from "react-icons/gr";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineDoneAll,
  MdOutlineMessage,
  MdTaskAlt,
} from "react-icons/md";
import { RxActivityLog } from "react-icons/rx";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { tasks } from "../assets/data";
import Tabs from "../components/Tabs";
import { PRIOTITYSTYELS, TASK_TYPE, getInitials } from "../utils";
import Loading from "../components/Loader";
import Button from "../components/Button";

const assets = [
  "https://images.pexels.com/photos/2418664/pexels-photo-2418664.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/8797307/pexels-photo-8797307.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/2534523/pexels-photo-2534523.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/804049/pexels-photo-804049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
];

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const bgColor = {
  high: "bg-red-200",
  medium: "bg-yellow-200",
  low: "bg-blue-200",
};

const TABS = [
  { title: "Chi tiết công việc", icon: <FaTasks /> },
  { title: "Hoạt động/Dòng thời gian", icon: <RxActivityLog /> },
];

const TASKTYPEICON = {
  commented: (
    <div className='w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white'>
      <MdOutlineMessage />,
    </div>
  ),
  started: (
    <div className='w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white'>
      <FaThumbsUp size={20} />
    </div>
  ),
  assigned: (
    <div className='w-6 h-6 flex items-center justify-center rounded-full bg-gray-500 text-white'>
      <FaUser size={14} />
    </div>
  ),
  bug: (
    <div className='text-red-600'>
      <FaBug size={24} />
    </div>
  ),
  completed: (
    <div className='w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white'>
      <MdOutlineDoneAll size={24} />
    </div>
  ),
  "in progress": (
    <div className='w-8 h-8 flex items-center justify-center rounded-full bg-violet-600 text-white'>
      <GrInProgress size={16} />
    </div>
  ),
};

const act_types = [
  "Bắt đầu",
  "Hoàn thành",
  "Đang tiến hành",
  "Bình luận",
  "Lỗi",
  "Được giao",
];

const TaskDetails = () => {
  const { id } = useParams(); // Lấy thông tin 'id' từ URL.

  const [selected, setSelected] = useState(0); // Quản lý tab đang được chọn.
  const task = tasks[3]; // Lấy công việc từ dữ liệu mẫu.

  return (
    <div className='w-full flex flex-col gap-3 mb-4 overflow-y-hidden'>
      <h1 className='text-2xl text-gray-600 font-bold'>{task?.title}</h1> {/* Tiêu đề công việc */}

      <Tabs tabs={TABS} setSelected={setSelected}> {/* Tabs điều hướng */}
        {selected === 0 ? ( // Hiển thị chi tiết công việc
          <>
            <div className='w-full flex flex-col md:flex-row gap-5 2xl:gap-8 bg-white shadow-md p-8 overflow-y-auto'>
              {/* Bên trái */}
              <div className='w-full md:w-1/2 space-y-8'>
                <div className='flex items-center gap-5'>
                  <div
                    className={clsx(
                      "flex gap-1 items-center text-base font-semibold px-3 py-1 rounded-full",
                      PRIOTITYSTYELS[task?.priority],
                      bgColor[task?.priority]
                    )}
                  >
                    <span className='text-lg'>{ICONS[task?.priority]}</span> {/* Biểu tượng ưu tiên */}
                    <span className='uppercase'>{task?.priority} Ưu tiên</span>
                  </div>

                  <div className={clsx("flex items-center gap-2")}>
                    <div
                      className={clsx(
                        "w-4 h-4 rounded-full",
                        TASK_TYPE[task.stage]
                      )}
                    />
                    <span className='text-black uppercase'>{task?.stage}</span> {/* Trạng thái công việc */}
                  </div>
                </div>

                <p className='text-gray-500'>
                  Ngày tạo: {new Date(task?.date).toDateString()}
                </p>

                <div className='flex items-center gap-8 p-4 border-y border-gray-200'>
                  <div className='space-x-2'>
                    <span className='font-semibold'>Tài liệu đính kèm:</span>
                    <span>{task?.assets?.length}</span>
                  </div>

                  <span className='text-gray-400'>|</span>

                  <div className='space-x-2'>
                    <span className='font-semibold'>Nhiệm vụ phụ:</span>
                    <span>{task?.subTasks?.length}</span>
                  </div>
                </div>

                <div className='space-y-4 py-6'>
                  <p className='text-gray-600 font-semibold test-sm'>
                    ĐỘI NGŨ CÔNG VIỆC
                  </p>
                  <div className='space-y-3'>
                    {task?.team?.map((m, index) => (
                      <div
                        key={index}
                        className='flex gap-4 py-2 items-center border-t border-gray-200'
                      >
                        <div
                          className={
                            "w-10 h-10 rounded-full text-white flex items-center justify-center text-sm -mr-1 bg-blue-600"
                          }
                        >
                          <span className='text-center'>
                            {getInitials(m?.name)} {/* Lấy tên viết tắt */}
                          </span>
                        </div>

                        <div>
                          <p className='text-lg font-semibold'>{m?.name}</p>
                          <span className='text-gray-500'>{m?.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='space-y-4 py-6'>
                  <p className='text-gray-500 font-semibold text-sm'>
                    NHIỆM VỤ PHỤ
                  </p>
                  <div className='space-y-8'>
                    {task?.subTasks?.map((el, index) => (
                      <div key={index} className='flex gap-3'>
                        <div className='w-10 h-10 flex items-center justify-center rounded-full bg-violet-50-200'>
                          <MdTaskAlt className='text-violet-600' size={26} />
                        </div>

                        <div className='space-y-1'>
                          <div className='flex gap-2 items-center'>
                            <span className='text-sm text-gray-500'>
                              {new Date(el?.date).toDateString()}
                            </span>

                            <span className='px-2 py-0.5 text-center text-sm rounded-full bg-violet-100 text-violet-700 font-semibold'>
                              {el?.tag}
                            </span>
                          </div>

                          <p className='text-gray-700'>{el?.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Bên phải */}
              <div className='w-full md:w-1/2 space-y-8'>
                <p className='text-lg font-semibold'>TÀI LIỆU ĐÍNH KÈM</p>

                <div className='w-full grid grid-cols-2 gap-4'>
                  {task?.assets?.map((el, index) => (
                    <img
                      key={index}
                      src={el}
                      alt={task?.title}
                      className='w-full rounded h-28 object-cover'
                    />
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <Activities /> // Hiển thị tab hoạt động
        )}
      </Tabs>
    </div>
  );
};

const Activities = () => {
  const [actType, setActType] = useState([]); // Quản lý loại hoạt động được chọn
  const [comment, setComment] = useState(""); // Quản lý nội dung bình luận

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!actType.length) {
      return toast.error("Vui lòng chọn loại hoạt động"); // Thông báo lỗi nếu không chọn loại hoạt động
    }
    if (!comment.length) {
      return toast.error("Nội dung không được để trống"); // Thông báo lỗi nếu không có nội dung
    }

    setActType([]); // Xóa loại hoạt động sau khi gửi
    setComment(""); // Xóa nội dung bình luận sau khi gửi
    toast.success("Đã thêm hoạt động"); // Thông báo thành công
  };

  return (
    <div className='w-full flex flex-col md:flex-row gap-8 items-start justify-between p-8 bg-white shadow-md'>
      <div className='w-full flex flex-col gap-6'>
        <h3 className='text-xl font-semibold text-gray-700'>Hoạt động</h3>

        <div className='space-y-8'>
          {[
            {
              id: 1,
              actor: "John Doe",
              act_type: "completed",
              date: new Date(),
              content: "Đã hoàn thành nhiệm vụ 1",
            },
            {
              id: 2,
              actor: "Jane Smith",
              act_type: "in progress",
              date: new Date(),
              content: "Đang làm nhiệm vụ 2",
            },
          ].map((activity) => (
            <div
              key={activity.id}
              className='w-full flex gap-3 md:gap-5 items-start'
            >
              <div>{TASKTYPEICON[activity?.act_type]}</div> {/* Biểu tượng hoạt động */}
              <div className='space-y-1'>
                <div className='space-x-1 flex'>
                  <p className='font-semibold'>{activity.actor}</p>
                  <span className='text-gray-500'>đã {activity?.act_type}</span> {/* Loại hoạt động */}
                </div>

                <p className='text-gray-500'>{activity?.content}</p> {/* Nội dung hoạt động */}
                <span className='text-sm text-gray-400'>
                  {moment(activity?.date).fromNow()} {/* Thời gian */}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className='w-full flex flex-col gap-8'>
        <div className='flex gap-4 flex-wrap'>
          {act_types.map((el, idx) => (
            <label key={idx} className='flex gap-2 items-center'>
              <input
                type='checkbox'
                name='act_type'
                className='w-4 h-4'
                value={el}
                checked={actType.includes(el)}
                onChange={() => {
                  if (actType.includes(el)) {
                    setActType(actType.filter((v) => v !== el)); // Bỏ chọn nếu đã được chọn
                  } else {
                    setActType((prev) => [...prev, el]); // Thêm loại hoạt động nếu chưa chọn
                  }
                }}
              />
              <span className='text-gray-600'>{el}</span>
            </label>
          ))}
        </div>

        <textarea
          rows={3}
          name='comment'
          className='w-full px-4 py-3 rounded-md border-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          placeholder='Mô tả hoạt động của bạn'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <Button type='submit' text='Thêm hoạt động' /> {/* Nút gửi */}
      </form>
    </div>
  );
};

export default TaskDetails;
