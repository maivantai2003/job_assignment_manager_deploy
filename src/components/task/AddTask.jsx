import React, { useEffect, useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import SelectList from "../SelectList";
import Button from "../Button";
import { useDispatch, useSelector } from "react-redux";
import { addTask } from "../../redux/task/taskSlice";
import { fetchByIdProject } from "../../redux/project/projectSlice";
import DepartmentSelect from "./DepartmentTask";
import EmployeeSelect from "./EmployeeTask";
import { addAssignment } from "../../redux/assignment/assignmentSlice";
import { sendGmail } from "../../redux/sendgmail/sendgmailSlice";
import { addWorkDepartment } from "../../redux/workdepartment/workdepartmentSlice";
import {
  addTaskHistory,
  fetchTaskHistories,
} from "../../redux/taskhistory/taskhistorySlice";
import { sendNotification } from "../../redux/scheduling/schedulingSlice";
const LISTS = ["CAO", "TRUNG BÌNH", "BÌNH THƯỜNG", "THẤP"];
const PRIORITY = ["CAO", "TRUNG BÌNH", "BÌNH THƯỜNG", "THẤP"];

const uploadedFileURLs = [];

const AddTask = ({ open, setOpen, phanDuAn, congViecCha, duAn }) => {
  const task = "";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [team, setTeam] = useState(task?.team || []);
  const dispatch = useDispatch();
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [stage, setStage] = useState(task?.stage?.toUpperCase() || LISTS[0]);
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [priority, setPriority] = useState(
    task?.priority?.toUpperCase() || PRIORITY[2]
  );
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);
  const lichSuCongViec = useSelector((state) => state.taskhistories.list);
  const submitHandler = async (data) => {
    console.log(congViecCha, duAn);
    let CongViec = {
      maPhanDuAn: Number(phanDuAn),
      maCongViecCha: congViecCha === false ? null : congViecCha,
      tenCongViec: data.tenCongViec,
      moTa: data.moTa,
      mucDoUuTien: stage,
      thoiGianKetThuc: data.thoiGianKetThuc,
      trangThaiCongViec: false,
      mucDoHoanThanh: 0,
    };
    console.log(selectedEmployees);
    console.log(selectedDepartment);
    console.log(CongViec.tenCongViec);
    try {
      const result = await dispatch(addTask(CongViec)).unwrap();
      if (Array.isArray(selectedDepartment) && selectedDepartment.length > 0) {
        const departmentPromises = selectedDepartment.map(
          async (department) => {
            await dispatch(
              addAssignment({
                maCongViec: result.maCongViec,
                maNhanVien: Number(department.maTruongPhong),
                vaiTro: "Người Chịu Trách Nhiệm",
              })
            );
            await dispatch(
              addWorkDepartment({
                maCongViec: result.maCongViec,
                maPhongBan: Number(department.maPhongBan),
              })
            );
            await dispatch(
              addTaskHistory({
                maCongViec: result.maCongViec,
                ngayCapNhat: new Date().toISOString(),
                noiDung: `${new Date().toISOString()}: Phòng ban ${
                  department.tenPhongBan
                } phân công thực hiện công việc ${
                  CongViec.tenCongViec
                } do trưởng phòng ${
                  department.responsiblePerson
                } chịu trách nhiệm`,
              })
            );
            await dispatch(
              sendGmail({
                name: department.responsiblePerson,
                toGmail: department.email,
                subject: "Thông Tin Phân Công Dự Án",
                body: generateEmailTemplateForManager(department, CongViec),
              })
            );
          }
        );
        await Promise.all(departmentPromises);
        await dispatch(
          sendNotification({
            maCongViec: 1,
            tenCongViec: CongViec.tenCongViec,
            noiDung: generateDeadlineNotification(CongViec.tenCongViec, CongViec.thoiGianKetThuc),
            thoiGianKetThuc: CongViec.thoiGianKetThuc,
            email:selectedDepartment.map(item=>item.email).join(","),
          })
        );
      }
      if (Array.isArray(selectedEmployees) && selectedEmployees.length > 0) {
        const employeePromises = selectedEmployees.map(async (employee) => {
          await dispatch(
            addAssignment({
              maCongViec: result.maCongViec,
              maNhanVien: Number(employee.maNhanVien),
              vaiTro: employee.vaiTro,
            })
          );
          await dispatch(
            addTaskHistory({
              maCongViec: result.maCongViec,
              ngayCapNhat: new Date().toISOString(),
              noiDung: `${new Date().toISOString()}: Nhân viên ${
                employee.tenNhanVien
              } được phân công vào công việc ${
                CongViec.tenCongViec
              } với vai trò ${employee.vaiTro}`,
            })
          );
          await dispatch(
            sendGmail({
              name: employee.tenNhanVien,
              toGmail: employee.email,
              subject: "Thông Tin Phân Công Dự Án",
              body: generateEmailTemplate(employee, CongViec),
            })
          );
        });
        await Promise.all(employeePromises);
        await dispatch(
          sendNotification({
            maCongViec: 1,
            tenCongViec: CongViec.tenCongViec,
            noiDung: generateDeadlineNotification(CongViec.tenCongViec, CongViec.thoiGianKetThuc),
            thoiGianKetThuc: CongViec.thoiGianKetThuc,
            email:selectedEmployees.map(item=>item.email).join(","),
          })
        );
      }
      await dispatch(fetchByIdProject(Number(duAn)));
      setOpen(false);
    } catch (e) {
      console.log(e);
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
              as="h2"
              className="text-base font-bold leading-6 text-gray-900 mb-4"
            >
              THÊM CÔNG VIỆC
            </Dialog.Title>

            <div className="mt-2 flex flex-col gap-6">
              <Textbox
                placeholder="Tên công việc"
                type="text"
                name="title"
                label="Tên công việc"
                className="w-full rounded"
                register={register("tenCongViec", {
                  required: "Tên công việc là bắt buộc",
                })}
                error={errors.tenCongViec ? errors.tenCongViec.message : ""}
              />
              <Textbox
                placeholder="Mô tả"
                type="text"
                name="title"
                label="Mô tả"
                className="w-full rounded"
                register={register("moTa", {
                  required: "Mô tả công việc là bắt buộc",
                })}
                error={errors.moTa ? errors.moTa.message : ""}
              />

              {/* <UserList setTeam={setTeam} team={team} /> */}
              <EmployeeSelect
                selectedEmployees={selectedEmployees}
                setSelectedEmployees={setSelectedEmployees}
              />
              <DepartmentSelect
                selected={selectedDepartment}
                setSelected={setSelectedDepartment}
              />
              <div className="flex gap-4">
                <SelectList
                  label="Mức Độ Ưu Tiên"
                  lists={LISTS}
                  selected={stage}
                  setSelected={setStage}
                />

                <div className="w-full">
                  <Textbox
                    placeholder="Ngày"
                    type="datetime-local"
                    name="date"
                    label="Ngày hoàn thành"
                    className="w-full rounded"
                    register={register("thoiGianKetThuc", {
                      required: "Ngày là bắt buộc!",
                    })}
                    error={errors.date ? errors.date.message : ""}
                  />
                </div>
              </div>

              <div className="bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4">
                {uploading ? (
                  <span className="text-sm py-2 text-red-500">
                    Đang tải tài liệu
                  </span>
                ) : (
                  <Button
                    label="Gửi"
                    type="submit"
                    className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto"
                  />
                )}

                <Button
                  type="button"
                  className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                  onClick={() => setOpen(false)}
                  label="Hủy"
                />
              </div>
            </div>
          </form>
        </div>
      </ModalWrapper>
    </>
  );
};
const generateEmailTemplate = (employee, CongViec) => {
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
                <div class="email-header">Xin chào ${
                  employee.tenNhanVien
                },</div>
                <div class="email-body">
                    <p>Bạn đã được giao công việc <span class="highlight">${
                      CongViec.tenCongViec
                    }</span> trong dự án.</p>
                    <p>Vai trò của bạn: <span class="highlight">${
                      employee.vaiTro
                    }</span></p>
                    <p>Ngày kết thúc công việc: <span class="highlight">${new Date(
                      CongViec.thoiGianKetThuc
                    ).toLocaleDateString()}</span></p>
                                        <a href="https://job-assignment-manager-deploy.vercel.app/taskassignment" class="cta-button">Xem chi tiết công việc</a>
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

const generateEmailTemplateForManager = (department, CongViec) => {
  return `
    <html>
        <head>
            <style>
                .email-container {
                    font-family: Arial, sans-serif;
                    line-height: 1.5;
                    background-color: #f9f9f9;
                    padding: 20px;
                    border-radius: 10px;
                }
                .email-header {
                    font-size: 22px;
                    font-weight: bold;
                    color: #27ae60;
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
                    color: #c0392b;
                    font-weight: bold;
                }
                    .cta-button {
                    display: inline-block;
                    margin-top: 20px;
                    padding: 10px 20px;
                    background-color: #2e86c1;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 5px;
                    font-size: 16px;
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
                <div class="email-header">Xin chào ${
                  department.responsiblePerson
                },</div>
                <div class="email-body">
                    <p>Phòng ban của bạn đã được giao công việc <span class="highlight">${
                      CongViec.tenCongViec
                    }</span> trong dự án.</p>
                    <p>Ngày hoàn thành dự kiến: <span class="highlight">${new Date(
                      CongViec.thoiGianKetThuc
                    ).toLocaleDateString()}</span></p>
                    <p>Vui lòng kiểm tra lại chi tiết trong hệ thống quản lý công việc của chúng tôi.</p>
                    <a href="https://job-assignment-manager-deploy.vercel.app/taskassignment" class="cta-button">Xem chi tiết công việc</a>
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
function generateDeadlineNotification(taskName, dueDate) {
  return `
    <html>
      <head>
        <style>
          .email-container {
            font-family: Arial, sans-serif;
            line-height: 1.5;
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 10px;
            color: #333;
          }
          .email-header {
            font-size: 24px;
            font-weight: bold;
            color: #d9534f;
            text-align: center;
          }
          .email-body {
            margin-top: 20px;
            font-size: 16px;
          }
          .highlight {
            color: #d9534f;
            font-weight: bold;
          }
          .cta-button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #0275d8;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
          }
          .footer {
            margin-top: 30px;
            font-size: 14px;
            color: #888;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">Thông Báo Công Việc Sắp Hết Hạn</div>
          <div class="email-body">
            <p>
              Công việc <span class="highlight">${taskName}</span> mà bạn phụ
              trách sắp đến hạn hoàn thành.
            </p>
            <p>
              Ngày hết hạn dự kiến: <span class="highlight">${dueDate}</span>
            </p>
            <p>
              Vui lòng kiểm tra lại và hoàn tất công việc trước thời hạn để đảm bảo
              tiến độ dự án.
            </p>
            <a href="https://job-assignment-manager-deploy.vercel.app/taskassignment" class="cta-button"
              >Xem Chi Tiết Công Việc</a>
          </div>
          <div class="footer">
            <p>
              Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với đội ngũ quản lý
              dự án.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export default AddTask;
