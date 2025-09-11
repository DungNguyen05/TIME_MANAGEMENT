// components/AnalyticsView.tsx - Hiển thị thống kê và phân tích (Desktop Web-focused)

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

  const priorityStats = {
    high: tasks.filter(t => t.priority === 'high').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    low: tasks.filter(t => t.priority === 'low').length,
  };

  const getPerformanceMessage = (rate: number): string => {
    if (rate >= 90) return '🌟 Outstanding! You\'re a productivity superstar!';
    if (rate >= 80) return '🎯 Excellent work! Keep up the great momentum!';
    if (rate >= 70) return '👍 Good job! You\'re doing well with your tasks.';
    if (rate >= 60) return '📈 Not bad! There\'s room for improvement.';
    if (rate >= 40) return '⚡ You can do better! Focus on completing more tasks.';
    return '🚀 Time to boost your productivity! Start with small tasks.';
  };

  if (stats.totalTasks === 0) {
    return (
      <div className="empty-analytics">
        <h3>📊 No data to analyze yet</h3>
        <p>Create some tasks to see detailed analytics and insights about your productivity!</p>
        <div style={{marginTop: '2rem', padding: '1.5rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0'}}>
          <h4 style={{color: '#166534', marginBottom: '1rem'}}>💡 Getting Started Tips:</h4>
          <ul style={{color: '#166534', lineHeight: '1.6', paddingLeft: '1.5rem'}}>
            <li>Start by creating 3-5 tasks for today</li>
            <li>Use different categories (Study, Work, Personal)</li>
            <li>Set realistic time estimates</li>
            <li>Mark tasks as complete when done</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-view">
      {/* Performance Overview */}
      <div className="analytics-section" style={{marginBottom: '2rem'}}>
        <h3>🎯 Performance Overview</h3>
        <div style={{
          padding: '1.5rem',
          background: stats.completionRate >= 70 ? 'linear-gradient(135deg, #f0fdf4, #dcfce7)' : 
                      stats.completionRate >= 50 ? 'linear-gradient(135deg, #fffbeb, #fef3c7)' : 
                      'linear-gradient(135deg, #fef2f2, #fecaca)',
          borderRadius: '8px',
          textAlign: 'center',
          border: '2px solid',
          borderColor: stats.completionRate >= 70 ? '#10b981' : 
                      stats.completionRate >= 50 ? '#f59e0b' : '#ef4444'
        }}>
          <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>
            {stats.completionRate.toFixed(1)}%
          </div>
          <div style={{fontWeight: '600', marginBottom: '0.5rem'}}>
            {getPerformanceMessage(stats.completionRate)}
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <h3>📝 Total Tasks</h3>
            <div className="stat-number">{stats.totalTasks}</div>
            <div className="stat-subtitle">All time</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <h3>✅ Completed</h3>
            <div className="stat-number">{stats.completedTasks}</div>
            <div className="stat-subtitle">
              {stats.completionRate.toFixed(1)}% completion rate
            </div>
          </div>
        </div>

        <div className="stat-card overdue">
          <div className="stat-content">
            <h3>⚠️ Overdue</h3>
            <div className="stat-number">{stats.overdueTasks}</div>
            <div className="stat-subtitle">Need attention</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <h3>⏱️ Avg Time</h3>
            <div className="stat-number">
              {TaskService.formatTime(Math.round(stats.averageCompletionTime))}
            </div>
            <div className="stat-subtitle">per task</div>
          </div>
        </div>
      </div>

      {/* Priority Distribution */}
      <div className="analytics-section">
        <h3>🎯 Task Priority Distribution</h3>
        <div className="stats-grid">
          <div className="stat-card" style={{borderColor: '#ef4444'}}>
            <div className="stat-content">
              <h3>🔴 High Priority</h3>
              <div className="stat-number">{priorityStats.high}</div>
              <div className="stat-subtitle">
                {stats.totalTasks > 0 ? ((priorityStats.high / stats.totalTasks) * 100).toFixed(1) : 0}%
              </div>
            </div>
          </div>
          
          <div className="stat-card" style={{borderColor: '#f59e0b'}}>
            <div className="stat-content">
              <h3>🟡 Medium Priority</h3>
              <div className="stat-number">{priorityStats.medium}</div>
              <div className="stat-subtitle">
                {stats.totalTasks > 0 ? ((priorityStats.medium / stats.totalTasks) * 100).toFixed(1) : 0}%
              </div>
            </div>
          </div>
          
          <div className="stat-card" style={{borderColor: '#10b981'}}>
            <div className="stat-content">
              <h3>🟢 Low Priority</h3>
              <div className="stat-number">{priorityStats.low}</div>
              <div className="stat-subtitle">
                {stats.totalTasks > 0 ? ((priorityStats.low / stats.totalTasks) * 100).toFixed(1) : 0}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Productivity by Category */}
      <div className="analytics-section">
        <h3>📂 Productivity by Category</h3>
        <div className="category-stats">
          {Object.entries(stats.productivityByCategory).map(([category, percentage]) => (
            <div key={category} className="category-item">
              <div className="category-header">
                <span className="category-name">📁 {category}</span>
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
            <p>📂 No categories found. Create tasks with different categories to see productivity breakdown.</p>
          </div>
        )}
      </div>

      {/* Quick Insights */}
      <div className="analytics-section">
        <h3>💡 Quick Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-content">
              <h4>📈 Recent Activity</h4>
              <p>{recentTasks} tasks created in the last 7 days</p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-content">
              <h4>⏰ Upcoming Deadlines</h4>
              <p>{upcomingTasks} tasks due in the next 3 days</p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-content">
              <h4>🎯 Performance Status</h4>
              <p>
                {stats.completionRate >= 80 
                  ? '🌟 Excellent! You\'re highly productive!' 
                  : stats.completionRate >= 60 
                    ? '👍 Good work! Room for improvement'
                    : '🚀 Focus needed on completing tasks'
                }
              </p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-content">
              <h4>📊 Task Balance</h4>
              <p>
                {priorityStats.high > priorityStats.low + priorityStats.medium 
                  ? '⚠️ Many high-priority tasks - consider delegating'
                  : priorityStats.low > priorityStats.high + priorityStats.medium
                    ? '✅ Good balance - mostly manageable tasks'
                    : '⚖️ Balanced priority distribution'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Recommendations */}
      <div className="analytics-section">
        <h3>🧠 Smart Recommendations</h3>
        <div className="tips-container">
          {stats.overdueTasks > 0 && (
            <div className="tip-item warning">
              <p>⚠️ <strong>Overdue Alert:</strong> You have {stats.overdueTasks} overdue tasks. Consider prioritizing them to get back on track and avoid stress buildup.</p>
            </div>
          )}
          
          {stats.completionRate < 50 && stats.totalTasks > 3 && (
            <div className="tip-item info">
              <p>📝 <strong>Task Management Tip:</strong> Try breaking down large tasks into smaller, more manageable subtasks. This can improve your completion rates significantly.</p>
            </div>
          )}
          
          {stats.averageCompletionTime > 120 && stats.completedTasks > 2 && (
            <div className="tip-item info">
              <p>⏱️ <strong>Time Estimation:</strong> Your tasks are taking longer than expected. Consider more accurate time estimation or breaking complex tasks into smaller parts.</p>
            </div>
          )}
          
          {stats.totalTasks > 0 && stats.completionRate >= 80 && (
            <div className="tip-item success">
              <p>🌟 <strong>Outstanding Performance:</strong> You're managing your time very effectively! Keep up the great momentum and consider sharing your strategies with fellow students.</p>
            </div>
          )}

          {recentTasks === 0 && stats.totalTasks > 0 && (
            <div className="tip-item info">
              <p>📅 <strong>Stay Active:</strong> You haven't created any tasks recently. Consider planning your upcoming work to maintain your productivity momentum.</p>
            </div>
          )}

          {priorityStats.high > 5 && (
            <div className="tip-item warning">
              <p>🔴 <strong>Priority Overload:</strong> You have many high-priority tasks. Consider if some can be rescheduled or if you need to focus on fewer important items.</p>
            </div>
          )}

          {stats.totalTasks >= 10 && stats.completionRate >= 70 && (
            <div className="tip-item success">
              <p>🎯 <strong>Productivity Master:</strong> Great job maintaining high productivity with multiple tasks! You're developing excellent time management skills.</p>
            </div>
          )}
        </div>
      </div>

      {/* Study Tips for Vietnamese Students */}
      <div className="analytics-section">
        <h3>🎓 Study Tips for Vietnamese Students</h3>
        <div className="tips-container">
          <div className="tip-item info">
            <p>📚 <strong>Pomodoro Technique:</strong> Work for 25 minutes, then take a 5-minute break. This helps maintain focus during long study sessions.</p>
          </div>
          
          <div className="tip-item info">
            <p>👥 <strong>Group Study:</strong> Form study groups with classmates. Teaching others helps reinforce your own learning.</p>
          </div>
          
          <div className="tip-item info">
            <p>📝 <strong>Active Note-taking:</strong> Use mind maps and visual diagrams to organize complex information, especially for subjects like history and literature.</p>
          </div>
          
          <div className="tip-item success">
            <p>⚖️ <strong>Work-Life Balance:</strong> Remember to schedule time for family, friends, and personal interests. A balanced life leads to better academic performance.</p>
          </div>
        </div>
      </div>
    </div>
  );
};