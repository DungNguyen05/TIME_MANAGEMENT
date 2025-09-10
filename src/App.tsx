// src/App.tsx - Component chính của ứng dụng

import { useState, useEffect } from 'react';
import type { Task, TaskFormData, ViewMode } from './types';
import { StorageService } from './services/storage';
import { TaskService } from './services/taskService';
import { TaskForm } from './components/TaskForm';
import { TaskListView } from './components/TaskListView';
import { CalendarView } from './components/CalendarView';
import { AnalyticsView } from './components/AnalyticsView';
import './App.css';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentView, setCurrentView] = useState<ViewMode>('list');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Load tasks from storage on mount
  useEffect(() => {
    const savedTasks = StorageService.getTasks();
    setTasks(savedTasks);
  }, []);

  // Save tasks to storage whenever tasks change
  useEffect(() => {
    StorageService.saveTasks(tasks);
  }, [tasks]);

  const handleCreateTask = (formData: TaskFormData) => {
    const newTask = TaskService.createTask(formData);
    setTasks(prev => [...prev, newTask]);
    setShowForm(false);
  };

  const handleUpdateTask = (formData: TaskFormData) => {
    if (!editingTask) return;
    
    const updatedTask = {
      ...editingTask,
      ...formData,
      updatedAt: new Date().toISOString()
    };
    
    setTasks(prev => prev.map(task => 
      task.id === editingTask.id ? updatedTask : task
    ));
    
    setEditingTask(null);
    setShowForm(false);
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const now = new Date().toISOString();
        return {
          ...task,
          completed: !task.completed,
          updatedAt: now,
          // If completing for first time, set actual time to estimated time
          actualTime: !task.completed && !task.actualTime ? task.estimatedTime : task.actualTime
        };
      }
      return task;
    }));
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Bạn có chắc muốn xóa task này?')) {
      setTasks(prev => prev.filter(task => task.id !== taskId));
    }
  };

  const handleTaskClick = (_task: Task) => {
    // When clicking task in calendar view, switch to list view and highlight
    setCurrentView('list');
  };

  const getViewIcon = (view: ViewMode) => {
    switch (view) {
      case 'list': return '📋';
      case 'calendar': return '📅';
      case 'analytics': return '📊';
    }
  };

  const getViewTitle = (view: ViewMode) => {
    switch (view) {
      case 'list': return 'Danh sách';
      case 'calendar': return 'Lịch';
      case 'analytics': return 'Thống kê';
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1>📚 Smart Todo</h1>
          <p>Quản lý thời gian thông minh cho sinh viên</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="app-nav">
        <div className="nav-views">
          {(['list', 'calendar', 'analytics'] as ViewMode[]).map(view => (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              className={`nav-button ${currentView === view ? 'active' : ''}`}
            >
              <span className="nav-icon">{getViewIcon(view)}</span>
              <span className="nav-label">{getViewTitle(view)}</span>
            </button>
          ))}
        </div>

        <button 
          onClick={() => setShowForm(true)}
          className="btn-primary add-task-btn"
        >
          <span>➕</span>
          <span>Thêm Task</span>
        </button>
      </nav>


      {/* Main Content */}
      <main className="app-main">
        <div className="view-header">
          <h2>
            <span className="view-icon">{getViewIcon(currentView)}</span>
            {getViewTitle(currentView)}
          </h2>
          
          {currentView === 'list' && (
            <div className="view-stats">
              <span>{tasks.filter(t => !t.completed).length} đang làm</span>
              <span>{tasks.filter(t => t.completed).length} hoàn thành</span>
              <span>{tasks.filter(t => TaskService.isOverdue(t)).length} quá hạn</span>
            </div>
          )}
        </div>

        <div className="view-content">
          {currentView === 'list' && (
            <TaskListView
              tasks={tasks}
              onToggleComplete={handleToggleComplete}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          )}

          {currentView === 'calendar' && (
            <CalendarView
              tasks={tasks}
              onTaskClick={handleTaskClick}
            />
          )}

          {currentView === 'analytics' && (
            <AnalyticsView tasks={tasks} />
          )}
        </div>
      </main>

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          task={editingTask || undefined}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}

export default App;