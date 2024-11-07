import clsx from "clsx";
import React, { useState } from "react";
import {
  MdDelete,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineRestore,
} from "react-icons/md";
import { tasks } from "../assets/data";
import Title from "../components/Title";
import Button from "../components/Button";
import { PRIOTITYSTYELS, TASK_TYPE } from "../utils";
import AddUser from "../components/AddUser";
import ConfirmatioDialog from "../components/Dialogs";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Trash = () => {
  const [openDialog, setOpenDialog] = useState(false); // Quản lý trạng thái hộp thoại xác nhận
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState(null); // Thông điệp cho hộp thoại xác nhận
  const [type, setType] = useState("delete"); // Loại hành động (xóa hoặc khôi phục)
  const [selected, setSelected] = useState(""); // Mục đã chọn

  // Hàm xử lý xóa tất cả mục
  const deleteAllClick = () => {
    setType("deleteAll");
    setMsg("Bạn có muốn xóa vĩnh viễn tất cả mục không?"); // Thông báo xác nhận
    setOpenDialog(true); // Mở hộp thoại xác nhận
  };

  // Hàm xử lý khôi phục tất cả mục
  const restoreAllClick = () => {
    setType("restoreAll");
    setMsg("Bạn có muốn khôi phục tất cả mục trong thùng rác không?"); // Thông báo xác nhận
    setOpenDialog(true);
  };

  // Hàm xử lý xóa một mục
  const deleteClick = (id) => {
    setType("delete");
    setSelected(id); // Lưu ID của mục được chọn
    setOpenDialog(true); // Mở hộp thoại xác nhận
  };

  // Hàm xử lý khôi phục một mục
  const restoreClick = (id) => {
    setSelected(id);
    setType("restore");
    setMsg("Bạn có muốn khôi phục mục đã chọn không?"); // Thông báo xác nhận
    setOpenDialog(true);
  };

  // Header của bảng
  const TableHeader = () => (
    <thead className='border-b border-gray-300'>
      <tr className='text-black text-left'>
        <th className='py-2'>Tiêu đề công việc</th>
        <th className='py-2'>Ưu tiên</th>
        <th className='py-2'>Giai đoạn</th>
        <th className='py-2 line-clamp-1'>Đã sửa đổi vào</th>
      </tr>
    </thead>
  );

  // Dòng trong bảng
  const TableRow = ({ item }) => (
    <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'>
      <td className='py-2'>
        <div className='flex items-center gap-2'>
          <div
            className={clsx("w-4 h-4 rounded-full", TASK_TYPE[item.stage])}
          />
          <p className='w-full line-clamp-2 text-base text-black'>
            {item?.title} {/* Tiêu đề công việc */}
          </p>
        </div>
      </td>

      <td className='py-2 capitalize'>
        <div className={"flex gap-1 items-center"}>
          <span className={clsx("text-lg", PRIOTITYSTYELS[item?.priority])}>
            {ICONS[item?.priority]} {/* Biểu tượng ưu tiên */}
          </span>
          <span>{item?.priority}</span> {/* Mức ưu tiên */}
        </div>
      </td>

      <td className='py-2 capitalize text-center md:text-start'>
        {item?.stage} {/* Giai đoạn công việc */}
      </td>
      <td className='py-2 text-sm'>{new Date(item?.date).toDateString()}</td> {/* Ngày đã sửa đổi */}

      <td className='py-2 flex gap-1 justify-end'>
        <Button
          icon={<MdOutlineRestore className='text-xl text-gray-500' />}
          onClick={() => restoreClick(item._id)} // Khôi phục mục
        />
        <Button
          icon={<MdDelete className='text-xl text-red-600' />}
          onClick={() => deleteClick(item._id)} // Xóa mục
        />
      </td>
    </tr>
  );

  return (
    <>
      <div className='w-full md:px-1 px-0 mb-6'>
        <div className='flex items-center justify-between mb-8'>
          <Title title='Công việc đã xóa' /> {/* Tiêu đề của trang */}

          <div className='flex gap-2 md:gap-4 items-center'>
            <Button
              label='Khôi phục tất cả'
              icon={<MdOutlineRestore className='text-lg hidden md:flex' />}
              className='flex flex-row-reverse gap-1 items-center text-black text-sm md:text-base rounded-md 2xl:py-2.5'
              onClick={() => restoreAllClick()} // Khôi phục tất cả
            />
            <Button
              label='Xóa tất cả'
              icon={<MdDelete className='text-lg hidden md:flex' />}
              className='flex flex-row-reverse gap-1 items-center text-red-600 text-sm md:text-base rounded-md 2xl:py-2.5'
              onClick={() => deleteAllClick()} // Xóa tất cả
            />
          </div>
        </div>
        <div className='bg-white px-2 md:px-6 py-4 shadow-md rounded'>
          <div className='overflow-x-auto'>
            <table className='w-full mb-5'>
              <TableHeader /> {/* Header của bảng */}
              <tbody>
                {tasks?.map((tk, id) => (
                  <TableRow key={id} item={tk} /> // Hiển thị các dòng của bảng
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Thao tác thêm người dùng (đã bị tắt) */}
      {/* <AddUser open={open} setOpen={setOpen} /> */}

      <ConfirmatioDialog
        open={openDialog} // Trạng thái mở của hộp thoại xác nhận
        setOpen={setOpenDialog} // Hàm để thay đổi trạng thái
        msg={msg} // Thông điệp hiển thị trong hộp thoại
        setMsg={setMsg} // Hàm để thay đổi thông điệp
        type={type} // Loại hành động (xóa hoặc khôi phục)
        setType={setType} // Hàm để thay đổi loại hành động
        onClick={() => deleteRestoreHandler()} // Hàm xử lý khi nhấn nút trong hộp thoại
      />
    </>
  );
};

export default Trash;
