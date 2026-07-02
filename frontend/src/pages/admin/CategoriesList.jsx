import { useEffect, useState } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api';

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const emptyForm = { name: '', slug: '', description: '', sort_order: 0 };

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getCategories().then(setCategories).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setSlugTouched(true);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || '', sort_order: cat.sort_order });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setSlugTouched(false);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (editingId) {
        await updateCategory(editingId, form);
      } else {
        await createCategory(form);
      }
      cancelEdit();
      load();
    } catch (err) {
      setError(err?.response?.data?.detail || 'Could not save this category.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete "${cat.name}" and all ${cat.product_count} product(s) inside it?`)) return;
    await deleteCategory(cat.id);
    load();
  };

  return (
    <>
      <div className="admin__header">
        <div>
          <h1>Categories</h1>
          <p>Categories power the navigation menu and product grouping automatically.</p>
        </div>
      </div>

      <form className="admin-form" onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
        <h3 style={{ margin: 0 }}>{editingId ? 'Edit Category' : 'Add Category'}</h3>
        {error && <p className="admin-form__error">{error}</p>}
        <div className="admin-form__row">
          <label>
            Name
            <input
              value={form.name}
              onChange={(e) => {
                const name = e.target.value;
                setForm((f) => ({ ...f, name, slug: slugTouched ? f.slug : slugify(name) }));
              }}
              required
            />
          </label>
          <label>
            Slug
            <input
              value={form.slug}
              onChange={(e) => { setSlugTouched(true); setForm((f) => ({ ...f, slug: slugify(e.target.value) })); }}
              required
            />
          </label>
        </div>
        <label>
          Description
          <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
        </label>
        <label style={{ maxWidth: 160 }}>
          Sort order
          <input type="number" value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))} />
        </label>
        <div className="admin-form__actions">
          <button className="btn btn--coral" type="submit" disabled={saving}>
            {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Add Category'}
          </button>
          {editingId && <button type="button" className="btn btn--outline" onClick={cancelEdit}>Cancel</button>}
        </div>
      </form>

      {loading ? (
        <p className="state-message">Loading&hellip;</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Slug</th><th>Products</th><th></th></tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.slug}</td>
                <td>{c.product_count}</td>
                <td className="admin-table__actions">
                  <button className="btn btn--outline btn--sm" onClick={() => startEdit(c)}>Edit</button>
                  <button className="btn btn--danger btn--sm" onClick={() => handleDelete(c)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
