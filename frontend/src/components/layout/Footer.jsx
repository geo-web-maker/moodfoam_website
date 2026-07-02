import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <span className="footer__mark">MOOD FOAM</span>
          <p>
            Manufacturer and supplier of foam mattresses, spring mattresses, beds, sofas,
            pillows and cushions -- made in Mityana, Uganda.
          </p>
        </div>

        <nav className="footer__col" aria-label="Company">
          <h4>Company</h4>
          <Link to="/about">About Us</Link>
          <Link to="/products">All Products</Link>
          <Link to="/showroom">Showroom</Link>
        </nav>

        <nav className="footer__col" aria-label="Support">
          <h4>Support</h4>
          <Link to="/contact">Contact Us</Link>
          <a href="tel:+256764573341">Call: 0764 573341</a>
          <a href="mailto:busujjuindustries@gmail.com">Email Us</a>
        </nav>

        <div className="footer__col">
          <h4>Visit Us</h4>
          <address>
            Nalugazi LC, Naama Central,
            <br />
            Mityana District, Uganda
            <br />
            P.O. Box 247, Mityana
          </address>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>&copy; {year} Busujju Industries Limited. All rights reserved.</p>
        <Link to="/admin/login" className="footer__admin">Staff Login</Link>
      </div>
    </footer>
  );
}
