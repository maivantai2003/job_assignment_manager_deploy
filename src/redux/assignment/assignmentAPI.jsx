
import axiosInstance from "../../interceptors/AxiosInstance";
export const fetchAssignments = async (search = '', page = 1) => {
    const response = await axiosInstance.get("PhanCong" + `?search=${search}&page=${page}`);
    return response.data;
};
export const fetchEmployeeAssignment = async (id) => {
    const response = await axiosInstance.get("PhanCong" + `/GetPhanCongNhanVien?maNhanVien=${id}`);
    return response.data;
};

export const addAssignment = async (assignment) => {
    const response = await axiosInstance.post("PhanCong", assignment);
    return response.data;
};

export const updateAssignment = async (id, assignment) => {
    const response = await axiosInstance.put("PhanCong" + "/" + id, assignment);
    return response.data;
};

export const deleteAssignment = async (id) => {
    const response = await axiosInstance.delete("PhanCong" + "/" + id);
    return response.data;
};
