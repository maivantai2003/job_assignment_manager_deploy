import { faker } from "@faker-js/faker";
import { MdKeyboardArrowDown } from "react-icons/md";
import PrioritySelection from "../Selection";
import { formatDate } from "../../utils";
import TaskGroup from "./TaskGroup";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchSections } from "../../redux/section/sectionSlice";
const ListView=({phanDuAn,duAn})=> {
  return (
    <div className="w-full bg-transparent">
      <div className="text-lg bg-transparent">
        <div className="w-full flex border-y-2 py-2 px-4 font-bold -mb-2 bg-white shadow-sm text-sm">
          <div className="flex-1 w-1/4 px-4 ">Công Việc</div>
          <div className="flex-1 w-1/5 border-l px-4 ">Mức Độ Ưu Tiên</div>
          <div className="flex-1 w-1/6 border-l px-4 ">Ngày Hết Hạn</div>
          <div className="flex-1 w-1/4 border-l px-4 ">Chịu Trách Nhiệm</div>
          <div className="flex-1 w-1/4 border-l px-4 ">Nhóm</div>
          <div className="flex-1 w-1/6 border-l px-4 ">Giai Đoạn</div>
          <div className="flex-1 border-l px-4 "></div>
        </div>
        {phanDuAn.map((item) => {
          return <TaskGroup key={item.maPhanDuAn} phanduan={item} duAn={duAn}/>;
          //console.log(item,1)
        })}
      </div>
    </div>
  );
}
export default ListView;
