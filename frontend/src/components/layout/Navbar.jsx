import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { getCategories } from '../../api';
import './Navbar.css';

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
          <NavLink to="/" end className="nav__link">Home</NavLink>

          <div
            className="nav__dropdown"
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
          >
            <button
              className="nav__link nav__link--btn"
              aria-expanded={shopOpen}
              onClick={() => setShopOpen((v) => !v)}
            >
              Products
              <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>
            </button>
            {shopOpen && (
              <div className="nav__dropdown-panel">
                {categories.map((c) => (
                  <Link key={c.slug} to={`/products/${c.slug}`} className="nav__dropdown-item">
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <NavLink to="/about" className="nav__link">About</NavLink>
          <NavLink to="/showroom" className="nav__link">Showroom</NavLink>
          <NavLink to="/contact" className="nav__link">Contact</NavLink>
        </nav>

        <a href="tel:+256743053096" className="btn btn--outline btn--sm nav__cta">Call Us</a>

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
          <p className="nav__mobile-heading">Products</p>
          {categories.map((c) => (
            <Link key={c.slug} to={`/products/${c.slug}`} className="nav__mobile-link nav__mobile-link--sub">
              {c.name}
            </Link>
          ))}
          <Link to="/about" className="nav__mobile-link">About</Link>
          <Link to="/showroom" className="nav__mobile-link">Showroom</Link>
          <Link to="/contact" className="nav__mobile-link">Contact</Link>
          <a href="tel:+256743053096" className="btn btn--coral nav__mobile-cta">Call 0743 053096</a>
        </nav>
      )}
    </header>
  );
}
