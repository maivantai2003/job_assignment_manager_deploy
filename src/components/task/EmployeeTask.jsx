import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees } from '../../redux/employees/employeeSlice';

const EmployeeSelect = ({ selectedEmployees, setSelectedEmployees }) => {
    const dispatch = useDispatch();
    const nhanviens = useSelector((state) => state.employees.list);

    useEffect(() => {
        dispatch(fetchEmployees({ search: '', page: 30 }));
    }, [dispatch]);

    const handleSelectChange = (e) => {
        const maNhanVien = e.target.value;
        const selectedEmployee = nhanviens.find((item) => item.maNhanVien === Number(maNhanVien));

        if (!selectedEmployee) return;

        if (selectedEmployees.some(item => item.maNhanVien === maNhanVien)) {
            setSelectedEmployees(selectedEmployees.filter(item => item.maNhanVien !== maNhanVien));
        } else {
            setSelectedEmployees([
                ...selectedEmployees,
                {
                    maNhanVien,
                    tenNhanVien: selectedEmployee.tenNhanVien,
                    email: selectedEmployee.email,
                    vaiTro: ''
                }
            ]);
        }
    };

    const handleRemoveEmployee = (maNhanVien) => {
        setSelectedEmployees(selectedEmployees.filter(item => item.maNhanVien !== maNhanVien));
    };

    const handleRoleChange = (maNhanVien, vaiTro) => {
        setSelectedEmployees(selectedEmployees.map(item =>
            item.maNhanVien === maNhanVien ? { ...item, vaiTro } : item
        ));
    };

    return (
        <div className='flex flex-col'>
            <label className="block text-sm font-medium text-gray-700">Nhân Viên</label>
            <select
                onChange={handleSelectChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
                <option value="">Chọn nhân viên</option>
                {nhanviens.map((item) => (
                    <option key={item.maNhanVien} value={item.maNhanVien}>
                        {item.tenNhanVien}
                    </option>
                ))}
            </select>
            <div className="mt-4">
                {selectedEmployees.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <span className="font-medium text-gray-700">Các nhân viên đã chọn:</span>
                        <div className="flex flex-wrap gap-2">
                            {selectedEmployees.map((item) => (
                                <div key={item.maNhanVien} className="flex items-center bg-blue-100 text-blue-800 rounded px-2 py-1">
                                    <span>{item.tenNhanVien}</span> {/* Hiển thị tên nhân viên */}
                                    <select
                                        className="ml-2 rounded border-gray-300"
                                        value={item.vaiTro}
                                        onChange={(e) => handleRoleChange(item.maNhanVien, e.target.value)}
                                    >
                                        <option value="">Chọn vai trò</option>
                                        <option value="Người Chịu Trách Nhiệm">Người Chịu Trách Nhiệm</option>
                                        <option value="Người Thực Hiện">Người Thực Hiện</option>
                                    </select>
                                    <button
                                        className="ml-2 text-red-500"
                                        onClick={() => handleRemoveEmployee(item.maNhanVien)}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeSelect;
