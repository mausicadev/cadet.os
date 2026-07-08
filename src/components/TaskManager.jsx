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
  const [newCat, setNewCat] = useState('tech');
  const [filter, setFilter] = useState('ALL'); 

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: newTask.toUpperCase(),
        done: false,
        category: newCat
      }
    ]);
    setNewTask('');
  };

  const toggle = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const remove = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // statistici simple pt task-uri
  const total = tasks.length;
  const doneCount = tasks.filter(t => t.done).length;
  const progress = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  const visible = tasks.filter(task => {
    if (filter === 'ACTIVE') return !task.done;
    if (filter === 'COMPLETED') return task.done;
    return true;
  });

  return (
    <div className="task-manager-app">
      {/* sidebar cu filtre */}
      <div className="task-sidebar">
        <div className="sidebar-title">TASK FILTERS</div>
        <div className="filter-list">
          <button
            className={`filter-btn ${filter === 'ALL' ? 'active glow-orange' : ''}`}
            onClick={() => setFilter('ALL')}
          >
            <span className="filter-bullet">»</span> ALL TASKS ({tasks.length})
          </button>
          <button
            className={`filter-btn ${filter === 'ACTIVE' ? 'active glow-orange' : ''}`}
            onClick={() => setFilter('ACTIVE')}
          >
            <span className="filter-bullet">»</span> ACTIVE ({tasks.filter(t => !t.done).length})
          </button>
          <button
            className={`filter-btn ${filter === 'COMPLETED' ? 'active glow-orange' : ''}`}
            onClick={() => setFilter('COMPLETED')}
          >
            <span className="filter-bullet">»</span> COMPLETED ({doneCount})
          </button>
        </div>

        <div className="completion-stats">
          <div className="stats-label">
            <span>CORE PROGRESS</span>
            <span className="glow-orange">{progress}%</span>
          </div>
          <div className="stats-bar">
            <div className="stats-progress glow-orange-shadow" style={{ width: `${progress}%` }} />
          </div>
          <div className="stats-details">
            <div className="stats-row">
              <span>TOTAL NODES</span>
              <span>{total}</span>
            </div>
            <div className="stats-row">
              <span>SOLVED</span>
              <span className="glow-cyan">{doneCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* lista de task-uri */}
      <div className="task-content-pane">
        <div className="task-list-header">
          <span>TASK FOR TODAY</span>
          <span className="header-status-badge glow-orange">NOMINAL</span>
        </div>

        <div className="tasks-scroll-list">
          {visible.length === 0 ? (
            <div className="no-tasks">NO MATCHING TASKS FOUND</div>
          ) : (
            visible.map(task => (
              <div key={task.id} className={`task-list-item ${task.done ? 'task-done' : ''}`}>
                <div className="task-left-section" onClick={() => toggle(task.id)}>
                  <div className={`task-checkbox ${task.done ? 'checked glow-cyan-border' : ''}`}>
                    {task.done ? '✕' : ''}
                  </div>
                  <span className="task-item-text">{task.text}</span>
                </div>
                <div className="task-right-section">
                  <span className={`task-category-tag tag-${task.category}`}>{task.category}</span>
                  <button className="task-item-delete glow-orange" onClick={() => remove(task.id)}>
                    DEL
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* form pt task nou */}
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
                className={`tag-select-btn ${newCat === cat ? 'active' : ''}`}
                onClick={() => setNewCat(cat)}
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
