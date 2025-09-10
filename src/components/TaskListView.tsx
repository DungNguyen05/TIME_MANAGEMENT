// components/TaskListView.tsx - Hiển thị danh sách task

import React from 'react';
import type { Task } from '../types';
import { TaskService } from '../services/taskService';

interface TaskListViewProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskListView: React.FC<TaskListViewProps> = ({
  tasks,
  onToggleComplete,
  onEditTask,
  onDeleteTask
}) => {
  const sortedTasks = TaskService.sortTasksByPriority(tasks);

  const getPriorityLabel = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'Cao';
      case 'medium': return 'TB';
      case 'low': return 'Thấp';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hôm nay';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Ngày mai';
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };

  if (sortedTasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <h3>Chưa có task nào</h3>
        <p>Bắt đầu bằng cách tạo task đầu tiên của bạn!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {sortedTasks.map(task => {
        const isOverdue = TaskService.isOverdue(task);
        
        return (
          <div 
            key={task.id} 
            className={`task-item ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}
          >
            <div className="task-checkbox">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleComplete(task.id)}
              />
            </div>

            <div className="task-content">
              <div className="task-header">
                <h3 className="task-title">{task.title}</h3>
                <div className="task-badges">
                  <span 
                    className={`priority-badge priority-${task.priority}`}
                    style={{ backgroundColor: TaskService.getPriorityColor(task.priority) }}
                  >
                    {getPriorityLabel(task.priority)}
                  </span>
                  <span className="category-badge">{task.category}</span>
                </div>
              </div>

              {task.description && (
                <p className="task-description">{task.description}</p>
              )}

              <div className="task-meta">
                <span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
                  📅 {formatDate(task.dueDate)}
                  {isOverdue && ' (Quá hạn)'}
                </span>
                <span className="estimated-time">
                  ⏱️ {TaskService.formatTime(task.estimatedTime)}
                </span>
              </div>
            </div>

            <div className="task-actions">
              <button 
                onClick={() => onEditTask(task)}
                className="btn-icon"
                title="Chỉnh sửa"
              >
                ✏️
              </button>
              <button 
                onClick={() => onDeleteTask(task.id)}
                className="btn-icon delete"
                title="Xóa"
              >
                🗑️
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};