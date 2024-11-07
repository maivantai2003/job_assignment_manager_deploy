import { BiCalendar, BiPlus } from "react-icons/bi";
import { BGS, formatDate } from "../../utils";
import Selection from "../Selection";
import clsx from "clsx";
import Button from "../Button";
import AddTask from "./AddTask";
import { useEffect, useState } from "react";

import {
  IoMdAdd,
  IoMdCreate,
  IoMdSwap,
  IoMdTime,
  IoMdTrash,
} from "react-icons/io";
import DetailTask from "./DetailTask";
import { useDispatch, useSelector } from "react-redux";
import { fetchByIdTask, updateCompleteTask } from "../../redux/task/taskSlice";
import EmployeeInfo from "../EmployeeInfo";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import UpdateTask from "./UpdateTask";
import AddTaskTransfer from "../tasktransfer/AddTaskTransfer";
import TaskHistory from "./TaskHistory";
import { checkPermission } from "../../redux/permissiondetail/permissionDetailSlice";
import API_ENDPOINTS from "../../constant/linkapi";
const priorities = [
  { id: "low", name: "Thấp" },
  { id: "medium", name: "Trung Bình" },
  { id: "high", name: "Cao" },
];

const stages = [
  { id: "todo", name: "Cần Làm" },
  { id: "in_progress", name: "Đang làm" },
  { id: "done", name: "Hoàn thành" },
];

