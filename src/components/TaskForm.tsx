// components/TaskForm.tsx - Form tạo và chỉnh sửa task

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
      newErrors.title = 'Tiêu đề không được để trống';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Danh mục không được để trống';
    }

    if (formData.estimatedTime < 5) {
      newErrors.estimatedTime = 'Thời gian ước tính tối thiểu 5 phút';
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

  return (
    <div className="task-form-overlay">
      <div className="task-form">
        <h2>{task ? 'Chỉnh sửa Task' : 'Tạo Task Mới'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Tiêu đề *</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Ví dụ: Hoàn thành bài tập Toán"
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Mô tả</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Mô tả chi tiết task..."
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Danh mục *</label>
              <input
                id="category"
                type="text"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                placeholder="Ví dụ: Học tập, Công việc"
                className={errors.category ? 'error' : ''}
              />
              {errors.category && <span className="error-text">{errors.category}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="priority">Độ ưu tiên</label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value as Task['priority'])}
              >
                <option value="low">Thấp</option>
                <option value="medium">Trung bình</option>
                <option value="high">Cao</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dueDate">Deadline</label>
              <input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="estimatedTime">Thời gian ước tính (phút) *</label>
              <input
                id="estimatedTime"
                type="number"
                min="5"
                value={formData.estimatedTime}
                onChange={(e) => handleChange('estimatedTime', parseInt(e.target.value) || 0)}
                className={errors.estimatedTime ? 'error' : ''}
              />
              {errors.estimatedTime && <span className="error-text">{errors.estimatedTime}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Hủy
            </button>
            <button type="submit" className="btn-primary">
              {task ? 'Cập nhật' : 'Tạo Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};