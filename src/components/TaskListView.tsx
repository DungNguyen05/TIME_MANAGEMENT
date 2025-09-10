// components/TaskListView.tsx - Clean task list display

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
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  if (sortedTasks.length === 0) {
    return (
      <div className="empty-state">
        <h3>No tasks yet</h3>
        <p>Create your first task to get started with managing your time effectively!</p>
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
                  <span className={`priority-badge priority-${task.priority}`}>
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
                  Due: {formatDate(task.dueDate)}
                  {isOverdue && ' (Overdue)'}
                </span>
                <span className="estimated-time">
                  Est: {TaskService.formatTime(task.estimatedTime)}
                </span>
              </div>
            </div>

            <div className="task-actions">
              <button 
                onClick={() => onEditTask(task)}
                className="btn-icon"
                title="Edit task"
              >
                Edit
              </button>
              <button 
                onClick={() => onDeleteTask(task.id)}
                className="btn-icon delete"
                title="Delete task"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};