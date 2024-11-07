import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import PageSizeSelect from "../components/PageSizeSelect";
import AddProject from "../components/project/AddProject";
import { fetchProjects } from "../redux/projects/projectSlice";

const Projects = () => {
  const [pageSize, setPageSize] = useState(10);
  const projects = useSelector((state) => state.projects.list);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProjects({ search: "", page: pageSize }));
  }, [dispatch, pageSize]);

  const editClick = (project) => {
    // Implement logic to edit project
  };

  const TableHeader = () => (
    <thead className="border-b border-gray-300">
      <tr className="text-black text-left">
        <th className="py-2">Mã Dự Án</th>
        <th className="py-2">Tên Dự Án</th>
      </tr>
    </thead>
  );

  const TableRow = ({ project }) => (
    <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-400/10">
      <td className="p-2">{project.maDuAn}</td>
      <td className="p-2">{project.tenDuAn}</td>
      <td className="p-2 flex gap-4 justify-end">
        <Button
          className="text-blue-600 hover:text-blue-500 font-semibold sm:px-0"
          label="Edit"
          type="button"
          onClick={() => editClick(project)}
        />
      </td>
    </tr>
  );

  return (
    <>
      <PageSizeSelect pageSize={pageSize} setPageSize={setPageSize} />
      <div className="w-full md:px-1 px-0 mb-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-bold">Projects</h2>
          <Button
            label="Thêm Dự Án Mới"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md 2xl:py-2.5"
            onClick={() => setOpen(true)}
          />
        </div>

        <div className="bg-white px-2 md:px-4 py-4 shadow-md rounded">
          <div className="overflow-x-auto">
            <table className="w-full mb-5">
              <TableHeader />
              <tbody>
                {projects?.map((project, index) => (
                  <TableRow key={index} project={project} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddProject open={open} setOpen={setOpen} projectData={null} />
    </>
  );
};

export default Projects;
