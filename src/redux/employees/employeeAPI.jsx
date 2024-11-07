import axiosInstance from "../../interceptors/AxiosInstance";
export const fetchEmployees=async (search='',page=10)=>{
    const response=await axiosInstance.get("NhanVien"+"?"+`search=${search}&page=${page}`)
    return response.data;
}
export const addEmployee=async (employee)=>{
    const response=await axiosInstance.post("NhanVien",employee)
    return response.data;
}
export const updateEmployee=async (id,employee)=>{
    const response=await axiosInstance.put("NhanVien"+"/"+id,employee)
    return response.data;
}