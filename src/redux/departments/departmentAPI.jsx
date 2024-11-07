import axiosInstance from "../../interceptors/AxiosInstance";
export const fetchDepartment=async (search='',page=10)=>{
    const response=await axiosInstance.get("PhongBan"+"?"+`search=${search}&page=${page}`)
    return response.data;
}
export const addDepartment=async (department)=>{
    const response=await axiosInstance.post("PhongBan",department)
    return response.data;
}
export const updateDepartment=async (id,department)=>{
    console.log(id,department)
    const response=await axiosInstance.put("PhongBan"+"/"+id,department)
    return response.data;
}
export const fetchManagerDepartment=async (id)=>{
    const response=await axiosInstance.get("PhongBan"+`/GetTruongPhongById/${id}`)
    return response.data;
}