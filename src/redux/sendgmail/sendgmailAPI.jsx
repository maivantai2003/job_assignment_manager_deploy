import axiosInstance from "../../interceptors/AxiosInstance";
export const sendGmail = async (gmail) => {
    const response = await axiosInstance.post("SendGmail", gmail);
    return response.data;
};