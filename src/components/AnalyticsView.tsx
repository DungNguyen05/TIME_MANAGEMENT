// components/AnalyticsView.tsx - Hiển thị thống kê và phân tích

import React from 'react';
import type { Task } from '../types';
import { TaskService } from '../services/taskService';

interface AnalyticsViewProps {
  tasks: Task[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ tasks }) => {
  const stats = TaskService.calculateStats(tasks);

  const getProgressBarColor = (percentage: number): string => {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const recentTasks = tasks
    .filter(task => {
      const taskDate = new Date(task.createdAt);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return taskDate >= sevenDaysAgo;
    })
    .length;

  const upcomingTasks = tasks
    .filter(task => {
      if (task.completed) return false;
      const taskDate = new Date(task.dueDate);
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
      return taskDate <= threeDaysFromNow;
    })
    .length;

  return (
    <div className="analytics-view">
      {/* Overview Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Tổng Task</h3>
            <div className="stat-number">{stats.totalTasks}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Hoàn thành</h3>
            <div className="stat-number">{stats.completedTasks}</div>
            <div className="stat-subtitle">
              {stats.completionRate.toFixed(1)}% tỷ lệ hoàn thành
            </div>
          </div>
        </div>

        <div className="stat-card overdue">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>Quá hạn</h3>
            <div className="stat-number">{stats.overdueTasks}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <h3>Thời gian TB</h3>
            <div className="stat-number">
              {TaskService.formatTime(Math.round(stats.averageCompletionTime))}
            </div>
            <div className="stat-subtitle">mỗi task</div>
          </div>
        </div>
      </div>

      {/* Productivity by Category */}
      <div className="analytics-section">
        <h3>Hiệu suất theo Danh mục</h3>
        <div className="category-stats">
          {Object.entries(stats.productivityByCategory).map(([category, percentage]) => (
            <div key={category} className="category-item">
              <div className="category-header">
                <span className="category-name">{category}</span>
                <span className="category-percentage">{percentage.toFixed(1)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: getProgressBarColor(percentage)
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {Object.keys(stats.productivityByCategory).length === 0 && (
          <div className="empty-analytics">
            <p>Chưa có dữ liệu để phân tích. Hãy tạo thêm task!</p>
          </div>
        )}
      </div>

      {/* Quick Insights */}
      <div className="analytics-section">
        <h3>Thông tin nhanh</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">🔥</div>
            <div className="insight-content">
              <h4>Task tuần này</h4>
              <p>{recentTasks} task được tạo trong 7 ngày qua</p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon">📅</div>
            <div className="insight-content">
              <h4>Sắp tới</h4>
              <p>{upcomingTasks} task cần hoàn thành trong 3 ngày tới</p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon">🎯</div>
            <div className="insight-content">
              <h4>Mục tiêu</h4>
              <p>
                {stats.completionRate >= 80 
                  ? 'Xuất sắc! Tiếp tục duy trì!' 
                  : stats.completionRate >= 60 
                    ? 'Tốt! Cố gắng thêm một chút'
                    : 'Cần cải thiện hiệu suất'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Tips */}
      <div className="analytics-section">
        <h3>Gợi ý cải thiện</h3>
        <div className="tips-container">
          {stats.overdueTasks > 0 && (
            <div className="tip-item warning">
              <span className="tip-icon">⚠️</span>
              <p>Bạn có {stats.overdueTasks} task quá hạn. Hãy ưu tiên hoàn thành chúng trước!</p>
            </div>
          )}
          
          {stats.completionRate < 50 && (
            <div className="tip-item info">
              <span className="tip-icon">💡</span>
              <p>Thử chia nhỏ task lớn thành các task nhỏ hơn để dễ quản lý.</p>
            </div>
          )}
          
          {stats.averageCompletionTime > 120 && (
            <div className="tip-item info">
              <span className="tip-icon">⏰</span>
              <p>Task của bạn có thể hơi dài. Hãy thử ước tính thời gian chính xác hơn.</p>
            </div>
          )}
          
          {stats.totalTasks > 0 && stats.completionRate >= 80 && (
            <div className="tip-item success">
              <span className="tip-icon">🎉</span>
              <p>Tuyệt vời! Bạn đang quản lý thời gian rất tốt!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};