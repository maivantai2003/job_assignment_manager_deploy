import React, { useEffect, useState } from "react";
//import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import { getInitials } from "../utils";
import clsx from "clsx";
import ConfirmatioDialog, { UserAction } from "../components/Dialogs";
import Title from "../components/Title";
import { useDispatch, useSelector } from "react-redux";
import PageSizeSelect from "../components/PageSizeSelect";
import { fetchEmployees } from "../redux/employees/employeeSlice";
import AddEmployee from "../components/employee/AddEmployee";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import UpdateEmployee from "../components/employee/UpdateEmployee";
import { checkPermission } from "../redux/permissiondetail/permissionDetailSlice";
import { useNavigate } from "react-router-dom";
import API_ENDPOINTS from "../constant/linkapi";
const Employees = () => {
  const [pageSize, setPageSize] = useState(10);
  const employees = useSelector((state) => state.employees.list);
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [selected, setSelected] = useState(null);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [connection, setConnection] = useState(null);
  const [permissionAction, setpermissionAction] = useState([]);
  const navigate=useNavigate()
  const maquyen=Number(localStorage.getItem("permissionId"))
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchEmployees({ search: "", page: pageSize }));
      const result = await dispatch(
        checkPermission({ maQuyen: maquyen, tenChucNang: "Nhân Viên" })
      ).unwrap();
      setpermissionAction(result);
     
    };
    fetchData();
  }, [dispatch, pageSize]);
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
          connection.on("loadEmployee", () => {
            dispatch(fetchEmployees({ search: "", page: pageSize }));
          });
          connection.on("loadHanhDong",async () => {
            const result = await dispatch(checkPermission({ maQuyen: maquyen, tenChucNang: "Nhân Viên" })).unwrap();
            setpermissionAction(result);
           
          });
        })
        .catch((error) => console.error("Connection failed: ", error));
    }
  }, [dispatch, pageSize, connection]);
  const employeeActionHandler = () => {};
  const deleteHandler = () => {};

  const deleteClick = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClick = (employee) => {
    setSelectedEmployee(employee);
    setOpenUpdate(true);
  };
  const TableHeader = () => (
    <thead className="border-b border-gray-300">
      <tr className="text-black text-left">
        <th className="py-2">Nhân Viên</th>
        <th className="py-2">Phòng Ban</th>
        <th className="py-2">Chức Vụ</th>
        <th className="py-2">Số Điện Thoại</th>
        <th className="py-2">Email</th>
      </tr>
    </thead>
  );
  const TableRow = ({ employee }) => (
    <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-400/10">
      <td className="p-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-blue-700">
            <span className="text-xs md:text-sm text-center">
              {employee.tenNhanVien}
            </span>
          </div>
          {employee.tenNhanVien}
        </div>
      </td>

      <td className="p-2">{employee.maPhongBan}</td>
      <td className="p-2">{employee.tenChucVu}</td>
      <td className="p-2">{employee.soDienThoai}</td>
      <td className="p-2">{employee.email}</td>
      <td>
        <button
          // onClick={() => userStatusClick(user)}
          className={clsx(
            "w-fit px-4 py-1 rounded-full",
            employee.trangThai ? "bg-blue-200" : "bg-yellow-100"
          )}
        >
          {employee?.trangThai ? "Active" : "Disabled"}
        </button>
      </td>

      <td className="p-2 flex gap-4 justify-end">
        {permissionAction.includes("Sửa") && (
          <Button
            className="text-blue-600 hover:text-blue-500 font-semibold sm:px-0"
            label="Edit"
            type="button"
            onClick={() => editClick(employee)}
          />
        )}
        {permissionAction.includes("Xóa") && (
          <Button
            className="text-red-700 hover:text-red-500 font-semibold sm:px-0"
            label="Delete"
            type="button"
            onClick={() => deleteClick(employee.maNhanVien)}
          />
        )}
      </td>
    </tr>
  );

  return (
    <>
      <PageSizeSelect pageSize={pageSize} setPageSize={setPageSize} />
      <div className="w-full md:px-1 px-0 mb-6">
        <div className="flex items-center justify-between mb-8">
          <Title title="Nhân Viên" />
          {permissionAction.includes("Thêm") && (
            <Button
              label="Thêm Nhân Viên Mới"
              icon={<IoMdAdd className="text-lg" />}
              className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md 2xl:py-2.5"
              onClick={() => setOpen(true)}
            />
          )}
        </div>

        <div className="bg-white px-2 md:px-4 py-4 shadow-md rounded">
          <div className="overflow-x-auto">
            <table className="w-full mb-5">
              <TableHeader />
              <tbody>
                {employees?.map((employee, index) => (
                  <TableRow key={index} employee={employee} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddEmployee
        open={open}
        setOpen={setOpen}
        userData={selected}
        key={new Date().getTime().toString()}
      />
      <UpdateEmployee
        open={openUpdate}
        setOpen={setOpenUpdate}
        employeeData={selectedEmployee}
      />

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <UserAction
        open={openAction}
        setOpen={setOpenAction}
        onClick={employeeActionHandler}
      />
    </>
  );
};

export default Employees;
