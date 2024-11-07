
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartments } from '../../redux/departments/departmentSlice';

const DepartmentSelect = ({ selected, setSelected }) => {
    const dispatch = useDispatch();
    const phongbans = useSelector((state) => state.departments.list);
    const [responsiblePerson, setResponsiblePerson] = useState('');

    useEffect(() => {
        dispatch(fetchDepartments({ search: '', page: 10 }));
    }, [dispatch]);

    const handleSelectChange = (e) => {
        const value = e.target.value;
        const selectedDepartment = phongbans.find(p => p.maPhongBan === Number(value));

        if (!selectedDepartment) return;

        if (selected.includes(value)) {
            setSelected(selected.filter(item => item.maPhongBan !== value));
            setResponsiblePerson('');
        } else {
            setSelected([...selected, { 
                maPhongBan: value,
                maTruongPhong:selectedDepartment.maTruongPhong,
                tenPhongBan: selectedDepartment.tenPhongBan,
                email:selectedDepartment.truongPhong.email,
                responsiblePerson: selectedDepartment.truongPhong.tenNhanVien // Thêm trưởng phòng làm người chịu trách nhiệm
            }]);
            setResponsiblePerson(selectedDepartment.truongPhong.tenNhanVien || ''); 
        }
    };

    const handleRemoveDepartment = (value) => {
        setSelected(selected.filter(item => item.maPhongBan !== value));
        if (responsiblePerson && selected.some(item => item.maPhongBan === value)) {
            setResponsiblePerson('');
        }
    };

    return (
        <div className='flex flex-col'>
            <label className="block text-sm font-medium text-gray-700">Phòng Ban</label>
            <select
                onChange={handleSelectChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
                <option value="">Chọn phòng ban</option>
                {phongbans.map((item) => (
                    <option key={item.maPhongBan} value={item.maPhongBan}>
                        {item.tenPhongBan}
                    </option>
                ))}
            </select>
            <div className="mt-4">
                {selected.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <span className="font-medium text-gray-700">Các phòng ban đã chọn:</span>
                        <div className="flex flex-wrap gap-2">
                            {selected.map((item) => (
                                <div key={item.maPhongBan} className="flex items-center bg-blue-100 text-blue-800 rounded px-2 py-1">
                                    <span>{item.tenPhongBan} - Người chịu trách nhiệm: {item.responsiblePerson}</span>
                                    <button
                                        className="ml-2 text-red-500"
                                        onClick={() => handleRemoveDepartment(item.maPhongBan)}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {/* {responsiblePerson && (
                <div className="mt-4">
                    <span className="font-medium text-gray-700">Người chịu trách nhiệm: {responsiblePerson}</span>
                </div>
            )} */}
        </div>
    );
};

export default DepartmentSelect;

