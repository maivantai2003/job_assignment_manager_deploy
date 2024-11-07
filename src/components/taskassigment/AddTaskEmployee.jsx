import React, { useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import { useForm } from "react-hook-form";
import Button from "../Button";
import { useDispatch } from "react-redux";
import EmployeeSelectDepartment from "./EmployeeSelectDepartment";
import { addAssignment } from "../../redux/assignment/assignmentSlice";
import { addTaskHistory } from "../../redux/taskhistory/taskhistorySlice";
const LISTS = ["CAO", "TRUNG BÌNH", "BÌNH THƯỜNG", "THẤP"];
const PRIORITY = ["CAO", "TRUNG BÌNH", "BÌNH THƯỜNG", "THẤP"];
const uploadedFileURLs = [];
const AddTaskEmployee = ({ open, setOpen,maCongViec,maPhongBan,tenCongViec}) => {
  const task = "";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [team, setTeam] = useState(task?.team || []);
  const dispatch=useDispatch();
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [stage, setStage] = useState(task?.stage?.toUpperCase() || LISTS[0]);
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);
  const submitHandler =async (data) => {
    try{
      //await dispatch(fetchByIdProject(Number(duAn)))
      if(Array.isArray(selectedEmployees) && selectedEmployees.length > 0){
        const employeePromises = selectedEmployees.map(async (employee) => {
            console.log({
                maCongViec: maCongViec,
                maNhanVien: Number(employee.maNhanVien),
                vaiTro: employee.vaiTro,
              })
            await dispatch(addAssignment({
              maCongViec: maCongViec,
              maNhanVien: Number(employee.maNhanVien),
              vaiTro: employee.vaiTro,
            }));
            await dispatch(addTaskHistory({
              maCongViec:maCongViec,
              ngayCapNhat:new Date().toISOString(),
              noiDung:`${new Date().toISOString()}: Nhân Viên ${employee.tenNhanVien} được phân công việc ${tenCongViec}`
            }))
            // await dispatch(sendGmail({
            //   name: employee.tenNhanVien,
            //   toGmail: employee.email,
            //   subject: "Thông Tin Phân Công Dự Án",
            //   body: generateEmailTemplate(employee)
            // }));
          });
          await Promise.all(employeePromises);
      }
      setOpen(false)
    }catch(e){
      console.log(e)
    }
  };
  const handleSelect = (e) => {
    setAssets(e.target.files);
  };
  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <div className="max-h-screen overflow-y-auto">
        <form onSubmit={handleSubmit(submitHandler)}>
          <Dialog.Title
            as='h2'
            className='text-base font-bold leading-6 text-gray-900 mb-4'
          >
            THÊM PHÂN CÔNG NHÂN VIÊN
          </Dialog.Title>
          <div className='mt-2 flex flex-col gap-6'>
            <EmployeeSelectDepartment maPhongBan={maPhongBan}
            selectedEmployees={selectedEmployees}
            setSelectedEmployees={setSelectedEmployees}
          />
            <div className='bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4'>
              {uploading ? (
                <span className='text-sm py-2 text-red-500'>
                  Đang tải tài liệu
                </span>
              ) : (
                <Button
                  label='Gửi'
                  type='submit'
                  className='bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto'
                />
              )}

              <Button
                type='button'
                className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto'
                onClick={() => setOpen(false)}
                label='Hủy'
              />
            </div>
          </div>
        </form>
        </div>
      </ModalWrapper>
    </>
  );
};
const generateEmailTemplate = (employee) => {
  return `
    <html>
        <head>
            <style>
                .email-container {
                    font-family: Arial, sans-serif;
                    line-height: 1.5;
                    background-color: #f4f4f4;
                    padding: 20px;
                    border-radius: 10px;
                }
                .email-header {
                    font-size: 20px;
                    font-weight: bold;
                    color: #2e86c1;
                }
                .email-body {
                    margin-top: 20px;
                    color: #333;
                    font-size: 16px;
                }
                p {
                    margin: 10px 0;
                }
                .highlight {
                    color: #d35400;
                    font-weight: bold;
                }
                .footer {
                    margin-top: 30px;
                    font-size: 14px;
                    color: #888;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">Xin chào ${employee.tenNhanVien},</div>
                <div class="email-body">
                    <p>Bạn đã được chọn để tham gia dự án với vai trò: <span class="highlight">${employee.vaiTro}</span></p>
                    <p>Vui lòng kiểm tra lại chi tiết trong hệ thống quản lý công việc của chúng tôi.</p>
                    <p>Trân trọng,</p>
                    <p>Đội ngũ quản lý dự án</p>
                </div>
                <div class="footer">
                    <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email support@company.com.</p>
                </div>
            </div>
        </body>
    </html>
  `;
};
export default AddTaskEmployee;
