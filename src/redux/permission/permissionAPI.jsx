
import axiosInstance from "../../interceptors/AxiosInstance";
export const fetchPermissions = async (search = '', page = 1) => {
    const response = await axiosInstance.get("NhomQuyen" + `?search=${search}&page=${page}`);
    return response.data;
}
export const addPermission = async (permission) => {
    const response = await axiosInstance.post("NhomQuyen", permission);
    return response.data;
}
export const updatePermission = async (id, permission) => {
    const response = await axiosInstance.put("NhomQuyen" + "/" + id, permission);
    return response.data;
};
export const fetchPermissionById = async (id) => {
    const response = await axiosInstance.get("NhomQuyen" + "/" + id);
    return response.data;
};