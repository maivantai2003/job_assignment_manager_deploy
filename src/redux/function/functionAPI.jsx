import axiosInstance from "../../interceptors/AxiosInstance";
export const fetchFunctions = async (search = '', page = 10) => {
    const response = await axiosInstance.get("ChucNang" + `?search=${search}&page=${page}`);
    return response.data;
};

export const addFunction = async (func) => {
    const response = await axiosInstance.post("ChucNang", func);
    return response.data;
};

export const updateFunction = async (id, func) => {
    const response = await axiosInstance.put("ChucNang" + "/" + id, func);
    return response.data;
};
