import { useDispatch, useSelector } from "react-redux";
import DepartmentAssignmentList from "../components/taskassigment/DepartmentAssignmentList";
import { fetchManagerDepartment } from "../redux/departments/departmentSlice";
import { useEffect, useState } from "react";
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import API_ENDPOINTS from "../constant/linkapi";
const DepartmentAssignment=()=>{
    const [loading, setLoading] = useState(true);
    const [connection, setConnection] = useState(null);
    const dispatch=useDispatch();
    const maNhanVien=Number(localStorage.getItem("userId"));
    //const maNhanVien=3
    const phongbans=useSelector((state)=>state.departments)
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await dispatch(fetchManagerDepartment(maNhanVien));
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
                await dispatch(fetchManagerDepartment(maNhanVien));
                setLoading(false);
              });
              connection.on("loadCongViec", async () => {
                setLoading(true);
                await dispatch(fetchManagerDepartment(maNhanVien));
                setLoading(false);
              });
              connection.on("loadDuAn", async () => {
                setLoading(true);
                await dispatch(fetchManagerDepartment(maNhanVien));
                setLoading(false);
              });
              connection.on("updateCongViec", async () => {
                setLoading(true);
                await dispatch(fetchManagerDepartment(maNhanVien));
                setLoading(false);
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
            connection.off("loadPhanCong");
          }
        };
      }, [connection, dispatch, maNhanVien]);
    if (loading) {
        return (
            <div className="flex justify-center items-center h-24">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }
    if (!phongbans) {
        return <p>not found</p>
    }
    return(<div className="w-full bg-transparent">
        <div className="text-lg bg-transparent">
            <div className="w-full flex border-y-2 py-2 px-4 font-bold -mb-2 bg-white shadow-sm text-sm">
                <div className="flex-1 w-2/12 px-4 ">Công Việc</div>
                <div className="flex-1 w-2/12 border-l px-4 ">Mô Tả</div>
                <div className="flex-1 w-1/12 border-l px-4 ">Mức Độ Ưu Tiên</div>
                <div className="flex-1 w-1/12 border-l px-4 ">Bắt Đầu</div>
                <div className="flex-1 w-1/12 border-l px-4 ">Kết Thúc</div>
                <div className="flex-1 w-2/12 border-l px-4 ">Chịu Trách Nhiệm</div>
                <div className="flex-1 w-2/12 border-l px-4 ">Nhóm</div>

            </div>
            <div className="w-full bg-transparent border-b-1">
                <div className="p-4 w-full flex items-center justify-between font-semibold bg-white text-gray-600 mb-2 mt-4 shadow-sm border-y text-sm"></div>
                {<DepartmentAssignmentList phongban={phongbans.list[0]}/>}
            </div>
        </div>
    </div>)
}
export default DepartmentAssignment;