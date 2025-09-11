// components/TaskForm.tsx - Form tạo và chỉnh sửa task (Desktop Web-focused)

import { useState } from 'react';
import type { Task, TaskFormData, TaskFormErrors } from '../types';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium',
    category: task?.category || '',
    dueDate: task?.dueDate?.split('T')[0] || new Date().toISOString().split('T')[0],
    estimatedTime: task?.estimatedTime || 30
  });

  const [errors, setErrors] = useState<TaskFormErrors>({});

  const validate = (): boolean => {
    const newErrors: TaskFormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (formData.estimatedTime < 5) {
      newErrors.estimatedTime = 'Minimum time is 5 minutes';
    } else if (formData.estimatedTime > 1440) {
      newErrors.estimatedTime = 'Maximum time is 24 hours (1440 minutes)';
    }

    const selectedDate = new Date(formData.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      newErrors.dueDate = 'Due date cannot be in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof TaskFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field as keyof TaskFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const commonCategories = [
    'Study', 'Assignment', 'Project', 'Research', 'Reading',
    'Work', 'Personal', 'Health', 'Social', 'Hobby'
  ];

  return (
    <div className="task-form-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onCancel();
    }}>
      <div className="task-form">
        <h2>
          {task ? '✏️ Edit Task' : '➕ Create New Task'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">📝 Task Title *</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g., Complete math homework, Study for exam..."
              className={errors.title ? 'error' : ''}
              autoFocus
            />
            {errors.title && <span className="error-text">⚠️ {errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">📄 Description (Optional)</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Add additional details about this task..."
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">📂 Category *</label>
              <input
                id="category"
                type="text"
                list="category-suggestions"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                placeholder="e.g., Study, Work, Personal"
                className={errors.category ? 'error' : ''}
              />
              <datalist id="category-suggestions">
                {commonCategories.map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
              {errors.category && <span className="error-text">⚠️ {errors.category}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="priority">🎯 Priority Level</label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value as Task['priority'])}
              >
                <option value="low">🟢 Low Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="high">🔴 High Priority</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dueDate">📅 Due Date</label>
              <input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={errors.dueDate ? 'error' : ''}
              />
              {errors.dueDate && <span className="error-text">⚠️ {errors.dueDate}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="estimatedTime">⏱️ Estimated Time (minutes) *</label>
              <input
                id="estimatedTime"
                type="number"
                min="5"
                max="1440"
                step="5"
                value={formData.estimatedTime}
                onChange={(e) => handleChange('estimatedTime', parseInt(e.target.value) || 0)}
                className={errors.estimatedTime ? 'error' : ''}
                placeholder="30"
              />
              {errors.estimatedTime && <span className="error-text">⚠️ {errors.estimatedTime}</span>}
              <small style={{color: '#6b7280', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block'}}>
                Common times: 15min (quick task), 30min (normal), 60min (complex), 120min (project)
              </small>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-secondary">
              ❌ Cancel
            </button>
            <button type="submit" className="btn-primary">
              {task ? '💾 Update Task' : '➕ Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};