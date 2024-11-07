import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import PageSizeSelect from "../components/PageSizeSelect";
import AddAccount from "../components/account/AddAccount";
import ConfirmatioDialog, { UserAction } from "../components/Dialogs";
import Title from "../components/Title";
import { HubConnectionBuilder,LogLevel } from '@microsoft/signalr';
import { fetchAccounts } from "../redux/accounts/accountSlice";
import { checkPermission } from "../redux/permissiondetail/permissionDetailSlice";
import { useNavigate } from "react-router-dom";
import API_ENDPOINTS from "../constant/linkapi";
const Accounts = () => {
  const [pageSize, setPageSize] = useState(10);
  const accounts = useSelector((state) => state.accounts.list);
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [connection, setConnection] = useState(null);
  const [permissionAction,setpermissionAction]=useState([])
  const maquyen=Number(localStorage.getItem("permissionId"))
  const navigate=useNavigate()
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchAccounts({ search: "", page: pageSize }));
        const result = await dispatch(checkPermission({ maQuyen: maquyen, tenChucNang: "Tài Khoản" })).unwrap();
        setpermissionAction(result);
        
      } catch (error) {
        console.error("Error fetching accounts or permissions:", error);
      }
    };
    
    fetchData();
  }, [dispatch, pageSize]);
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
            connection.on("loadTaiKhoan",async () => {
              await dispatch(fetchAccounts({ search: '', page: pageSize }));
            });
            connection.on("loadHanhDong",async () => {
              const result = await dispatch(checkPermission({ maQuyen: maquyen, tenChucNang: "Tài Khoản" })).unwrap();
              setpermissionAction(result);
             
            });
          })
          .catch((error) => console.error("Connection failed: ", error));
      }
      return () => {
        if (connection) {
          connection.off("loadTaiKhoan");
          connection.off("loadHanhDong");
        }
      };
  },[dispatch,pageSize,connection])
  const accountActionHandler = () => {};
  const deleteHandler = () => {};
  const deleteClick = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };
  const editClick = (account) => {
    setSelectedAccount(account);
    setOpenUpdate(true);
  };

  const TableHeader = () => (
    <thead className="border-b border-gray-300">
      <tr className="text-black text-left">
        <th className="py-2">Nhân Viên</th>
        <th className="py-2">Nhóm Quyền</th>
        <th className="py-2">Tên Tài Khoản</th>
        <th className="py-2">Mật Khẩu</th>
      </tr>
    </thead>
  );
  const TableRow = ({ account }) => (
    <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'>
      <td className='p-2'>
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-blue-700'>
            <span className='text-xs md:text-sm text-center'>
              {account.tenTaiKhoan}
            </span>
          </div>
          {account.maNhanVien}
        </div>
      </td>

      <td className='p-2'>{account.nhomQuyen.tenQuyen}</td>
      <td className='p-2'>{account.tenTaiKhoan}</td>
      <td className='p-2'>{account.matKhau}</td>
      {/* <td>
        <button
          // onClick={() => userStatusClick(user)}
          className={clsx(
            "w-fit px-4 py-1 rounded-full",
            account?.trangThai ? "bg-blue-200" : "bg-yellow-100"
          )}
        >
          {account?.trangThai ? "Active" : "Disabled"}
        </button>
      </td> */}
      <td className='p-2 flex gap-4 justify-end'>

        {
          permissionAction.includes("Sửa") &&
          <Button
          className='text-blue-600 hover:text-blue-500 font-semibold sm:px-0'
          label='Edit'
          type='button'
          onClick={() => editClick(account)}
        />
        }
        {
          permissionAction.includes("Xóa") &&
          <Button
          className='text-red-700 hover:text-red-500 font-semibold sm:px-0'
          label='Delete'
          type='button'
          onClick={() => deleteClick(account.maNhanVien)}
        />
        }
      </td>
    </tr>
  );
  return (
    <>
      <PageSizeSelect pageSize={pageSize} setPageSize={setPageSize} />
      <div className="w-full md:px-1 px-0 mb-6">
        <div className="flex items-center justify-between mb-8">
          <Title title="Tài Khoản" />
          {permissionAction.includes("Thêm") &&
          <Button
          label="Thêm Tài Khoản Mới"
          icon={<IoMdAdd className="text-lg" />}
          className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md 2xl:py-2.5"
          onClick={() => setOpen(true)}
        />
          }
          
        </div>

        <div className="bg-white px-2 md:px-4 py-4 shadow-md rounded">
          <div className="overflow-x-auto">
            <table className="w-full mb-5">
              <TableHeader />
              <tbody>
                {accounts?.map((account, index) => (
                  <TableRow key={index} account={account} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddAccount
        open={open}
        setOpen={setOpen}
        userData={selected}
        account={accounts}
        key={new Date().getTime().toString()}
      />

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <UserAction
        open={openUpdate}
        setOpen={setOpenUpdate}
        onClick={accountActionHandler}
      />
    </>
  );
};

export default Accounts;
