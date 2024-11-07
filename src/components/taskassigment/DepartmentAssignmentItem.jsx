import { useEffect, useState } from "react";
import { BiCalendar, BiCheck, BiPlus } from "react-icons/bi";
import clsx from "clsx";
import EmployeeInfo from "../EmployeeInfo";
import Button from "../Button";
import { useDispatch, useSelector } from "react-redux";
import { fetchByIdTask } from "../../redux/task/taskSlice";
import DetailTask from "../task/DetailTask";
import { BGS, formatDate } from "../../utils";
import { updateAssignment } from "../../redux/assignment/assignmentSlice";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { IoMdAdd } from "react-icons/io";
import AddTaskEmployee from "./AddTaskEmployee";
import { useNavigate } from "react-router-dom";
import { checkPermission } from "../../redux/permissiondetail/permissionDetailSlice";
import API_ENDPOINTS from "../../constant/linkapi";
const DepartmentAssignmentItem = ({ congViecPhongBan }) => {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [connection, setConnection] = useState(null);
  const [permissionAction, setpermissionAction] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const maCongViec = congViecPhongBan.maCongViec;
  const maquyen=Number(localStorage.getItem("permissionId"))
  const vaiTro = congViecPhongBan.vaiTro;
  const maPhanCong = congViecPhongBan.maPhanCong;
  const maPhongBan = congViecPhongBan.maPhongBan;
  const congviec = useSelector((state) =>
    state.tasks.list.find((task) => task.maCongViec === maCongViec)
  );
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await dispatch(fetchByIdTask(maCongViec));
        const result = await dispatch(
          checkPermission({ maQuyen: maquyen, tenChucNang: "Công Việc Phòng Ban" })
        ).unwrap();
        setpermissionAction(result);
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
          connection.on("loadPhanCong", async () => {
            setLoading(true);
            await dispatch(fetchByIdTask(maCongViec));
            setLoading(false);
          });
          connection.on("loadHanhDong", async () => {
            const result = await dispatch(
              checkPermission({ maQuyen: 3, tenChucNang: "Công Việc" })
            ).unwrap();
            setpermissionAction(result);
          
          });
          //   connection.on("loadCongViec", async () => {
          //     setLoading(true);
          //     await dispatch(fetchByIdTask(maCongViec));
          //     setLoading(false);
          //   });
          //   connection.on("updateCongViec", async () => {
          //     setLoading(true);
          //     await dispatch(fetchByIdTask(maCongViec));
          //     setLoading(false);
          //   });
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
        connection.off("loadPhanCong");
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
  if (!congviec) {
    return <p>not found</p>;
  }

  const handleToggleDetail = () => {
    setExpanded(!expanded);
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
  const chiuTrachNhiem = congviec?.phanCongs?.filter(
    (m) => m.vaiTro === "Người Chịu Trách Nhiệm"
  );
  const thucHien = congviec?.phanCongs?.filter(
    (m) => m.vaiTro === "Người Thực Hiện"
  );
  const congViecHoanThanh =
    congviec?.phanCongs?.filter((task) => task.trangThaiCongViec === true)
      .length ?? 0;
  const tongCongViec = congviec?.phanCongs?.length || 1;
  const completionPercent = (congViecHoanThanh / tongCongViec) * 100;
  return (
    <div className="w-full flex items-center  px-4">
      <div className="w-full flex py-2 border-b text-sm">
        <div
          className="flex-1 w-1/4 px-4 truncate cursor-pointer"
          onClick={handleToggleDetail}
        >
          {congviec.maCongViecCha ? (
            <span className="text-gray-500 break-words">
              🔹 {congviec.tenCongViec}
            </span>
          ) : (
            <span className="break-words">{congviec.tenCongViec}</span>
          )}
          {/* Phần trăm tiến độ */}

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
          <span>{congviec.moTa}</span>
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
            {congviec.thoiGianBatDau ? (
              formatDate(new Date(congviec.thoiGianBatDau))
            ) : (
              <div className="p-1 w-fit border-2 border-dashed rounded-full border-gray-400">
                <BiCalendar size={20} />
              </div>
            )}
          </button>
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
        <div className="flex-1 px-4 flex items-center flex-wrap">
          {chiuTrachNhiem?.map((m, index) => (
            <div
              key={index}
              className={clsx(
                "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm mr-1 mb-2",
                BGS[index % BGS?.length]
              )}
            >
              {/* <UserInfo user={m} /> */}
              <EmployeeInfo employee={m} />
            </div>
          ))}
        </div>
        <div className="flex-1 px-4 flex items-center flex-wrap">
          {thucHien?.map((m, index) => (
            <div
              key={index}
              className={clsx(
                "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm mr-1 mb-2",
                BGS[index % BGS?.length]
              )}
            >
              <EmployeeInfo employee={m} />
            </div>
          ))}
           {permissionAction.includes("Thêm") && 
          <button
            onClick={() => {
              setOpen(true);
            }}
            className="rounded-full border-2 border-dashed size-fit p-1 ml-2 border-gray-400 text-gray-400"
          >
            <BiPlus />
          </button>}
        </div>
      </div>
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
      <AddTaskEmployee
        open={open}
        setOpen={setOpen}
        maCongViec={congviec.maCongViec}
        maPhongBan={maPhongBan}
        tenCongViec={congviec.tenCongViec}
      />
    </div>
  );
};

export default DepartmentAssignmentItem;
