import React, { useState, useEffect } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import UserList from "./UserList";
import SelectList from "../SelectList";
import Button from "../Button";
import { useDispatch } from "react-redux";
import { updateTask, addTask } from "../../redux/task/taskSlice";
import DepartmentSelect from "./DepartmentTask";
import EmployeeSelect from "./EmployeeTask";
import { addAssignment } from "../../redux/assignment/assignmentSlice";
import { sendGmail } from "../../redux/sendgmail/sendgmailSlice";
import { addWorkDepartment } from "../../redux/workdepartment/workdepartmentSlice";

const LISTS = ["CAO", "TRUNG BÌNH", "BÌNH THƯỜNG", "THẤP"];
const PRIORITY = ["CAO", "TRUNG BÌNH", "BÌNH THƯỜNG", "THẤP"];
const UpdateTask = ({ openUpdate, setOpenUpdate, phanDuAn,duAn, task,phanCong }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const dispatch = useDispatch();
  const [team, setTeam] = useState(task?.team || []);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [stage, setStage] = useState(task?.priority?.toUpperCase() || LISTS[0]);
  const [priority, setPriority] = useState(task?.priority?.toUpperCase() || PRIORITY[2]);
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Load initial values for editing
  useEffect(() => {
    const loadData = async () => {
      if (task) {
        reset({
          tenCongViec: task.tenCongViec,
          moTa: task.moTa,
          thoiGianBatDau: new Date(task.thoiGianBatDau).toISOString().slice(0, 16),
          thoiGianKetThuc: task.thoiGianKetThuc,
        });
        setStage(task.mucDoUuTien?.toUpperCase() || LISTS[0]);

        if (phanCong && phanCong.phanCongs) {
          const employees = phanCong.phanCongs.map((assignment) => ({
            maNhanVien: assignment.maNhanVien,
            tenNhanVien: assignment.nhanVien.tenNhanVien,
            email: assignment.nhanVien.email,
            vaiTro: assignment.vaiTro,
          }));
          setSelectedEmployees(employees);
        }
      }
    };

    loadData(); // Gọi hàm bất đồng bộ để load dữ liệu
  }, [task, phanCong, reset]);

  const submitHandler = async (data) => {
    let CongViec = {
      maPhanDuAn: Number(phanDuAn),
      maCongViec:task.maCongViec,
      maCongViecCha:task.maCongViecCha,
      tenCongViec: data.tenCongViec,
      moTa: data.moTa,
      mucDoUuTien: stage,
      thoiGianKetThuc: data.thoiGianKetThuc,
      trangThaiCongViec: task ? task.trangThaiCongViec : false,
      mucDoHoanThanh: task ? task.mucDoHoanThanh : 0,
    };
    console.log(selectedEmployees)
    try {
    //   let result;
    //   if (task) {
    //     // Update the task if it's an existing one
    //     result = await dispatch(updateTask({ ...CongViec, maCongViec: task.maCongViec })).unwrap();
    //   } else {
    //     // Create new task
    //     result = await dispatch(addTask(CongViec)).unwrap();
    //   }

    //   // Proceed with adding departments and assignments similar to before
    //   if (Array.isArray(selectedDepartment) && selectedDepartment.length > 0) {
    //     const departmentPromises = selectedDepartment.map(async (department) => {
    //       await dispatch(addWorkDepartment({
    //         maCongViec: result.maCongViec,
    //         maPhongBan: Number(department.maPhongBan),
    //       }));

    //       await dispatch(addAssignment({
    //         maCongViec: result.maCongViec,
    //         maNhanVien: Number(department.maTruongPhong),
    //         vaiTro: "Người Chịu Trách Nhiệm",
    //       }));
    //     });
    //     await Promise.all(departmentPromises);
    //   }

    //   if (Array.isArray(selectedEmployees) && selectedEmployees.length > 0) {
    //     const employeePromises = selectedEmployees.map(async (employee) => {
    //       await dispatch(addAssignment({
    //         maCongViec: result.maCongViec,
    //         maNhanVien: Number(employee.maNhanVien),
    //         vaiTro: employee.vaiTro,
    //       }));
    //       await dispatch(sendGmail({
    //         name: employee.tenNhanVien,
    //         toGmail: employee.email,
    //         subject: "Thông Tin Phân Công Dự Án",
    //         body: generateEmailTemplate(employee, CongViec),
    //       }));
    //     });
    //     await Promise.all(employeePromises);
    //   }

    //   setOpenUpdate(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSelect = (e) => {
    setAssets(e.target.files);
  };

  return (
    <ModalWrapper open={openUpdate} setOpen={setOpenUpdate}>
      <div className="max-h-screen overflow-y-auto">
        <form onSubmit={handleSubmit(submitHandler)}>
          <Dialog.Title as="h2" className="text-base font-bold leading-6 text-gray-900 mb-4">
            {task ? "CHỈNH SỬA CÔNG VIỆC" : "THÊM CÔNG VIỆC"}
          </Dialog.Title>

          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder="Tên công việc"
              type="text"
              name="tenCongViec"
              label="Tên công việc"
              className="w-full rounded"
              register={register("tenCongViec", { required: "Tên công việc là bắt buộc" })}
              error={errors.tenCongViec ? errors.tenCongViec.message : ""}
            />

            <Textbox
              placeholder="Mô tả"
              type="text"
              name="moTa"
              label="Mô tả"
              className="w-full rounded"
              register={register("moTa", { required: "Mô tả công việc là bắt buộc" })}
              error={errors.moTa ? errors.moTa.message : ""}
            />

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
                  name="thoiGianBatDau"
                  label="Ngày Bắt Đầu"
                  className="w-full rounded"
                  register={register("thoiGianBatDau", {
                    required: "Ngày là bắt buộc!",
                  })}
                  error={errors.thoiGianBatDau ? errors.thoiGianBatDau.message : ""}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-full">
                <Textbox
                  placeholder="Ngày"
                  type="datetime-local"
                  name="thoiGianKetThuc"
                  label="Ngày hoàn thành"
                  className="w-full rounded"
                  register={register("thoiGianKetThuc", {
                    required: "Ngày là bắt buộc!",
                  })}
                  error={errors.thoiGianKetThuc ? errors.thoiGianKetThuc.message : ""}
                />
              </div>
            </div>

            <div className="bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4">
              <Button
                label="Gửi"
                type="submit"
                className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto"
              />
              <Button
                type="button"
                className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                onClick={() => setOpenUpdate(false)}
                label="Hủy"
              />
            </div>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default UpdateTask;
