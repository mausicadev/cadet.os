import React, { useState } from 'react';
import '../css/taskmanager.css';

export default function TaskManager() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'FINISH THE PENTAGON', done: false },
    { id: 2, text: 'BUILD ANOTHER PC', done: false },
    { id: 3, text: 'INSTALL WINDOWS', done: true },
    { id: 4, text: 'REVIEW THE DRONE', done: false },
    { id: 5, text: 'POST THE VIDEO', done: false },
  ]);
  const [newTask, setNewTask] = useState('');

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTask.toUpperCase(), done: false }]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="task-container">
      <div className="task-window">
        <h1 className="task-header">TASK FOR TODAY</h1>
        <div className="task-list">
          {tasks.map(task => (
            <div key={task.id} className={`task-item ${task.done ? 'done' : ''}`}>
              <span className="task-text" onClick={() => toggleTask(task.id)}>
                {task.done ? '[X]' : '[ ]'} {task.text}
              </span>
              <button className="task-delete" onClick={() => removeTask(task.id)}>DEL</button>
            </div>
          ))}
        </div>
        <form onSubmit={addTask} className="task-form">
          <span className="prompt">&gt;</span>
          <input 
            type="text" 
            placeholder="NEW TASK..." 
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="task-input"
          />
        </form>
      </div>
    </div>
  );
}
