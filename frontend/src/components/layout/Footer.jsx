import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <img src="/logo.png" alt="Mood Foam" className="footer__logo" />
          <p>Foam and spring mattresses, hand-quilted and finished in Mityana, Uganda.</p>
        </div>

        <nav className="footer__col" aria-label="Shop">
          <h4>Shop</h4>
          <Link to="/products">The Range</Link>
          <Link to="/about">How They&rsquo;re Made</Link>
          <Link to="/contact">For Hotels</Link>
        </nav>

        <nav className="footer__col" aria-label="Company">
          <h4>Company</h4>
          <Link to="/showroom">Showroom</Link>
          <Link to="/about">Our Story</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="footer__col">
          <h4>Reach us</h4>
          <a href="https://wa.me/256743053096">WhatsApp: 0743 053096</a>
          <a href="mailto:busujjuindustries@gmail.com">busujjuindustries@gmail.com</a>
          <address>Nalugazi LC, Naama Central, Mityana, Uganda</address>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>&copy; {year} Busujju Industries Limited. All rights reserved.</p>
        <Link to="/admin/login" className="footer__admin">Staff Login</Link>
      </div>
    </footer>
  );
}
