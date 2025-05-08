import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AddTaskPage from './pages/AddTaskPage';
import TaskListPage from './pages/TaskListPage';
import ManageTasksPage from './pages/ManageTasksPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AddTaskPage />} />
        <Route path="/list" element={<TaskListPage />} />
        <Route path="/manage" element={<ManageTasksPage />} />
      </Routes>
    </Router>
  );
}
