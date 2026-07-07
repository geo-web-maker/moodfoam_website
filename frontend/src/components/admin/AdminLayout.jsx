import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './admin.css';

export default function AdminLayout() {
  const { username, signOut } = useAuth();

  return (
    <div className="admin">
      <aside className="admin__sidebar">
        <Link to="/" className="admin__brand">
          <img src="/logo.png" alt="Mood Foam Mattresses" className="nav__brand-logo" />
          <span>Admin</span>
        </Link>
        <nav className="admin__nav">
          <NavLink to="/admin" end>Dashboard</NavLink>
          <NavLink to="/admin/products">Products</NavLink>
          <NavLink to="/admin/categories">Categories</NavLink>
          <NavLink to="/admin/messages">Messages</NavLink>
        </nav>
        <div className="admin__sidebar-footer">
          <p>Signed in as<br /><strong>{username}</strong></p>
          <button className="btn btn--outline btn--sm btn--block" onClick={signOut}>Sign out</button>
          <Link to="/" className="admin__view-site">View live site &rarr;</Link>
        </div>
      </aside>
      <main className="admin__content">
        <Outlet />
      </main>
    </div>
  );
}
