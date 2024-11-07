import axiosInstance from "../../interceptors/AxiosInstance";
export const fetchTaskTransfers = async (search = '', page = 1) => {
    const response = await axiosInstance.get("ChuyenGiaoCongViec" + `?search=${search}&page=${page}`);
    return response.data;
};

export const addTaskTransfer = async (taskTransfer) => {
    const response = await axiosInstance.post("ChuyenGiaoCongViec", taskTransfer);
    return response.data;
};