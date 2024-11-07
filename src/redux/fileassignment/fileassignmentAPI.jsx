import axiosInstance from "../../interceptors/AxiosInstance";
export const createChiTietFile = async (chiTietFile) => {
  const response = await axiosInstance.post("ChiTietFile", chiTietFile);
  return response.data;
};

export const fetchChiTietFileByPhanCong = async (id) => {
  const response = await axiosInstance.get(`${"ChiTietFile"}/${id}`);
  return response.data;
};
export const deleteChiTietFile=async(id)=>{
  const response = await axiosInstance.put(`${"ChiTietFile"}/${id}`);
  return response.data;
}
