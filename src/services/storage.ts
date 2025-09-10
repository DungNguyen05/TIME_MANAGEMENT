// services/storage.ts - Xử lý lưu trữ dữ liệu

import type { Task } from '../types';

const STORAGE_KEY = 'smart-todo-tasks';

export class StorageService {
  static getTasks(): Task[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading tasks from storage:', error);
      return [];
    }
  }

  static saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to storage:', error);
    }
  }

  static addTask(task: Task): void {
    const tasks = this.getTasks();
    tasks.push(task);
    this.saveTasks(tasks);
  }

  static updateTask(taskId: string, updates: Partial<Task>): void {
    const tasks = this.getTasks();
    const index = tasks.findIndex(task => task.id === taskId);
    
    if (index !== -1) {
      tasks[index] = { 
        ...tasks[index], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      this.saveTasks(tasks);
    }
  }

  static deleteTask(taskId: string): void {
    const tasks = this.getTasks();
    const filteredTasks = tasks.filter(task => task.id !== taskId);
    this.saveTasks(filteredTasks);
  }

  static clearAllTasks(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}