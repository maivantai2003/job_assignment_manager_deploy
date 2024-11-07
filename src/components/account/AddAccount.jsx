import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import Loading from "../Loader";
import Button from "../Button";
import ModalWrapper from "../ModalWrapper";
import {fetchEmployees } from "../../redux/employees/employeeSlice";
import { fetchPermissions } from "../../redux/permission/permissionSlice";
import { addAccount, fetchAccounts } from "../../redux/accounts/accountSlice";
const AddAccount = ({ open, setOpen, accountData,account }) => {
  const defaultValues = accountData ?? {};
  const dispatch=useDispatch();
  const employees=useSelector((state)=>state.employees.list)
  const nhomquyens=useSelector((state)=>state.permissions.list)
  useEffect(()=>{
    dispatch(fetchEmployees({search:'',page:20}))
    dispatch(fetchPermissions({search:'',page:10}))
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
        maNhanVien: Number(data.maNhanVien),
        maNhomQuyen: Number(data.maQuyen),
        tenTaiKhoan: data.tenTaiKhoan,
        matKhau: data.matKhau
    });
    try {
      await dispatch(addAccount({
        maNhanVien: Number(data.maNhanVien),
        maNhomQuyen: Number(data.maQuyen),
        tenTaiKhoan: data.tenTaiKhoan,
        matKhau: data.matKhau
    })); 
      await dispatch(fetchAccounts({ search: '', page: 10 }));
      setOpen(false);
    } catch (error) {
      console.error("Failed to add employee: ", error);
    }
  };
  const exitsAcount=account.map((acc) => acc.maNhanVien);
  const allowAccount=employees.filter(
    (employee) => ! exitsAcount.includes(employee.maNhanVien)
  );
  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(handleOnSubmit)} className="">
        <Dialog.Title
          as="h2"
          className="text-base font-bold leading-6 text-gray-900 mb-4"
        >
          CREATE ACCOUNT
        </Dialog.Title>
        <label htmlFor="maNhanVien" className="block text-sm font-medium text-gray-700">
            
          </label>
          <select
            id="maNhanVien"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            {...register("maNhanVien", { required: "Chọn Nhân Viên" })}
          >
            <option value="">Chọn Nhân Viên</option>
            {allowAccount.map((item) => (
              <option key={item.maNhanVien} value={item.maNhanVien}>
                {item.tenNhanVien}
              </option>
            ))}
          </select>
        {errors.maNhanVien && <span className="text-red-600">{errors.maNhanVien.message}</span>}
        <br />
        <label htmlFor="maQuyen" className="block text-sm font-medium text-gray-700">
            
          </label>
          <select
            id="maQuyen"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            {...register("maQuyen", { required: "Chọn Nhóm Quyền" })}
          >
            <option value="">Chọn Nhóm Quyền</option>
            {nhomquyens.map((item,index) => (
              <option key={item.maQuyen+"-"+index} value={item.maQuyen}>
                {item.tenQuyen}
              </option>
            ))}
          </select>
        {errors.maQuyen && <span className="text-red-600">{errors.maQuyen.message}</span>}
        <br />
        <div className="mt-2 flex flex-col gap-6">
          <Textbox
            placeholder="Tên Tài Khoản"
            type="text"
            name="tenTaiKhoan"
            label="Tên Tài Khoản"
            className="w-full rounded"
            register={register("tenTaiKhoan", {
              required: "Tên Tài Khoản is required!",
            })}
            error={errors.tenTaiKhoan ? errors.tenTaiKhoan.message : ""}
          />
        </div>
        <div className="mt-2 flex flex-col gap-6">
          <Textbox
            placeholder="Mật Khẩu"
            type="text"
            name="matKhau"
            label="Mật khẩu"
            className="w-full rounded"
            register={register("matKhau", {
              required: "Mật Khẩu is required!",
            })}
            error={errors.matKhau ? errors.matKhau.message : ""}
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

export default AddAccount;
