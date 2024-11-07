import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import Loading from "../Loader";
import Button from "../Button";
import ModalWrapper from "../ModalWrapper";
import { fetchEmployees } from "../../redux/employees/employeeSlice";
import { addDepartment, fetchDepartments } from "../../redux/departments/departmentSlice";

const AddDepartment = ({ open, setOpen, employeeData }) => {
  const defaultValues = employeeData ?? {};
  //const { user } = useSelector((state) => state.auth);
  const dispatch=useDispatch();
  const employee=useSelector((state)=>state.employees.list)
  useEffect(()=>{
    dispatch(fetchEmployees({search:'',page:10}))
  },[dispatch])
  const isLoading = false;
  const isUpdating = false;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const handleOnSubmit =async (data) => {
    console.log("Department Data:",{
        tenPhongBan:data.tenPhongBan,
        maTruongPhong:Number(data.maTruongPhong)
    });
    try {
      await dispatch(addDepartment({
        tenPhongBan:data.tenPhongBan,
        maTruongPhong:Number(data.maTruongPhong)
    })); 
      // await dispatch(fetchDepartments({ search: '', page: 10 }));
      setOpen(false);
    } catch (error) {
      console.error("Failed to add department: ", error);
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(handleOnSubmit)} className="">
        <Dialog.Title
          as="h2"
          className="text-base font-bold leading-6 text-gray-900 mb-4"
        >
          ADD DEPARTMENT
        </Dialog.Title>
        <div className="mt-2 flex flex-col gap-6">
          <Textbox
            placeholder="Department Name"
            type="text"
            name="tenPhongBan"
            label="Tên Phòng Ban"
            className="w-full rounded"
            register={register("tenPhongBan", {
              required: "Department name is required!",
            })}
            error={errors.tenPhongBan ? errors.tenPhongBan.message : ""}
          />
          
          <label htmlFor="maTruongPhong" className="block text-sm font-medium text-gray-700">
            Chọn Trưởng Phòng
          </label>
          <select
            id="maTruongPhong"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            {...register("maTruongPhong", { required: "Select a head!" })}
          >
            <option value="">Select Head</option>
            {employee.map((item) => (
              <option key={item.maNhanVien} value={item.maNhanVien}>
                {item.tenNhanVien}
              </option>
            ))}
          </select>
          {errors.maTruongPhong && <span className="text-red-600">{errors.truongphong.message}</span>}
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

export default AddDepartment;
