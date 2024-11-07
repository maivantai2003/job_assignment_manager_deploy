
import axiosInstance from "../../interceptors/AxiosInstance";
export const fetchAllFile = async () => {
    const response = await axiosInstance.get("Files");
    return response.data;
};

export const fetchFile = async (id) => {
    const response = await axiosInstance.get(`${"Files"}/${id}`);
    return response.data;
};

export const addFile = async (file) => {
    const response = await axiosInstance.post("Files", file);
    return response.data;
};

export const deleteFile = async (id) => {
    await axiosInstance.delete(`${"Files"}/${id}`);
};
