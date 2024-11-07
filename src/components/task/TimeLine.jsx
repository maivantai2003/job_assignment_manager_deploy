import React, { useEffect, useState } from 'react';

// Hàm tính tổng số ngày giữa hai ngày
const getDaysBetween = (startDate, endDate) => {
  return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
};

// Hàm tạo một mảng các ngày từ ngày bắt đầu đến ngày kết thúc
const generateTimelineDates = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1); // Tăng 1 ngày
  }
  return dates;
};

// Component hiển thị một dự án trên timeline
const TimelineItem = ({ project, startTimeline, totalDays }) => {
  const startDate = new Date(project.startDate);
  const endDate = new Date(project.endDate);

  const startOffset = getDaysBetween(startTimeline, startDate);
  const projectDuration = getDaysBetween(startDate, endDate);

  const styles = {
    item: {
      position: 'relative',
      marginBottom: '20px', // Tăng khoảng cách giữa các dự án
    },
    bar: {
      position: 'absolute',
      left: `${(startOffset / totalDays) * 100}%`,
      width: `${(projectDuration / totalDays) * 100}%`,
      backgroundColor: project.color || '#3498db',
      height: '50px', // Tăng chiều cao thanh biểu đồ
      borderRadius: '8px',
    },
    projectTitle: {
      position: 'absolute',
      left: `${(startOffset / totalDays) * 100}%`,
      fontSize: '16px', // Tăng kích thước phông chữ
      color: '#fff',
      backgroundColor: project.color || '#3498db',
      padding: '10px',
      borderRadius: '8px 8px 0 0',
      whiteSpace: 'nowrap',
    },
  };

  return (
    <div style={styles.item}>
      <div style={styles.bar} />
      <div style={styles.projectTitle}>{project.title}</div>
    </div>
  );
};

// Component hiển thị trục thời gian
const TimelineAxis = ({ startTimeline, endTimeline }) => {
  const dates = generateTimelineDates(startTimeline, endTimeline);

  const styles = {
    axisContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px 0',
      fontSize: '14px', // Tăng kích thước phông chữ của trục thời gian
      color: '#888',
    },
    dateItem: {
      flex: 1,
      textAlign: 'center',
    },
  };

  return (
    <div style={styles.axisContainer}>
      {dates.map((date, index) => (
        <div key={index} style={styles.dateItem}>
          {date.toLocaleDateString()}
        </div>
      ))}
    </div>
  );
};

// Component chính để hiển thị timeline
const Timeline = () => {
  const projects = [
    {
      id: 1,
      title: 'Project A',
      startDate: '2024-10-01',
      endDate: '2024-10-20',
      color: '#e74c3c',
    },
    {
      id: 2,
      title: 'Project B',
      startDate: '2024-10-05',
      endDate: '2024-10-25',
      color: '#2ecc71',
    },
    {
      id: 3,
      title: 'Project C',
      startDate: '2024-10-10',
      endDate: '2024-10-30',
      color: '#3498db',
    },
  ];

  const startTimeline = new Date('2024-10-01'); // Ngày bắt đầu của timeline
  const endTimeline = new Date('2024-10-30'); // Ngày kết thúc của timeline
  const totalDays = getDaysBetween(startTimeline, endTimeline);

  const containerStyle = {
    width: '100%',
    padding: '30px', // Tăng padding để tạo không gian rộng hơn
    backgroundColor: '#f5f5f5',
  };

  return (
    <div style={containerStyle}>
      <TimelineAxis startTimeline={startTimeline} endTimeline={endTimeline} />
      {projects.map((project) => (
        <TimelineItem key={project.id} project={project} startTimeline={startTimeline} totalDays={totalDays} />
      ))}
    </div>
  );
};

export default Timeline;
