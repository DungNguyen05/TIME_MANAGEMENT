// types/index.ts - Định nghĩa các kiểu dữ liệu chính

export interface Task {
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    category: string;
    dueDate: string; // ISO string
    estimatedTime: number; // minutes
    actualTime?: number; // minutes
    completed: boolean;
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
  }
  
  export interface TaskFormData {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    category: string;
    dueDate: string;
    estimatedTime: number;
  }
  
  // Error type for form validation
  export interface TaskFormErrors {
    title?: string;
    description?: string;
    priority?: string;
    category?: string;
    dueDate?: string;
    estimatedTime?: string;
  }
  
  export type ViewMode = 'list' | 'calendar' | 'analytics';
  
  export interface TaskStats {
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    averageCompletionTime: number;
    productivityByCategory: Record<string, number>;
    completionRate: number;
  }