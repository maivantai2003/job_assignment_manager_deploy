
import axiosInstance from "../../interceptors/AxiosInstance";

export const fetchWorkDepartment = async (search = '', page = 1) => {
    const response = await axiosInstance.get("CongViecPhongBan" + `?search=${search}&page=${page}`);
    return response.data;
};

export const addWorkDepartment = async (WorkDepartment) => {
    const response = await axiosInstance.post("CongViecPhongBan", WorkDepartment);
    return response.data;
};

export const updateWorkDepartment = async (id, WorkDepartment) => {
    const response = await axiosInstance.put("CongViecPhongBan" + "/" + id, WorkDepartment);
    return response.data;
};
export const fetchByIdWorkDepartment = async (id) => {
    const response = await axiosInstance.get("CongViecPhongBan"+"/"+id);
    return response.data;
};
export const fetchByIdDepartment = async (id) => {
    const response = await axiosInstance.get("CongViecPhongBan"+`/GetPhongBanPhanCong/${id}`);
    return response.data;
};
