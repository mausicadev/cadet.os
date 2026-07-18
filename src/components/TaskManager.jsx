import React, { useState } from 'react';
import '../css/taskmanager.css';

export default function TaskManager({ tasks = [], setTasks }) {
  const [newTask, setNewTask] = useState('');

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: newTask.toUpperCase(),
        done: false
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

  const doneCount = tasks.filter(t => t.done).length;

  return (
    <div className="task-app-simple">
      <div className="task-header-bar">
        <span className="task-title">TASKS</span>
        <span className="task-count">{doneCount}/{tasks.length}</span>
      </div>

      <div className="task-list">
        {tasks.length === 0 ? (
          <div className="task-empty">NO TASKS</div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className={`task-row ${task.done ? 'done' : ''}`}>
              <div className="task-left" onClick={() => toggle(task.id)}>
                <span className={`task-check ${task.done ? 'checked' : ''}`}>
                  {task.done ? '✕' : ''}
                </span>
                <span className="task-text">{task.text}</span>
              </div>
              <button className="task-del" onClick={() => remove(task.id)}>×</button>
            </div>
          ))
        )}
      </div>

      <form onSubmit={addTask} className="task-add-row">
        <span className="task-prompt">›</span>
        <input
          type="text"
          placeholder="NEW TASK..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="task-input"
        />
      </form>
    </div>
  );
}
