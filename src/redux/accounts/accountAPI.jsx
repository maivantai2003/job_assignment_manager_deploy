import axiosInstance from "../../interceptors/AxiosInstance";

export const fetchAccount = async (search = '', page = 10) => {
    const response = await axiosInstance.get("TaiKhoan" + `?search=${search}&page=${page}`);
    return response.data;
};

export const addAccount = async (taiKhoan) => {
    const response = await axiosInstance.post("TaiKhoan", taiKhoan);
    return response.data;
};

// Update an existing account
export const updateAccount = async (id, taiKhoan) => {
    console.log(id, taiKhoan);
    const response = await axiosInstance.put("TaiKhoan" + "/" + id, taiKhoan);
    return response.data;
};
