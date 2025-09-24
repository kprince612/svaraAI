import { useState } from 'react';
import api from '../api';
import Button from '../components/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <div className="card auth-card">
        <h2>Login</h2>
        <form className="form" onSubmit={submit}>
          <label className="label">Email</label>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label className="label">Password</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="actions">
            <Button type="submit" disabled={loading}>{loading ? 'Logging in…' : 'Login'}</Button>
          </div>
        </form>

        <div className="auth-footer" style={{ marginTop: 12, textAlign: 'center' }}>
<span>Don't have an account? </span>
<a href="/signup" className="link" aria-disabled={loading} onClick={(e) => loading && e.preventDefault()}>Create account</a>
</div>
      </div>
    </div>
  );
}
