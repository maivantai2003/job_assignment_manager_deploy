import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import Loading from "../Loader";
import Button from "../Button";
import ModalWrapper from "../ModalWrapper";
import {fetchDepartments } from "../../redux/departments/departmentSlice";
import { addEmployee, fetchEmployees } from "../../redux/employees/employeeSlice";
const AddEmployee = ({ open, setOpen, departmentData }) => {
  const defaultValues = departmentData ?? {};
  //const { user } = useSelector((state) => state.auth);
  const dispatch=useDispatch();
  const departments=useSelector((state)=>state.departments.list)
  useEffect(()=>{
    dispatch(fetchDepartments({search:'',page:10}))
  },[dispatch])
  const isLoading = false;
  const isUpdating = false;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const handleOnSubmit =async (data) => {
    console.log("Employee Data:",{
        maPhongBan: Number(data.maPhongBan),
        tenChucVu: data.tenChucVu,
        tenNhanVien: data.tenNhanVien,
        soDienThoai: data.soDienThoai,
        email:data.email
    });
    try {
      await dispatch(addEmployee({
        maPhongBan: Number(data.maPhongBan),
        tenChucVu: data.tenChucVu,
        tenNhanVien: data.tenNhanVien,
        soDienThoai: data.soDienThoai,
        email:data.email
    })); 
      //await dispatch(fetchEmployees({ search: '', page: 10 }));
      setOpen(false);
    } catch (error) {
      console.error("Failed to add employee: ", error);
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(handleOnSubmit)} className="">
        <Dialog.Title
          as="h2"
          className="text-base font-bold leading-6 text-gray-900 mb-4"
        >
          CREATE EMPLOYEE
        </Dialog.Title>
        <label htmlFor="tenChucVu" className="block text-sm font-medium text-gray-700">
            
          </label>
          <select
            id="maPhongBan"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            {...register("maPhongBan", { required: "Select a head!" })}
          >
            <option value="">Select Head</option>
            {departments.map((item) => (
              <option key={item.maPhongBan} value={item.maPhongBan}>
                {item.tenPhongBan}
              </option>
            ))}
          </select>
        {errors.maPhongBan && <span className="text-red-600">{errors.maPhongBan.message}</span>}
        <div className="mt-2 flex flex-col gap-6">
          <Textbox
            placeholder="Chức Vụ"
            type="text"
            name="tenChucVu"
            label="Tên Chức Vụ"
            className="w-full rounded"
            register={register("tenChucVu", {
              required: "Chức Vụ is required!",
            })}
            error={errors.tenChucVu ? errors.tenChucVu.message : ""}
          />
        </div>
        <div className="mt-2 flex flex-col gap-6">
          <Textbox
            placeholder="Tên Nhân Viên"
            type="text"
            name="tenNhanVien"
            label="Tên Nhân Viên"
            className="w-full rounded"
            register={register("tenNhanVien", {
              required: "Tên Nhân Viên is required!",
            })}
            error={errors.tenNhanVien ? errors.tenNhanVien.message : ""}
          />
        </div>
        <div className="mt-2 flex flex-col gap-6">
          <Textbox
            placeholder="Số điện thoại"
            type="text"
            name="soDienThoai"
            label="Số Điện Thoại"
            className="w-full rounded"
            register={register("soDienThoai", {
              required: "Số Điện Thoại is required!",
            })}
            error={errors.soDienThoai ? errors.soDienThoai.message : ""}
          />
        </div>
        <div className="mt-2 flex flex-col gap-6">
          <Textbox
            placeholder="Email"
            type="text"
            name="email"
            label="Email"
            className="w-full rounded"
            register={register("email", {
              required: "Email is required!",
            })}
            error={errors.tenNhanVien ? errors.tenNhanVien.message : ""}
          />
        </div>

        {isLoading || isUpdating ? (
          <div className="py-5">
            <Loading />
          </div>
        ) : (
          <div className="py-3 mt-4 sm:flex sm:flex-row-reverse">
            <Button
              type="submit"
              className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
              label="Submit"
            />

            <Button
              type="button"
              className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
              onClick={() => setOpen(false)}
              label="Cancel"
            />
          </div>
        )}
      </form>
    </ModalWrapper>
  );
};

export default AddEmployee;
