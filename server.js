const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace with your MySQL user
  password: 'root', // Replace with your MySQL password
  database: 'tasks_db' // Replace with your MySQL database
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Create task
app.post('/tasks', (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const sql = 'INSERT INTO tasks (title, description) VALUES (?, ?)';
  db.query(sql, [title, description], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    const newTask = {
      id: result.insertId,
      title,
      description,
      completed: false,
      created_at: new Date().toISOString()
    };
    res.status(201).json(newTask);
  });
});

// Get all tasks
app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.status(200).json(results);
  });
});

// ✅ Updated task route: only update "completed"
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  const sql = 'UPDATE tasks SET completed = ? WHERE id = ?';
  db.query(sql, [completed, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Task not found' });

    res.status(200).json({ message: 'Task marked as completed', id, completed });
  });
});

// Delete task
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM tasks WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Task not found' });
    res.status(204).send();
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
