import React, { useEffect, useState } from "react";
import { ViewMode, Gantt } from "gantt-task-react";
import { ViewSwitcher } from "./ViewSwitcher";
import { getStartEndDateForProject, initTasks } from "./helper";
const GanttApp = () => {
  const [view, setView] = useState(ViewMode.Day);
  const [tasks, setTasks] = useState(initTasks());
  const [isChecked, setIsChecked] = useState(true);

  let columnWidth = 30;
  if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  } else if (
    view === ViewMode.Day ||
    view === ViewMode.HalfDay ||
    view === ViewMode.QuarterDay
  ) {
    columnWidth = 100;
  }
  const handleTaskChange = (task) => {
    let newTasks = tasks.map((t) => (t.id === task.id ? task : t));

    if (task.project) {
      const [start, end] = getStartEndDateForProject(newTasks, task.project);
      const project = newTasks.find((t) => t.id === task.project);
      if (
        project &&
        (project.start.getTime() !== start.getTime() ||
          project.end.getTime() !== end.getTime())
      ) {
        const changedProject = { ...project, start, end };
        newTasks = newTasks.map((t) =>
          t.id === task.project ? changedProject : t
        );
      }
    }
    setTasks(newTasks);
  };

  const handleTaskDelete = (task) => {
    const conf = window.confirm("Are you sure about " + task.name + " ?");
    if (conf) {
      setTasks(tasks.filter((t) => t.id !== task.id));
    }
    return conf;
  };

  const handleProgressChange = async (task) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
  };

  const exportToMSProject = () => {
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
    const projectHeader =
      '<Project xmlns="http://schemas.microsoft.com/project">';
    const projectFooter = "</Project>";

    const tasksXml = tasks
  .map((task, index) => {
    const startDate = new Date(task.start);
    const endDate = new Date(task.end);
    if (endDate <= startDate) {
      endDate.setDate(startDate.getDate() + 1);
    }
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const durationDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
    );

    return `
      <Task>
        <UID>${index + 1}</UID>
        <Name>${task.name}</Name>
        <Start>${startDate.toISOString()}</Start>
        <Finish>${endDate.toISOString()}</Finish>
        <PercentComplete>${task.progress || 0}</PercentComplete>
        <Duration>${10} days</Duration>
      </Task>
    `;
  })
  .join('');

    const xmlContent = `${xmlHeader}
      ${projectHeader}
      <Tasks>${tasksXml}</Tasks>
      ${projectFooter}`;

    const blob = new Blob([xmlContent], { type: "application/xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ProjectTasks.xml";
    link.click();
  };
  const getTaskColor = (task) => {
    const colors = {
      "task1": "#ff9999",
      "task2": "#99ff99",
      "task3": "#9999ff",
    };
    return colors[task.id] || "#cccccc";
  };
  return (
    <div>
      <ViewSwitcher
        onViewModeChange={setView}
        onViewListChange={setIsChecked}
        isChecked={isChecked}
      />
      <button onClick={exportToMSProject}>
        <i className="fas fa-file-export"></i>
        Export to Microsoft Project
      </button>
      <Gantt
        tasks={tasks}
        listCellWidth={isChecked ? "155px" : ""}
        columnWidth={columnWidth}
        barBackgroundColor="blue"
        barColor="black"
        rowHeight={40}
        fontSize={14}
        
      />
    </div>
  );
};

export default GanttApp;
