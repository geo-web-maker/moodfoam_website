import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="section" style={{ textAlign: 'center' }}>
      <div className="container">
        <span className="eyebrow">404</span>
        <h1>This page drifted off</h1>
        <p style={{ maxWidth: 420, margin: '0 auto 28px' }}>
          The page you're looking for doesn't exist any more. Let's get you back to something comfortable.
        </p>
        <Link to="/" className="btn btn--coral">Back to Home</Link>
      </div>
    </section>
  );
}
