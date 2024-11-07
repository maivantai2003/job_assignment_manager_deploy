import React, { useEffect, useState } from "react";
import { FaList } from "react-icons/fa";
import { MdGridView } from "react-icons/md";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loader";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd, IoMdClock } from "react-icons/io";
import Tabs from "../components/Tabs";
import TaskTitle from "../components/TaskTitle";
import BoardView from "../components/BoardView";
import { tasks } from "../assets/data";
import Table from "../components/task/Table";
import AddTask from "../components/task/AddTask";
import ListView from "../components/task/ListView";
import { useDispatch, useSelector } from "react-redux";
import { fetchByIdProject} from "../redux/project/projectSlice";
import AddSection from "../components/section/AddSection";
import { HubConnectionBuilder,LogLevel } from '@microsoft/signalr';
import Timeline from "../components/task/TimeLine";
import ModalWrapper from "../components/ModalWrapper";
import { checkPermission } from "../redux/permissiondetail/permissionDetailSlice";
import API_ENDPOINTS from "../constant/linkapi";
const TABS = [
  { title: "Chế độ danh sách", icon: <MdGridView /> },
  { title: "Chế độ bảng", icon: <FaList /> },  
];
const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

const Tasks = () => {
  const {id} = useParams();
  const dispatch=useDispatch()
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState([]);
  const [connection, setConnection] = useState(null);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showRemider,setShowRemider]=useState(false)
  const [timelineModalOpen, setTimelineModalOpen] = useState(false);
  const maquyen=Number(localStorage.getItem("permissionId"))
  const [permissionAction,setpermissionAction]=useState([])
  const duan=useSelector((state) =>
    state.projects.list.find((project) => project.maDuAn === Number(id))
  );
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (id) await dispatch(fetchByIdProject(id));
        const result=await dispatch(checkPermission({maQuyen:maquyen,tenChucNang:"Phần Dự Án"})).unwrap()
        setpermissionAction(result)
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, dispatch]);
  useEffect(()=>{
    const newConnection = new HubConnectionBuilder()
      .withUrl(API_ENDPOINTS.HUB_URL).withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    setConnection(newConnection);
  },[])
  useEffect(() => {
    if (connection && connection.state === "Disconnected") {
      connection.start()
        .then(() => {
          console.log("Connected!");
          connection.on("loadDuAn", () => {
            if (id) {
              dispatch(fetchByIdProject(id));
              console.log("Dự Án: "+id)
            }
          });
          connection.on("loadCongViec", () => {
            if (id) {
              dispatch(fetchByIdProject(id));
            }
          });
          connection.on("loadPhanCong", () => {
            if (id) {
              dispatch(fetchByIdProject(id));
            }
          });
          connection.on("updateCongViec", () => {
            if (id) {
              dispatch(fetchByIdProject(id));
              console.log("Dự Án: "+id)
            }
          });
          connection.on("loadHanhDong",async () => {
            const result = await dispatch(checkPermission({ maQuyen: maquyen, tenChucNang: "Phần Dự Án" })).unwrap();
            setpermissionAction(result);
          });
        })
        .catch((error) => console.error("Connection failed: ", error));
        return () => {
          if (connection) {
            connection.off("loadDuAn");
            connection.off("loadCongViec")
            connection.off("loadPhanCong")
            connection.off("updateCongViec");
            connection.off("loadHanhDong");
          }
        };
    }
  }, [connection, id, dispatch]);
  const status = id || ""; 
  const toggleTimelineModal = () => {
    navigate("/gant",{state:{duan}});
  };
  return loading ? (
    <div className='py-10'>
      <Loading />
    </div>
  ) : (
    <div className='w-full'>
      <div className='flex items-center justify-between mb-4'>
        <Title title={status ? `Trạng thái công việc` : "Các công việc"} />

        {status && (
          <div className="flex gap-4">
            {permissionAction.includes("Thêm") && 
            <Button
              onClick={() => setOpen(true)}
              label="Tạo phần dự án"
              icon={<IoMdAdd className="text-lg" />}
              className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5"
            />
            }
            {permissionAction.includes("Thêm") && 
            <Button
              onClick={() => setOpen(true)}
              label="Tạo nhắc hẹn"
              icon={<IoMdClock className="text-lg" />}
              className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5"
            />
            }
            <Button
              onClick={toggleTimelineModal} 
              label="Sơ đồ gant"
              icon={<IoMdAdd className="text-lg" />}
              className="flex flex-row-reverse gap-1 items-center bg-green-600 text-white rounded-md py-2 2xl:py-2.5"
            />
          </div>
        )}
      </div>

      <Tabs tabs={TABS} setSelected={setSelected}>
        {selected !== 0 ? (
          <BoardView tasks={tasks} />
        ) : (
          // <ListView phanDuAn={duan.phanDuAn} duAn={id}/>
          duan ? (
            <ListView phanDuAn={duan.phanDuAn} duAn={id} />
          ) : (
            <div>Không có dữ liệu</div>
          )
        )}
      </Tabs>
      {/* <AddTask open={open} setOpen={setOpen} /> */}
      <AddSection open={open} setOpen={setOpen} duAn={id}></AddSection>
      {/* {showTimeline && <Timeline />} */}
      <ModalWrapper open={timelineModalOpen} setOpen={setTimelineModalOpen}>
      <div className="w-full max-w-6xl h-full max-h-[80vh] bg-white rounded-lg p-4">
    <h2 className="text-lg font-semibold mb-4">Timeline Dự án</h2>
    <Timeline/>
  </div>
      </ModalWrapper>
    </div>
  );
};

export default Tasks;
