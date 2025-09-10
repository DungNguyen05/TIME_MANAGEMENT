// services/taskService.ts - Logic xử lý task và thống kê

import type { Task, TaskFormData, TaskStats } from '../types';

export class TaskService {
  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  static createTask(formData: TaskFormData): Task {
    const now = new Date().toISOString();
    
    return {
      id: this.generateId(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      category: formData.category.trim(),
      dueDate: formData.dueDate,
      estimatedTime: formData.estimatedTime,
      completed: false,
      createdAt: now,
      updatedAt: now
    };
  }

  static isOverdue(task: Task): boolean {
    if (task.completed) return false;
    return new Date(task.dueDate) < new Date();
  }

  static sortTasksByPriority(tasks: Task[]): Task[] {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return [...tasks].sort((a, b) => {
      // Completed tasks go to bottom
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // Then by priority
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by due date
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }

  static getTasksByDate(tasks: Task[], date: string): Task[] {
    return tasks.filter(task => task.dueDate.startsWith(date));
  }

  static calculateStats(tasks: Task[]): TaskStats {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const overdueTasks = tasks.filter(task => this.isOverdue(task)).length;
    
    // Calculate average completion time
    const completedTasksWithTime = tasks.filter(task => 
      task.completed && task.actualTime
    );
    const averageCompletionTime = completedTasksWithTime.length > 0
      ? completedTasksWithTime.reduce((sum, task) => sum + (task.actualTime || 0), 0) / completedTasksWithTime.length
      : 0;

    // Productivity by category
    const categoryStats = tasks.reduce((acc, task) => {
      const category = task.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = { total: 0, completed: 0 };
      }
      acc[category].total++;
      if (task.completed) {
        acc[category].completed++;
      }
      return acc;
    }, {} as Record<string, { total: number; completed: number }>);

    const productivityByCategory = Object.entries(categoryStats).reduce((acc, [category, stats]) => {
      acc[category] = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
      return acc;
    }, {} as Record<string, number>);

    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return {
      totalTasks,
      completedTasks,
      overdueTasks,
      averageCompletionTime,
      productivityByCategory,
      completionRate
    };
  }

  static formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  static getPriorityColor(priority: Task['priority']): string {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  }
}