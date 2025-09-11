// components/CalendarView.tsx - Hiển thị task theo lịch (Desktop Web-focused)

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

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const monthStats = {
    total: tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.getMonth() === month && taskDate.getFullYear() === year;
    }).length,
    completed: tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return task.completed && 
             taskDate.getMonth() === month && 
             taskDate.getFullYear() === year;
    }).length,
    overdue: tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return TaskService.isOverdue(task) &&
             taskDate.getMonth() === month && 
             taskDate.getFullYear() === year;
    }).length
  };

  return (
    <div className="calendar-view">
      {/* Calendar Header */}
      <div className="calendar-header">
        <button 
          onClick={() => navigateMonth('prev')} 
          className="nav-button"
          title="Previous month"
        >
          ◀
        </button>
        <h2>📅 {monthNames[month]} {year}</h2>
        <button 
          onClick={() => navigateMonth('next')} 
          className="nav-button"
          title="Next month"
        >
          ▶
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {/* Day Headers */}
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
          const completedTasks = dayTasks.filter(task => task.completed).length;
          const totalTasks = dayTasks.length;

          return (
            <div 
              key={day} 
              className={`calendar-day ${isToday(day) ? 'today' : ''} ${hasOverdue ? 'has-overdue' : ''}`}
              title={`${day} ${monthNames[month]}: ${totalTasks} tasks`}
            >
              <div className="day-number">
                {day}
                {totalTasks > 0 && (
                  <span style={{
                    fontSize: '0.7rem',
                    color: '#6b7280',
                    marginLeft: '0.25rem'
                  }}>
                    ({completedTasks}/{totalTasks})
                  </span>
                )}
              </div>
              
              <div className="day-tasks">
                {dayTasks.slice(0, 3).map(task => (
                  <div
                    key={task.id}
                    className={`task-pill ${task.completed ? 'completed' : ''}`}
                    style={{ 
                      borderLeftColor: TaskService.getPriorityColor(task.priority),
                      cursor: 'pointer' 
                    }}
                    onClick={() => onTaskClick(task)}
                    title={`${task.title} - ${task.category} (${task.priority} priority)`}
                  >
                    <span className="task-pill-title">
                      {task.completed ? '✅ ' : ''}
                      {TaskService.isOverdue(task) && !task.completed ? '⚠️ ' : ''}
                      {task.title.length > 18 ? task.title.substring(0, 18) + '...' : task.title}
                    </span>
                  </div>
                ))}
                
                {dayTasks.length > 3 && (
                  <div className="more-tasks">
                    📋 +{dayTasks.length - 3} more tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Monthly Statistics */}
      <div className="calendar-stats">
        <div className="stat-item">
          <span className="stat-label">📝 Total tasks this month</span>
          <span className="stat-value">{monthStats.total}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">✅ Completed</span>
          <span className="stat-value">{monthStats.completed}</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">⚠️ Overdue</span>
          <span className="stat-value">{monthStats.overdue}</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">📊 Completion Rate</span>
          <span className="stat-value">
            {monthStats.total > 0 ? Math.round((monthStats.completed / monthStats.total) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* Legend */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        background: '#f8fafc',
        borderRadius: '8px',
        fontSize: '0.875rem',
        color: '#6b7280'
      }}>
        <strong>Legend:</strong>
        <span style={{marginLeft: '1rem'}}>🟢 Low Priority</span>
        <span style={{marginLeft: '1rem'}}>🟡 Medium Priority</span>
        <span style={{marginLeft: '1rem'}}>🔴 High Priority</span>
        <span style={{marginLeft: '1rem'}}>⚠️ Overdue</span>
        <span style={{marginLeft: '1rem'}}>✅ Completed</span>
      </div>
    </div>
  );
};