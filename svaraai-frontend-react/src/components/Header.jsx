import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Header() {
  const [token, setToken] = useState(null);
  const nav = useNavigate();
  useEffect(() => { setToken(localStorage.getItem('token')); }, []);
  const logout = () => { localStorage.removeItem('token'); nav('/login'); };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand"><Link to="/" className="brand-link">SvaraAI</Link></div>
        <nav className="nav">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/projects" className="nav-link">Projects</Link>
          {token ? <button className="nav-btn" onClick={logout}><div className="nav-link" style={{fontSize : "16px"}}>Logout</div></button> : <Link to="/login" className="nav-link">Login</Link>}
        </nav>
      </div>
    </header>
  );
}
