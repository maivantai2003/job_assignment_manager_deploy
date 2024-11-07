import axiosInstance from "../../interceptors/AxiosInstance";
export const fetchProjects = async (search = '', page = 1) => {
    const response = await axiosInstance.get("DuAn" + `?search=${search}&page=${page}`);
    return response.data;
};
export const fetchByIdProject = async (id) => {
    const response = await axiosInstance.get("DuAn"+"/"+id);
    return response.data;
};
export const addProject = async (project) => {
    const response = await axiosInstance.post("DuAn", project);
    return response.data;
};
export const updateProject = async (id, project) => {
    const response = await axiosInstance.put("DuAn" + "/" + id, project);
    return response.data;
};
