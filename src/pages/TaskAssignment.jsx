import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAssignments,
  fetchEmployeeAssignment,
} from "../redux/assignment/assignmentSlice";
import TaskAssignmentList from "../components/taskassigment/TaskAssignmentList";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useNavigate } from "react-router-dom";
import API_ENDPOINTS from "../constant/linkapi";
const TaskAssignment = () => {
  const [connection, setConnection] = useState(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const maNhanVien = Number(localStorage.getItem("userId"));
  const phancongs = useSelector((state) => state.assignments);
  const navigate=useNavigate()
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);   
      await dispatch(fetchEmployeeAssignment(maNhanVien));
      setLoading(false);
    };
    loadData();
  }, [maNhanVien, dispatch]);
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
            await dispatch(fetchEmployeeAssignment(maNhanVien));
            setLoading(false);
          });
          connection.on("task", async (message) => {
            alert(message);
          });
        } catch (err) {
          console.error("Error while starting connection: ", err);
        }
      }
    };
    startConnection();
    return () => {
      if (connection) {
        //connection.off("task");
        connection.off("loadPhanCong");
        connection.off("loadCongViec");
        connection.stop()
      }
    };
  }, [connection, dispatch, maNhanVien]);
  return (
    <div className="w-full bg-transparent">
      <div className="text-lg bg-transparent">
        <div className="w-full flex border-y-2 py-2 px-4 font-bold bg-white shadow-sm text-sm mb-4">
          <div className="flex-1 px-2">Công Việc</div>
          <div className="flex-1 px-2">Mức Độ Ưu Tiên</div>
          <div className="flex-1 px-2">Bắt Đầu</div>
          <div className="flex-1 px-2">Kết Thúc</div>
          <div className="flex-1 px-2">Chịu Trách Nhiệm</div>
          <div className="flex-1 px-2">Nhóm</div>
          <div className="flex-1 px-2">Trình Trạng</div>
          <div className="flex-1 px-2">File</div>
        </div>
        <div className="bg-slate-50 rounded-md shadow-md">
          {phancongs.list.map((item, index) => (
            <TaskAssignmentList congviec={item} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default TaskAssignment;
