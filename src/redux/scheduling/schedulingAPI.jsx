
import axiosInstance from "../../interceptors/AxiosInstance";
export const sendNotification=async(scheduling)=>{
    const response=await axiosInstance.post("LapLich",scheduling)
    return response.data
}