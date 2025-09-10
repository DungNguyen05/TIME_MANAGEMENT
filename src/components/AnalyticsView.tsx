// components/AnalyticsView.tsx - Clean analytics display

import React from 'react';
import type { Task } from '../types';
import { TaskService } from '../services/taskService';

interface AnalyticsViewProps {
  tasks: Task[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ tasks }) => {
  const stats = TaskService.calculateStats(tasks);

  const getProgressBarColor = (percentage: number): string => {
    if (percentage >= 80) return '#16a34a';
    if (percentage >= 60) return '#f59e0b';
    return '#dc2626';
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
          <div className="stat-icon">ALL</div>
          <div className="stat-content">
            <h3>Total Tasks</h3>
            <div className="stat-number">{stats.totalTasks}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#16a34a' }}>✓</div>
          <div className="stat-content">
            <h3>Completed</h3>
            <div className="stat-number">{stats.completedTasks}</div>
            <div className="stat-subtitle">
              {stats.completionRate.toFixed(1)}% completion rate
            </div>
          </div>
        </div>

        <div className="stat-card overdue">
          <div className="stat-icon" style={{ backgroundColor: '#dc2626' }}>!</div>
          <div className="stat-content">
            <h3>Overdue</h3>
            <div className="stat-number">{stats.overdueTasks}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f59e0b' }}>T</div>
          <div className="stat-content">
            <h3>Avg Time</h3>
            <div className="stat-number">
              {TaskService.formatTime(Math.round(stats.averageCompletionTime))}
            </div>
            <div className="stat-subtitle">per task</div>
          </div>
        </div>
      </div>

      {/* Productivity by Category */}
      <div className="analytics-section">
        <h3>Productivity by Category</h3>
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
            <p>No data to analyze yet. Create some tasks to see your productivity stats!</p>
          </div>
        )}
      </div>

      {/* Quick Insights */}
      <div className="analytics-section">
        <h3>Quick Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">📊</div>
            <div className="insight-content">
              <h4>This Week</h4>
              <p>{recentTasks} tasks created in the last 7 days</p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon">⏰</div>
            <div className="insight-content">
              <h4>Upcoming</h4>
              <p>{upcomingTasks} tasks due within 3 days</p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon">🎯</div>
            <div className="insight-content">
              <h4>Performance</h4>
              <p>
                {stats.completionRate >= 80 
                  ? 'Excellent! Keep it up!' 
                  : stats.completionRate >= 60 
                    ? 'Good! Room for improvement'
                    : 'Need to focus more'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Tips */}
      <div className="analytics-section">
        <h3>Recommendations</h3>
        <div className="tips-container">
          {stats.overdueTasks > 0 && (
            <div className="tip-item warning">
              <div className="tip-icon">!</div>
              <p>You have {stats.overdueTasks} overdue tasks. Consider prioritizing them first!</p>
            </div>
          )}
          
          {stats.completionRate < 50 && (
            <div className="tip-item info">
              <div className="tip-icon">💡</div>
              <p>Try breaking down large tasks into smaller, manageable pieces.</p>
            </div>
          )}
          
          {stats.averageCompletionTime > 120 && (
            <div className="tip-item info">
              <div className="tip-icon">⏱</div>
              <p>Your tasks might be too long. Consider more accurate time estimation.</p>
            </div>
          )}
          
          {stats.totalTasks > 0 && stats.completionRate >= 80 && (
            <div className="tip-item success">
              <div className="tip-icon">✓</div>
              <p>Great job! You're managing your time very well!</p>
            </div>
          )}

          {stats.totalTasks === 0 && (
            <div className="tip-item info">
              <div className="tip-icon">📝</div>
              <p>Start by creating your first task to begin tracking your productivity.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};