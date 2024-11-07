import React, { useEffect, useRef } from 'react';
import { Timeline } from 'react-visjs-timeline';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';

const ProjectMilestone = ({ projectData }) => {
  const timelineRef = useRef(null);

  const options = {
    stack: false,
    margin: {
      item: 10,
      axis: 5,
    },
    orientation: 'top',
    editable: false,
    showCurrentTime: true,
    zoomMin: 1000 * 60 * 60 * 24, // One day
    zoomMax: 1000 * 60 * 60 * 24 * 30, // One month
  };

  const groups = [
    { id: 1, content: 'Planning', value: 1 },
    { id: 2, content: 'Execution', value: 2 },
    { id: 3, content: 'Launch', value: 3 },
  ];

  const items = projectData.sections.map((section, sectionIndex) => {
    return section.tasks.map((task, taskIndex) => ({
      id: sectionIndex * 10 + taskIndex,
      group: section.phaseId,
      content: task.taskName,
      start: task.startDate,
      end: task.endDate,
      className: task.milestones.length > 0 ? 'milestone-task' : '',
    }));
  }).flat();

  useEffect(() => {
    const container = timelineRef.current;
    new Timeline(container, items, groups, options);
  }, [items]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-white mb-6">Project Milestones</h1>
      <div ref={timelineRef} />
    </div>
  );
};

export default ProjectMilestone;
