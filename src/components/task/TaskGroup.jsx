import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../Button";
import AddTask from "./AddTask";
import TaskListItem from "./TaskListItem";
import { HubConnectionBuilder,LogLevel } from '@microsoft/signalr';
import { useDispatch } from "react-redux";
import { checkPermission } from "../../redux/permissiondetail/permissionDetailSlice";
import API_ENDPOINTS from "../../constant/linkapi";

const TaskGroup = ({ phanduan, duAn }) => {
  const [open, setOpen] = useState(false);
  const [connection, setConnection] = useState(null);
  const [taskRoot, setTaskRoot] = useState(false);
  const [permissionAction,setpermissionAction]=useState([])
  const maquyen=Number(localStorage.getItem("permissionId"))
  const dispatch=useDispatch();
  const { id } = useParams();
  useEffect(()=>{
    const fetchData=async ()=>{
      const result=await dispatch(checkPermission({maQuyen:maquyen,tenChucNang:"Công Việc"})).unwrap()
      setpermissionAction(result)
    }
    fetchData();
  },[dispatch])
  useEffect(()=>{
    const newConnection = new HubConnectionBuilder()
      .withUrl(API_ENDPOINTS.HUB_URL).withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    setConnection(newConnection);
  },[])
  useEffect(()=>{
    if (connection && connection.state === "Disconnected") {
        connection.start()
          .then(() => {
            console.log("Connected!");
            connection.on("loadHanhDong",async () => {
              const result = await dispatch(checkPermission({ maQuyen: maquyen, tenChucNang: "Công Việc" })).unwrap();
              setpermissionAction(result);
            });
          })
          .catch((error) => console.error("Connection failed: ", error));
      }
      return () => {
        if (connection) {
          connection.off("loadHanhDong");
        }
      };
  },[dispatch,connection])
  const groupedTasks = (phanduan.congViecs || []).reduce((acc, task) => {
    const parentId = task.maCongViecCha || 'root'; 
    if (!acc[parentId]) {
      acc[parentId] = [];
    }
    acc[parentId].push(task);
    return acc;
  }, {});

  const renderTasks = (tasks, duAn) => {
    return tasks.map((task) => (
      <div key={task.maCongViec}>
        <TaskListItem duAn={duAn} congviec={task} />
        {groupedTasks[task.maCongViec] && groupedTasks[task.maCongViec].length > 0 && (
          <div className="ml-6">
            {renderTasks(groupedTasks[task.maCongViec], duAn)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="w-full bg-transparent border-b-1">
      <div className="p-4 w-full flex items-center justify-between font-semibold bg-white text-gray-600 mb-2 mt-4 shadow-sm border-y text-sm">
        <span>{phanduan.tenPhan}</span>
        {permissionAction.includes("Thêm") &&
        <Button
          onClick={() => setOpen(true)}
          label="Tạo công việc"
          className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 px-3 text-xs"
        />}
      </div>
      
      <div className="bg-slate-50 shadow-md">
        {groupedTasks['root'] ? renderTasks(groupedTasks['root'], duAn) : <p>Chưa có công việc nào.</p>}
      </div>

      <AddTask open={open} setOpen={setOpen} phanDuAn={phanduan.maPhanDuAn} duAn={duAn} congViecCha={taskRoot} />
    </div>
  );
};

export default TaskGroup;
