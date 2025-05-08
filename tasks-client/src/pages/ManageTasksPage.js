import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ManageTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);  // State to show/hide the modal
  const [completedTask, setCompletedTask] = useState(null);  // To store the task marked as complete

  const fetchTasks = () => {
    axios.get('http://localhost:5000/tasks').then(res => setTasks(res.data));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
    fetchTasks();
  };

  const markAsComplete = async (id, title) => {
    try {
      await axios.put(`http://localhost:5000/tasks/${id}`, { completed: true });
      setCompletedTask(title); // Show the task title in modal
      setShowModal(true); // Trigger the modal
      fetchTasks(); // Refresh the list
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
      alert('Error marking task as complete');
    }
  };
  
  const closeModal = () => {
    setShowModal(false); // Close the modal
  };

  return (
    <div
      style={{
        padding: '40px',
        maxWidth: '800px',
        margin: '50px auto',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
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
        Manage Tasks
      </h2>
      {tasks.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>No tasks available</p>
      ) : (
        tasks.map(task => (
          <div
            key={task.id}
            style={{
              border: '1px solid #ddd',
              padding: '20px',
              marginBottom: '15px',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#f1f1f1')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#f9f9f9')}
          >
            <div
              style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#333',
              }}
            >
              {task.title}
            </div>
            <div
              style={{
                fontSize: '14px',
                color: '#666',
                marginBottom: '15px',
              }}
            >
              {task.description}
            </div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: task.completed ? '#4CAF50' : '#F44336',
                marginBottom: '15px',
              }}
            >
              Status: {task.completed ? '✅ Completed' : '❌ Incomplete'}
            </div>
            <div>
              {!task.completed && (
                <button
                  onClick={() =>markAsComplete(task.id, task.title)}
                  style={{
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#388E3C')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = '#4CAF50')}
                >
                  Mark as Complete
                </button>
              )}
              <button
                onClick={() => deleteTask(task.id)}
                style={{
                  backgroundColor: '#F44336',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '5px',
                  marginLeft: '10px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#e53935')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = '#F44336')}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}

      {/* Modal to show task completion message */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px 40px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
            }}
          >
            <h3 style={{ fontSize: '20px', color: '#333' }}>
              Task "{completedTask}" is marked as complete!
            </h3>
            <button
              onClick={closeModal}
              style={{
                backgroundColor: '#4CAF50',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                marginTop: '10px',
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
