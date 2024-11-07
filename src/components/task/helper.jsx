// import React from "react";
// import { useLocation } from "react-router-dom";

// export function initTasks() {
//   const currentDate = new Date();
//   const location = useLocation();
//   const { duan } = location.state || {};
//   if (!duan || !duan.phanDuAn) {
//     console.error("Invalid project data");
//     return [];
//   }
//   console.log(duan);
//   const tasks = duan.phanDuAn.flatMap((item) => {
//     return item.congViecs
//       .map((i) => {
//         const startTime = new Date(
//           i.thoiGianBatDau.endsWith("Z")
//             ? i.thoiGianBatDau
//             : `${i.thoiGianBatDau}Z`
//         );
//         const endTime = new Date(
//           i.thoiGianKetThuc.endsWith("Z")
//             ? i.thoiGianKetThuc
//             : `${i.thoiGianKetThuc}Z`
//         );

//         if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
//           console.error(`Invalid times for task: ${JSON.stringify(i)}`);
//           return null;
//         }

//         return {
//           start: startTime,
//           end: endTime,
//           name: i.tenCongViec,
//           id: i.maCongViec,
//           type: "task",
//           //project: duan.tenDuAn,
//           progress: 80,
//           isDisabled: true,
//           styles: {
//             progressColor: "#ffbb54",
//             progressSelectedColor: "#ff9e0d",
//           },
//           labelStyle: {
//             color: "#111",
//           },
//         };
//       })
//       .filter(Boolean);
//   });
//   console.log(tasks);
//   return tasks;
// }

// export function getStartEndDateForProject(tasks, projectId) {
//   const projectTasks = tasks.filter((t) => t.project === projectId);
//   let start = projectTasks[0].start;
//   let end = projectTasks[0].end;

//   for (let i = 0; i < projectTasks.length; i++) {
//     const task = projectTasks[i];
//     if (start.getTime() > task.start.getTime()) {
//       start = task.start;
//     }
//     if (end.getTime() < task.end.getTime()) {
//       end = task.end;
//     }
//   }
//   return [start, end];
// }


import React from "react";
import { useLocation } from "react-router-dom";

export function initTasks() {
  const currentDate = new Date();
  const location = useLocation();
  const { duan } = location.state || {};
  if (!duan || !duan.phanDuAn) {
    console.error("Invalid project data");
    return [];
  }
  console.log(duan);
  const colors = ["#ffbb54", "#4caf50", "#2196f3", "#9c27b0", "#ff5722"];
  let colorMap = {};
  let colorIndex = 0;
  console.log(duan.phanDuAn)
  const tasks = duan.phanDuAn.flatMap((item) => {
    return item.congViecs
      .map((i) => {
        const startTime = new Date(
          i.thoiGianBatDau.endsWith("Z")
            ? i.thoiGianBatDau
            : `${i.thoiGianBatDau}Z`
        );
        const endTime = new Date(
          i.thoiGianKetThuc.endsWith("Z")
            ? i.thoiGianKetThuc
            : `${i.thoiGianKetThuc}Z`
        );

        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
          console.error(`Invalid times for task: ${JSON.stringify(i)}`);
          return null;
        }
        const parentId = i.maCongViecCha;
        let taskColor;
        if (parentId) {
          if (!colorMap[parentId]) {
            colorMap[parentId] = colors[colorIndex % colors.length];
            colorIndex++;
          }
          taskColor = colorMap[parentId];
        } else {
          taskColor = "#e0e0e0";
        }

        return {
          start: startTime,
          end: endTime,
          name: i.tenCongViec,
          id: i.maCongViec,
          type: "task",
          progress: 80,
          isDisabled: true,
          styles: {
            progressColor: taskColor,
            progressSelectedColor: taskColor,
            backgroundColor: taskColor,
          },
          labelStyle: {
            color: "#000",
          },
        };
      })
      .filter(Boolean);
  });

  console.log(tasks);
  return tasks;
}

export function getStartEndDateForProject(tasks, projectId) {
  const projectTasks = tasks.filter((t) => t.project === projectId);
  let start = projectTasks[0].start;
  let end = projectTasks[0].end;

  for (let i = 0; i < projectTasks.length; i++) {
    const task = projectTasks[i];
    if (start.getTime() > task.start.getTime()) {
      start = task.start;
    }
    if (end.getTime() < task.end.getTime()) {
      end = task.end;
    }
  }
  return [start, end];
}
