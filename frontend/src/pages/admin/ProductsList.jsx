import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct, imageUrl } from '../../api';

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getProducts().then(setProducts).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This can't be undone.`)) return;
    await deleteProduct(product.id);
    load();
  };

  return (
    <>
      <div className="admin__header">
        <div>
          <h1>Products</h1>
          <p>Every product uses the same reusable page template on the live site.</p>
        </div>
        <Link to="/admin/products/new" className="btn btn--coral">+ Add Product</Link>
      </div>

      {loading ? (
        <p className="state-message">Loading&hellip;</p>
      ) : products.length === 0 ? (
        <div className="admin-empty">No products yet. Add your first one to get started.</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Category</th>
              <th>Featured</th>
              <th>Photos</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.images?.[0] ? (
                    <img className="admin-table__thumb" src={imageUrl(p.images[0])} alt="" />
                  ) : (
                    <div className="admin-table__thumb" />
                  )}
                </td>
                <td>{p.name}</td>
                <td>{p.category?.name}</td>
                <td>{p.is_featured ? 'Yes' : '—'}</td>
                <td>{p.images?.length || 0}</td>
                <td className="admin-table__actions">
                  <Link to={`/admin/products/${p.id}`} className="btn btn--outline btn--sm">Edit</Link>
                  <button className="btn btn--danger btn--sm" onClick={() => handleDelete(p)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
