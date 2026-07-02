import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, getProducts, getContactMessages } from '../../api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([getCategories(), getProducts(), getContactMessages().catch(() => [])]).then(
      ([categories, products, messages]) => {
        setStats({
          categories: categories.length,
          products: products.length,
          withoutImages: products.filter((p) => !p.images?.length).length,
          unread: messages.filter((m) => !m.is_read).length,
        });
      }
    );
  }, []);

  return (
    <>
      <div className="admin__header">
        <div>
          <h1>Dashboard</h1>
          <p>A quick overview of the storefront.</p>
        </div>
        <Link to="/admin/products/new" className="btn btn--coral">+ Add Product</Link>
      </div>

      {stats && (
        <div className="admin-stats">
          <div className="admin-stat"><strong>{stats.categories}</strong><span>Categories</span></div>
          <div className="admin-stat"><strong>{stats.products}</strong><span>Products</span></div>
          <div className="admin-stat"><strong>{stats.withoutImages}</strong><span>Products without photos</span></div>
          <div className="admin-stat"><strong>{stats.unread}</strong><span>Unread messages</span></div>
        </div>
      )}

      <div className="card" style={{ padding: 24 }}>
        <h3>Quick tips</h3>
        <ul style={{ paddingLeft: 20, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.8 }}>
          <li>Add photos to any product missing them from the <Link to="/admin/products">Products</Link> tab.</li>
          <li>New categories show up in the site navigation automatically -- no code changes needed.</li>
          <li>Every product page (the gallery, sizes and "Order on WhatsApp" button) uses one shared template, so new products look consistent immediately.</li>
        </ul>
      </div>
    </>
  );
}
