import axiosInstance from "../../interceptors/AxiosInstance";
export const fetchSections = async (search = '', page = 1) => {
    const response = await axiosInstance.get("PhanDuAn" + `?search=${search}&page=${page}`);
    return response.data;
};

export const addSection = async (section) => {
    const response = await axiosInstance.post("PhanDuAn", section);
    return response.data;
};

export const updateSection = async (id, section) => {
    const response = await axiosInstance.put("PhanDuAn" + "/" + id, section);
    return response.data;
};
