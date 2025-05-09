import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TaskManagerApp() {
  const [activeTab, setActiveTab] = useState('add');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [completedTask, setCompletedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks', err);
    }
  };

  const handleAdd = async () => {
    if (!title.trim()) {
      alert('Title is required');
      return;
    }

    try {
      await axios.post('http://localhost:5000/tasks', { title, description });
      alert('Task added!');
      setTitle('');
      setDescription('');
      fetchTasks(); // Refresh list
    } catch (err) {
      alert('Error adding task');
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      alert('Error deleting task');
      console.error(err);
    }
  };

  const markAsComplete = async (id, taskTitle) => {
    try {
      await axios.put(`http://localhost:5000/tasks/${id}`, { completed: true });
      setCompletedTask(taskTitle);
      setShowModal(true);
      fetchTasks();
    } catch (err) {
      alert('Error marking task as complete');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '50px auto', fontFamily: 'Arial' }}>
      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px', gap: '10px' }}>
        {['add', 'manage', 'list'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 30px',
              backgroundColor: activeTab === tab ? '#007BFF' : '#e0e0e0',
              color: activeTab === tab ? '#fff' : '#000',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '16px',
              textTransform: 'capitalize',
            }}
          >
            {tab} Tasks
          </button>
        ))}
      </div>

      {/* Add Task */}
      {activeTab === 'add' && (
        <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Add New Task</h2>
          <input
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '16px' }}
          />
          <textarea
            placeholder="Enter task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '16px', minHeight: '100px' }}
          />
          <button
            onClick={handleAdd}
            style={{ width: '100%', backgroundColor: '#007BFF', color: '#fff', padding: '12px', borderRadius: '6px', border: 'none', fontSize: '16px', cursor: 'pointer' }}
          >
            Add Task
          </button>
        </div>
      )}

      {/* Manage Tasks */}
      {activeTab === 'manage' && (
        <div>
          {tasks.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#555' }}>No tasks available</p>
          ) : (
            tasks.map(task => (
              <div
                key={task.id}
                style={{
                  backgroundColor: '#f9f9f9',
                  padding: '20px',
                  marginBottom: '15px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                }}
              >
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p style={{ fontWeight: 'bold', color: task.completed ? '#4CAF50' : '#F44336' }}>
                  Status: {task.completed ? '✅ Completed' : '❌ Incomplete'}
                </p>
                <div>
                  {!task.completed && (
                    <button
                      onClick={() => markAsComplete(task.id, task.title)}
                      style={{ backgroundColor: '#4CAF50', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}
                    >
                      Mark as Complete
                    </button>
                  )}
                  <button
                    onClick={() => deleteTask(task.id)}
                    style={{ backgroundColor: '#F44336', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* List Tasks */}
      {activeTab === 'list' && (
        <div>
          {tasks.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#777' }}>No tasks to show</p>
          ) : (
            tasks.map(task => (
              <div
                key={task.id}
                style={{ backgroundColor: '#fefefe', padding: '20px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
              >
                <h4 style={{ marginBottom: '5px' }}>{task.title}</h4>
                <p style={{ marginBottom: '5px' }}>{task.description}</p>
                <span style={{ fontWeight: 'bold', color: task.completed ? '#2E7D32' : '#C62828' }}>
                  {task.completed ? '✅ Completed' : '❌ Incomplete'}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Completion Modal */}
      {showModal && completedTask && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '30px',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            }}
          >
            <h3>🎉 Task "{completedTask}" marked as complete!</h3>
            <button
              onClick={() => setShowModal(false)}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#007BFF',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
