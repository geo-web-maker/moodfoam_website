import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(username, password);
      navigate(location.state?.from?.pathname || '/admin', { replace: true });
    } catch {
      setError('Incorrect username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: 420 }}>
        <span className="eyebrow">Staff Access</span>
        <h1 style={{ marginBottom: 24 }}>Admin Login</h1>
        <form className="admin-form" onSubmit={handleSubmit}>
          {error && <p className="admin-form__error">{error}</p>}
          <label>
            Username
            <input value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <button className="btn btn--coral btn--block" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p style={{ marginTop: 20, fontSize: '0.85rem' }}>
          <Link to="/">&larr; Back to the site</Link>
        </p>
      </div>
    </section>
  );
}
