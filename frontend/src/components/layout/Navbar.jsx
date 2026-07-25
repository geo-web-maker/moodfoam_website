import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { getCategories } from '../../api';
import './Navbar.css';

const linkClass = ({ isActive }) => `nav__link${isActive ? ' nav__link--active' : ''}`;

export default function Navbar() {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false); // mobile menu
  const [shopOpen, setShopOpen] = useState(false); // desktop dropdown
  const location = useLocation();

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setOpen(false);
    setShopOpen(false);
  }, [location.pathname]);

  return (
    <header className="nav">
      <div className="container nav__bar">
        <Link to="/" className="nav__brand" aria-label="Mood Foam Mattresses home">
          <img src="/logo.png" alt="Mood Foam Mattresses" className="nav__brand-logo" />
        </Link>

        <nav className="nav__links" aria-label="Primary">
          <NavLink to="/" end className={linkClass}>Home</NavLink>

          <div
            className="nav__dropdown"
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
          >
            <button
              className={`nav__link nav__link--btn${location.pathname.startsWith('/products') ? ' nav__link--active' : ''}`}
              aria-expanded={shopOpen}
              onClick={() => setShopOpen((v) => !v)}
            >
              The Range
              <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>
            </button>
            {shopOpen && (
              <div className="nav__dropdown-panel">
                <Link to="/products" className="nav__dropdown-item">All mattresses</Link>
                {categories.map((c) => (
                  <Link key={c.slug} to={`/products/${c.slug}`} className="nav__dropdown-item">
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <NavLink to="/showroom" className={linkClass}>Showroom</NavLink>
          <NavLink to="/about" className={linkClass}>Our Story</NavLink>
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>
        </nav>

        <a href="https://wa.me/256743053096" className="btn btn--outline btn--sm nav__cta">Order on WhatsApp</a>

        <button
          className="nav__burger"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>

      {open && (
        <nav className="nav__mobile" aria-label="Mobile">
          <Link to="/" className="nav__mobile-link">Home</Link>
          <p className="nav__mobile-heading">The Range</p>
          <Link to="/products" className="nav__mobile-link nav__mobile-link--sub">All mattresses</Link>
          {categories.map((c) => (
            <Link key={c.slug} to={`/products/${c.slug}`} className="nav__mobile-link nav__mobile-link--sub">
              {c.name}
            </Link>
          ))}
          <Link to="/showroom" className="nav__mobile-link">Showroom</Link>
          <Link to="/about" className="nav__mobile-link">Our Story</Link>
          <Link to="/contact" className="nav__mobile-link">Contact</Link>
          <a href="https://wa.me/256743053096" className="btn btn--coral nav__mobile-cta">Order on WhatsApp</a>
        </nav>
      )}
    </header>
  );
}
