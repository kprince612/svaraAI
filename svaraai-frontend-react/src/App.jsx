import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Kanban from './pages/Kanban';
import Layout from './components/Layout';

function RequireAuth({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  return children;
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/dashboard' element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path='/projects' element={<RequireAuth><Projects /></RequireAuth>} />
        <Route path='/projects/:id/kanban' element={<RequireAuth><Kanban /></RequireAuth>} />
      </Routes>
    </Layout>
  );
}