const TaskListItem = ({ congviec, duAn }) => {
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openTransfer, setOpenTransfer] = useState(false);
  const [openTaskHistory, setOpenTaskHistory] = useState(false);
  const [taskRoot, setTaskRoot] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [subTasks, setSubTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permissionAction, setpermissionAction] = useState([]);
  const [connection, setConnection] = useState(null);
  const maquyen = Number(localStorage.getItem("permissionId"));
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const maCongViec = congviec.maCongViec;
  const trangThaiCongViec = congviec.trangThaiCongViec;
  const phancong = useSelector((state) =>
    state.tasks.list.find((task) => task.maCongViec === maCongViec)
  );
  useEffect(() => {
    const fetchTask = async () => {
      try {
        if (maCongViec) {
          setLoading(true);
          await dispatch(fetchByIdTask(maCongViec));
          const result = await dispatch(
            checkPermission({ maQuyen: maquyen, tenChucNang: "Công Việc" })
          ).unwrap();
          setpermissionAction(result);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [maCongViec]);
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(API_ENDPOINTS.HUB_URL)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();
    setConnection(newConnection);
  }, []);
  useEffect(() => {
    if (connection && connection.state === "Disconnected") {
      connection
        .start()
        .then(() => {
          console.log("Connected!");
          connection.on("updateCongViec", () => {
            if (maCongViec) {
              dispatch(fetchByIdTask(maCongViec));
            }
          });
          connection.on("loadPhanCong", () => {
            if (maCongViec) {
              dispatch(fetchByIdTask(maCongViec));
            }
          });
          connection.on("loadHanhDong", async () => {
            if (maCongViec) {
              const result = await dispatch(
                checkPermission({ maQuyen: maquyen, tenChucNang: "Công Việc" })
              ).unwrap();
              setpermissionAction(result);
            }
          });
        })
        .catch((error) => console.error("Connection failed: ", error));
      return () => {
        if (connection) {
          connection.off("loadHanhDong");
          connection.off("loadPhanCong");
          connection.off("updateCongViec");
        }
      };
    }
  }, [connection, maCongViec, dispatch]);
  const handleToggleDetail = () => {
    setExpanded(!expanded);
  };
  const phanCongs =
    phancong?.phanCongs?.filter((task) => task.trangThai === true) || [];
  const chiuTrachNhiem = phanCongs?.filter(
    (m) => m.vaiTro === "Người Chịu Trách Nhiệm"
  );
  const thucHien = phanCongs?.filter(
    (m) => m.vaiTro === "Người Thực Hiện"
  );
  // const congViecHoanThanh =
  //   phancong?.phanCongs?.filter((task) => task.trangThaiCongViec === true)
  //     .length ?? 0;
  // const tongCongViec = phancong?.phanCongs?.length || 1;
  // const completionPercent = (congViecHoanThanh / tongCongViec) * 100;
  const congViecHoanThanh = phanCongs.filter(
    (task) => task.trangThaiCongViec === true
  ).length;
  const tongCongViec = phanCongs.length || 1;
  const completionPercent = (congViecHoanThanh / tongCongViec) * 100;
  useEffect(() => {
    if (completionPercent === 100 && trangThaiCongViec === false) {
      try {
        const result = dispatch(
          updateCompleteTask({
            id: maCongViec,
            task: true,
          })
        ).unwrap();
      } catch (e) {
        console.log(e);
      }
    }
  }, [completionPercent, trangThaiCongViec, maCongViec, dispatch]);
  const handleAddSubTask = (newSubTask) => {
    setSubTasks([...subTasks, newSubTask]);
    setOpen(false);
  };
  const isParentTask = (task) => {
    return !task.maCongViecCha;
  };
  const hasSubTasks = (task) => {
    return task.congViecCon && task.congViecCon.length > 0;
  };
  const getCompletionColor = (percent) => {
    if (percent < 50) {
      return "bg-red-600";
    } else if (percent >= 50 && percent < 80) {
      return "bg-yellow-500";
    } else {
      return "bg-green-500";
    }
  };
  const itemClass = isParentTask(congviec)
    ? hasSubTasks(congviec)
      ? "font-bold text-blue-600 bg-blue-100"
      : "font-bold bg-blue-200"
    : "pl-6 bg-gray-100";
  return (
    <div
      className={`w-full flex items-center px-4 ${
        isParentTask(congviec) ? "" : "ml-4"
      }`}
    >
      <div className={`w-full flex items-center py-1 border-b text-sm ${itemClass}`}>
        <div
          className={`flex-1 w-1/4 px-4 truncate cursor-pointer ${
            isParentTask(congviec) ? "font-bold" : "pl-4"
          }`}
          onClick={handleToggleDetail}
        >
          {isParentTask(congviec) ? (
            <span className="text-gray-500 break-words">
              🔹 {congviec.tenCongViec}
            </span>
          ) : (
            <span className="break-words">{congviec.tenCongViec}</span>
          )}
          <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
            <div
              className={`${getCompletionColor(
                completionPercent
              )} h-4 rounded-full`}
              style={{ width: `${completionPercent}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-500">
            {completionPercent.toFixed(2)}% Hoàn thành
          </span>
        </div>
        <div className="flex-1 w-1/5 px-4 ">
          <span>{congviec.mucDoUuTien}</span>
        </div>
        <div className="flex-1 px-4 text-gray-400 flex items-center">
          <button
            className="hover:bg-gray-200 rounded-full px-2"
            onClick={() => {
              alert("show calendar");
            }}
          >
            {congviec.thoiGianKetThuc ? (
              formatDate(new Date(congviec.thoiGianKetThuc))
            ) : (
              <div className="p-1 w-fit border-2 border-dashed rounded-full border-gray-400">
                <BiCalendar size={20} />
              </div>
            )}
          </button>
        </div>
        <div className="flex-1 px-4 flex items-center">
          {chiuTrachNhiem?.map((m, index) => (
            <div
              key={index}
              className={clsx(
                "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                BGS[index % BGS?.length]
              )}
            >
              <EmployeeInfo employee={m} />
            </div>
          ))}
          <button
            onClick={() => {
              alert("assign");
            }}
            className="rounded-full border-2 border-dashed size-fit p-1 ml-2 border-gray-400 text-gray-400"
          >
            <BiPlus />
          </button>
        </div>
        <div className="flex-1 px-4 flex items-center">
          {thucHien?.map((m, index) => (
            <div
              key={index}
              className={clsx(
                "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                BGS[index % BGS?.length]
              )}
            >
              <EmployeeInfo employee={m} />
            </div>
          ))}
          <button
            onClick={() => {
              alert("assign");
            }}
            className="rounded-full border-2 border-dashed size-fit p-1 ml-2 border-gray-400 text-gray-400"
          >
            <BiPlus />
          </button>
        </div>
        <div className="flex-1 px-4 ">
          <Selection items={stages} selectedItem={congviec.trangThaiCongViec} />
        </div>

        <div className="flex-1 px-4 flex flex-wrap justify-end items-center gap-2">
          {permissionAction.includes("Thêm") && (
            <Button
              onClick={() => {
                setTaskRoot(congviec.maCongViec);
                setOpen(true);
              }}
              icon={<IoMdAdd className="text-lg" />}
              className="flex flex-row-reverse items-center bg-blue-600 text-white rounded-md py-0.5 px-1.5 text-xs h-8 gap-0.5" // Giảm padding và xác định chiều cao
            />
          )}
          {permissionAction.includes("Sửa") && (
            <Button
              onClick={() => {
                setOpenUpdate(true);
              }}
              icon={<IoMdCreate className="text-lg" />}
              className="flex flex-row-reverse items-center bg-blue-600 text-white rounded-md py-0.5 px-1.5 text-xs h-8 gap-0.5" // Giảm padding và xác định chiều cao
            />
          )}
          {permissionAction.includes("Xóa") && (
            <Button
              onClick={() => {}}
              icon={<IoMdTrash className="text-lg" />}
              className="flex flex-row-reverse items-center bg-blue-600 text-white rounded-md py-0.5 px-1.5 text-xs h-8 gap-0.5" // Giảm padding và xác định chiều cao
            />
          )}
          {permissionAction.includes("Sửa") && (
            <Button
              onClick={() => {
                setOpenTransfer(true);
              }}
              icon={<IoMdSwap className="text-lg" />}
              className="flex flex-row-reverse items-center bg-blue-600 text-white rounded-md py-0.5 px-1.5 text-xs h-8 gap-0.5" // Giảm padding và xác định chiều cao
            />
          )}
          <Button
            onClick={() => {
              setOpenTaskHistory(true);
            }}
            icon={<IoMdTime className="text-lg" />}
            className="flex flex-row-reverse items-center bg-blue-600 text-white rounded-md py-0.5 px-1.5 text-xs h-8 gap-0.5" // Giảm padding và xác định chiều cao
          />
        </div>
      </div>
      <AddTask
        open={open}
        setOpen={setOpen}
        phanDuAn={congviec.maPhanDuAn}
        duAn={duAn}
        congViecCha={taskRoot}
      />
      <UpdateTask
        openUpdate={openUpdate}
        setOpenUpdate={setOpenUpdate}
        phanDuAn={congviec.maPhanDuAn}
        duAn={duAn}
        maCongViec={congviec.maCongViec}
        task={congviec}
        phanCong={phancong}
      />
      <AddTaskTransfer
        openTransfer={openTransfer}
        setOpenTransfer={setOpenTransfer}
        maCongViec={maCongViec}
        tenCongViec={congviec.tenCongViec}
        maPhongBan={null}
        currentEmployee={phancong?.phanCongs}
      />
      <TaskHistory
        openTaskHistory={openTaskHistory}
        setOpenTaskHistory={setOpenTaskHistory}
        maCongViec={maCongViec}
      />
      {expanded && (
        <DetailTask
          expanded={expanded}
          setExpanded={setExpanded}
          task={congviec}
          titleTask={congviec.tenCongViec}
          date={formatDate(new Date(congviec.thoiGianKetThuc))}
          roleTeam={chiuTrachNhiem}
          userTeam={thucHien}
        />
      )}
    </div>
  );
};
export default TaskListItem;
