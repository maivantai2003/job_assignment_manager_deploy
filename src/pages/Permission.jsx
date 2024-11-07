import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import clsx from "clsx";
import ConfirmatioDialog, { UserAction } from "../components/Dialogs";
import Title from "../components/Title";
import { useDispatch, useSelector } from "react-redux";
import PageSizeSelect from "../components/PageSizeSelect";
import { fetchPermissions } from "../redux/permission/permissionSlice";
import UserPermissions from "../components/permission/UserPermissions";
import API_ENDPOINTS from "../constant/linkapi";
import { checkPermission } from "../redux/permissiondetail/permissionDetailSlice";

const Permission = () => {
  const [pageSize, setPageSize] = useState(10);
  const roles = useSelector((state) => state.permissions.list);
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [selected, setSelected] = useState(null);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedRolePermissions, setSelectedRolePermissions] = useState(null);
  const [openPermissionModal, setOpenPermissionModal] = useState(false);
  const [connection, setConnection] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [roleCode, setRoleCode] = useState("Admin");
  const [permissionAction,setpermissionAction]=useState([])
  const maquyen=Number(localStorage.getItem("permissionId"))
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchPermissions({ search: "", page: pageSize }));
      const result=await dispatch(checkPermission({maQuyen:maquyen,tenChucNang:"Phân Quyền"})).unwrap()
      setpermissionAction(result)
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
          connection.on("loadNhomQuyen", () => {
            dispatch(fetchPermissions({ search: "", page: pageSize }));
          });
          connection.on("loadHanhDong", async () => {
            const result = await dispatch(
              checkPermission({ maQuyen: maquyen, tenChucNang: "Phân Quyền" })
            ).unwrap();
            setpermissionAction(result);
            
          });
        })
        .catch((error) => console.error("Connection failed: ", error));
    }
  }, [dispatch, pageSize, connection]);
  const roleActionHandler = () => {};
  const deleteHandler = () => {};

  const deleteClick = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClick = (role) => {
    setSelectedRole(role);
    setOpenUpdate(true);
  };

  const TableHeader = () => (
    <thead className="border-b border-gray-300">
      <tr className="text-black text-left">
        <th className="py-2">Nhóm Quyền</th>
        {/* <th className='py-2'>Mô tả</th> */}
        <th className="py-2">Kích hoạt</th>
      </tr>
    </thead>
  );

  const TableRow = ({ role }) => (
    <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-400/10">
      <td className="p-2">{role.tenQuyen}</td>
      {/* <td className='p-2'>{role.moTa}</td> */}
      <td>
        <button
          className={clsx(
            "w-fit px-4 py-1 rounded-full",
            role.trangThai ? "bg-blue-200" : "bg-yellow-100"
          )}
        >
          {role?.trangThai ? "Active" : "Disabled"}
        </button>
      </td>
      <td className="p-2 flex gap-4 justify-end">
      {permissionAction.includes("Sửa") &&
        <Button
          className="text-blue-600 hover:text-blue-500 font-semibold sm:px-0"
          label="Edit"
          type="button"
          onClick={() => editClick(role)}
        />}
        {permissionAction.includes("Xóa") &&
        <Button
          className="text-red-700 hover:text-red-500 font-semibold sm:px-0"
          label="Delete"
          type="button"
          onClick={() => deleteClick(role.maQuyen)}
        />}
        <Button
          className="text-blue-700 hover:text-blue-500 font-semibold sm:px-0"
          label="Phân Quyền"
          type="button"
          onClick={() => {
            setSelectedRolePermissions(role);
            setOpenPermissionModal(true);
          }}
        />
      </td>
    </tr>
  );

  return (
    <>
      <PageSizeSelect pageSize={pageSize} setPageSize={setPageSize} />
      <div className="w-full md:px-1 px-0 mb-6">
        <div className="flex items-center justify-between mb-8">
          <Title title="Quản Lý Nhóm Quyền" />
          {permissionAction.includes("Thêm") &&
          <Button
            label="Thêm Nhóm Quyền Mới"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md 2xl:py-2.5"
            onClick={() => setOpen(true)}
          />}
        </div>

        <div className="bg-white px-2 md:px-4 py-4 shadow-md rounded">
          <div className="overflow-x-auto">
            <table className="w-full mb-5">
              <TableHeader />
              <tbody>
                {roles?.map((role, index) => (
                  <TableRow key={index} role={role} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* <AddRole
        open={open}
        setOpen={setOpen}
        userData={selected}
        key={new Date().getTime().toString()}
      />
      <UpdateRole
        open={openUpdate}
        setOpen={setOpenUpdate}
        roleData={selectedRole}
      /> */}

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />
      {openPermissionModal && (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-4xl relative">
      {/* Nút đóng modal */}
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        onClick={() => setOpenPermissionModal(false)}
      >
        ✕
      </button>
      {/* Nội dung modal */}
      <UserPermissions
        role={selectedRolePermissions}
        onClose={() => {
          setOpenPermissionModal(false);
          dispatch(fetchPermissions({ search: "", page: pageSize }));
          //dispatch(fetchPermissionById(selectedRolePermissions.maQuyen));
        }}
      />
    </div>
  </div>
)}
      <UserAction
        open={openAction}
        setOpen={setOpenAction}
        onClick={roleActionHandler}
      />
    </>
  );
};

export default Permission;
