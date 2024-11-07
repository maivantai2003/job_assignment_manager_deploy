
import axiosInstance from "../../interceptors/AxiosInstance";
export const fetchReminders=async()=>{
    const response=await axiosInstance.get("NhacNho")
    return response.data
}