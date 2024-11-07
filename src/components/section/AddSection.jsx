import React, { useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import Button from "../Button";
import { useDispatch } from "react-redux";
import { addSection } from "../../redux/section/sectionSlice";
import { fetchByIdProject } from "../../redux/project/projectSlice";

const AddSection = ({ open, setOpen,duAn}) => {
  const dispatch=useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const submitHandler =async (data) => {
    try {
        await dispatch(addSection({
          maDuAn:Number(duAn),
          tenPhan:data.tenPhan
        })); 
        await dispatch(fetchByIdProject(Number(duAn)));
        setOpen(false);
    } catch (error) {
        console.error("Failed to add section: ", error);
      }
  };
  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Dialog.Title
            as='h2'
            className='text-base font-bold leading-6 text-gray-900 mb-4'
          >
            THÊM PHẦN DỰ ÁN
          </Dialog.Title>

          <div className='mt-2 flex flex-col gap-6'>
            <Textbox
              placeholder='Phần dự án'
              type='text'
              name='title'
              label='Phần dự án'
              className='w-full rounded'
              register={register("tenPhan", { required: "Phần Dự Án là bắt buộc" })}
              error={errors.tenPhan ? errors.tenPhan.message : ""}
            />
            
            <div className='flex gap-4'>
                <Button
                  label='Gửi'
                  type='submit'
                  className='bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto'
                />
              <Button
                type='button'
                className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto'
                onClick={() => setOpen(false)}
                label='Hủy'
              />
            </div>
          </div>
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddSection;
