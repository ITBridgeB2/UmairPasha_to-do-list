import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function TaskListPage() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/tasks');
        setTasks(res.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        alert('Failed to load tasks');
      }
    };

    fetchTasks();
  }, []);

  return (
    <div
      style={{
        padding: '40px',
        maxWidth: '800px',
        margin: '50px auto',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h2
        style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#333',
          marginBottom: '20px',
          textAlign: 'center',
        }}
      >
        Task List
      </h2>

      {tasks.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>No tasks available.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {tasks.map(task => (
            <li
              key={task.id}
              style={{
                border: '1px solid #ddd',
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '6px',
                backgroundColor: '#fafafa',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div style={{ fontSize: '18px', fontWeight: '500', color: '#333' }}>
                {task.title}
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                {task.description}
              </div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: task.completed ? '#4CAF50' : '#F44336',
                }}
              >
                Status: {task.completed ? '✅ Completed' : '❌ Incomplete'}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
