import React, { useState } from 'react';
import '../css/taskmanager.css';

export default function TaskManager() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'FINISH THE PENTAGON', done: false, category: 'military' },
    { id: 2, text: 'BUILD ANOTHER PC', done: false, category: 'tech' },
    { id: 3, text: 'INSTALL WINDOWS', done: true, category: 'tech' },
    { id: 4, text: 'REVIEW THE DRONE', done: false, category: 'military' },
    { id: 5, text: 'POST THE VIDEO', done: false, category: 'media' },
  ]);
  const [newTask, setNewTask] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('tech');
  const [activeFilter, setActiveFilter] = useState('ALL'); // ALL, ACTIVE, COMPLETED

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: newTask.toUpperCase(),
        done: false,
        category: newTaskCategory
      }
    ]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Calculations for Stats Panel
  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.done).length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'ACTIVE') return !task.done;
    if (activeFilter === 'COMPLETED') return task.done;
    return true;
  });

  return (
    <div className="task-manager-app">
      {/* Sidebar - Category Filters and Completion stats */}
      <div className="task-sidebar">
        <div className="sidebar-title">TASK FILTERS</div>
        <div className="filter-list">
          <button
            className={`filter-btn ${activeFilter === 'ALL' ? 'active glow-orange' : ''}`}
            onClick={() => setActiveFilter('ALL')}
          >
            <span className="filter-bullet">»</span> ALL TASKS ({tasks.length})
          </button>
          <button
            className={`filter-btn ${activeFilter === 'ACTIVE' ? 'active glow-orange' : ''}`}
            onClick={() => setActiveFilter('ACTIVE')}
          >
            <span className="filter-bullet">»</span> ACTIVE ({tasks.filter(t => !t.done).length})
          </button>
          <button
            className={`filter-btn ${activeFilter === 'COMPLETED' ? 'active glow-orange' : ''}`}
            onClick={() => setActiveFilter('COMPLETED')}
          >
            <span className="filter-bullet">»</span> COMPLETED ({completedCount})
          </button>
        </div>

        <div className="completion-stats">
          <div className="stats-label">
            <span>CORE PROGRESS</span>
            <span className="glow-orange">{completionRate}%</span>
          </div>
          <div className="stats-bar">
            <div className="stats-progress glow-orange-shadow" style={{ width: `${completionRate}%` }} />
          </div>
          <div className="stats-details">
            <div className="stats-row">
              <span>TOTAL NODES</span>
              <span>{totalCount}</span>
            </div>
            <div className="stats-row">
              <span>SOLVED</span>
              <span className="glow-cyan">{completedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Task list & form */}
      <div className="task-content-pane">
        <div className="task-list-header">
          <span>TASK FOR TODAY</span>
          <span className="header-status-badge glow-orange">NOMINAL</span>
        </div>

        <div className="tasks-scroll-list">
          {filteredTasks.length === 0 ? (
            <div className="no-tasks">NO MATCHING TASKS FOUND</div>
          ) : (
            filteredTasks.map(task => (
              <div key={task.id} className={`task-list-item ${task.done ? 'task-done' : ''}`}>
                <div className="task-left-section" onClick={() => toggleTask(task.id)}>
                  <div className={`task-checkbox ${task.done ? 'checked glow-cyan-border' : ''}`}>
                    {task.done ? '✕' : ''}
                  </div>
                  <span className="task-item-text">{task.text}</span>
                </div>
                <div className="task-right-section">
                  <span className={`task-category-tag tag-${task.category}`}>{task.category}</span>
                  <button className="task-item-delete glow-orange" onClick={() => removeTask(task.id)}>
                    DEL
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Form to add tasks */}
        <form onSubmit={addTask} className="task-input-form">
          <div className="input-row">
            <span className="prompt-indicator">&gt;</span>
            <input 
              type="text" 
              placeholder="APPEND NEW COMMAND..." 
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="task-app-input"
            />
          </div>
          <div className="category-select-row">
            <span className="select-label">TAG TYPE:</span>
            {['tech', 'military', 'media'].map(cat => (
              <button
                key={cat}
                type="button"
                className={`tag-select-btn ${newTaskCategory === cat ? 'active' : ''}`}
                onClick={() => setNewTaskCategory(cat)}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}
