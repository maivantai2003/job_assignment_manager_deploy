import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import Loading from "../Loader";
import Button from "../Button";
import ModalWrapper from "../ModalWrapper";
import { addProject, fetchProjects } from "../../redux/projects/projectSlice";

const AddProject = ({ open, setOpen, projectData }) => {
  const defaultValues = projectData ?? {};
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const handleOnSubmit = async (data) => {
    console.log("Project Data:", {
      maDuAn: Number(data.maDuAn),
      tenDuAn: data.tenDuAn,
    });
    try {
      await dispatch(
        addProject({
          maDuAn: Number(data.maDuAn),
          tenDuAn: data.tenDuAn,
        })
      );
      await dispatch(fetchProjects({ search: "", page: 10 }));
      setOpen(false);
    } catch (error) {
      console.error("Failed to add project: ", error);
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(handleOnSubmit)} className="">
        <Dialog.Title
          as="h2"
          className="text-base font-bold leading-6 text-gray-900 mb-4"
        >
          CREATE PROJECT
        </Dialog.Title>
        <div className="mt-2 flex flex-col gap-6">
          <Textbox
            placeholder="Mã Dự Án"
            type="number"
            name="maDuAn"
            label="Mã Dự Án"
            className="w-full rounded"
            register={register("maDuAn", {
              required: "Mã Dự Án is required!",
            })}
            error={errors.maDuAn ? errors.maDuAn.message : ""}
          />
        </div>
        <div className="mt-2 flex flex-col gap-6">
          <Textbox
            placeholder="Tên Dự Án"
            type="text"
            name="tenDuAn"
            label="Tên Dự Án"
            className="w-full rounded"
            register={register("tenDuAn", {
              required: "Tên Dự Án is required!",
            })}
            error={errors.tenDuAn ? errors.tenDuAn.message : ""}
          />
        </div>

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
      </form>
    </ModalWrapper>
  );
};

export default AddProject;
