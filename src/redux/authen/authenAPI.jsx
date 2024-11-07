import axiosInstance from "../../interceptors/AxiosInstance";
export const Login = async (AuthRequest) => {
    const response = await axiosInstance.post("Authentication/"+"Login", AuthRequest);
    return response.data;
};

export const RefreshToken = async (RefreshTokenRequest) => {
    const response = await axiosInstance.put("Authentication/"+"RefreshToken",RefreshTokenRequest);
    return response.data;
};
