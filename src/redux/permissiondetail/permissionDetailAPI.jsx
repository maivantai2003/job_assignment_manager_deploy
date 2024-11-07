import axiosInstance from "../../interceptors/AxiosInstance";

export const fetchPermissionDetails = async () => {
    const response = await axiosInstance.get("ChiTietQuyen");
    return response.data;
};

export const addPermissionDetail = async (permissionDetail) => {
    const response = await axiosInstance.post("ChiTietQuyen", permissionDetail);
    return response.data;  
};

export const updatePermissionDetail = async (id, permissionDetail) => {
    const response = await axiosInstance.put("ChiTietQuyen" + "/" + id, permissionDetail);
    return response.data;
};
export const deletePermissionDetail = async (id) => {
    const response = await axiosInstance.delete(`${"ChiTietQuyen"}/${id}`);
    return response.data;  
};
export const checkPermission = async (permissionDetail) => {
    const response = await axiosInstance.post(`${"ChiTietQuyen"}/KiemTraQuyen`,permissionDetail);
    return response.data;  
};
