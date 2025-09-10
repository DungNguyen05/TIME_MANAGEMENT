// components/CalendarView.tsx - Hiển thị task theo lịch (Web-focused)

import React, { useState } from 'react';
import type { Task } from '../types';
import { TaskService } from '../services/taskService';

interface CalendarViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onTaskClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Create calendar grid
  const calendarDays = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getTasksForDate = (day: number): Task[] => {
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return TaskService.getTasksByDate(tasks, dateString);
  };

  const isToday = (day: number): boolean => {
    return today.getDate() === day && 
           today.getMonth() === month && 
           today.getFullYear() === year;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="calendar-view">
      {/* Calendar Header */}
      <div className="calendar-header">
        <button onClick={() => navigateMonth('prev')} className="nav-button">
          ‹
        </button>
        <h2>{monthNames[month]} {year}</h2>
        <button onClick={() => navigateMonth('next')} className="nav-button">
          ›
        </button>
      </div>

      {/* Day Names */}
      <div className="calendar-grid">
        {dayNames.map(day => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={index} className="calendar-day empty"></div>;
          }

          const dayTasks = getTasksForDate(day);
          const hasOverdue = dayTasks.some(task => TaskService.isOverdue(task));

          return (
            <div 
              key={day} 
              className={`calendar-day ${isToday(day) ? 'today' : ''} ${hasOverdue ? 'has-overdue' : ''}`}
            >
              <div className="day-number">{day}</div>
              
              <div className="day-tasks">
                {dayTasks.slice(0, 3).map(task => (
                  <div
                    key={task.id}
                    className={`task-pill ${task.completed ? 'completed' : ''}`}
                    style={{ borderLeftColor: TaskService.getPriorityColor(task.priority) }}
                    onClick={() => onTaskClick(task)}
                    title={task.title}
                  >
                    <span className="task-pill-title">
                      {task.title.length > 20 ? task.title.substring(0, 20) + '...' : task.title}
                    </span>
                  </div>
                ))}
                
                {dayTasks.length > 3 && (
                  <div className="more-tasks">
                    +{dayTasks.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="calendar-stats">
        <div className="stat-item">
          <span className="stat-label">Total tasks this month:</span>
          <span className="stat-value">
            {tasks.filter(task => {
              const taskDate = new Date(task.dueDate);
              return taskDate.getMonth() === month && taskDate.getFullYear() === year;
            }).length}
          </span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Completed:</span>
          <span className="stat-value">
            {tasks.filter(task => {
              const taskDate = new Date(task.dueDate);
              return task.completed && 
                     taskDate.getMonth() === month && 
                     taskDate.getFullYear() === year;
            }).length}
          </span>
        </div>
      </div>
    </div>
  );
};