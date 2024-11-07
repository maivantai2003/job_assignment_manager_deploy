import React from 'react';

const PageSizeSelect = ({ pageSize, setPageSize }) => {
  const options = [5, 10, 20, 50];

  const handleChange = (event) => {
    setPageSize(Number(event.target.value));
  };

  return (
    <div className="mb-4">
      <label htmlFor="pageSize" className="block text-sm font-medium text-gray-700">
        Số lượng trang hiển thị:
      </label>
      <select
        id="pageSize"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        value={pageSize}
        onChange={handleChange}
      >
        {options.map((size) => (
          <option key={size} value={size}>
            {size} trang
          </option>
        ))}
      </select>
    </div>
  );
};

export default PageSizeSelect;
