import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="container not-found__content">
        <div className="not-found__num">404</div>
        <h1>This mattress has been moved.</h1>
        <p>The page you&rsquo;re looking for doesn&rsquo;t exist any more &mdash; but the rest of the range is still right where you left it.</p>
        <div className="not-found__actions">
          <Link to="/" className="btn btn--gold">Back to Home</Link>
          <Link to="/products" className="btn btn--outline">Browse the range</Link>
        </div>
      </div>
    </section>
  );
}
