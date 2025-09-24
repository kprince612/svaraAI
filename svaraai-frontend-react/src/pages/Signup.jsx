import { useState } from 'react';
import api from '../api';
import Button from '../components/Button';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/signup', { email, password, name });
      alert('Signup successful — please login');
      window.location.href = '/login';
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <div className="card auth-card">
        <h2>Create account</h2>
        <form className="form" onSubmit={submit}>
          <label className="label">Name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          <label className="label">Email</label>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label className="label">Password</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="actions">
            <Button type="submit" disabled={loading}>{loading ? 'Creating…' : 'Sign up'}</Button>
          </div>

          <div className="auth-footer" style={{ marginTop: 12, textAlign: 'center' }}>
<span>Already have an account? </span>
<a href="/login" className="login-link" style={{ textDecoration: 'underline' }}>Log in</a>
</div>
        </form>
      </div>
    </div>
  );
}
