import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  getCategories,
  getProducts,
  createProduct,
  updateProduct,
  uploadImage,
  deleteImage,
  imageUrl,
} from '../../api';

const emptyForm = {
  name: '',
  slug: '',
  category_id: '',
  short_description: '',
  description: '',
  sizes: [],
  images: [],
  price: '',
  is_featured: false,
  sort_order: 0,
};

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function ProductForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [sizeInput, setSizeInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (!isEditing) return;
    getProducts()
      .then((products) => {
        const product = products.find((p) => String(p.id) === id);
        if (product) {
          setForm({
            name: product.name,
            slug: product.slug,
            category_id: product.category_id,
            short_description: product.short_description || '',
            description: product.description || '',
            sizes: product.sizes || [],
            images: product.images || [],
            price: product.price || '',
            is_featured: product.is_featured,
            sort_order: product.sort_order,
          });
        }
      })
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  const handleNameChange = (e) => {
    const name = e.target.value;
    setForm((f) => ({ ...f, name, slug: slugTouched ? f.slug : slugify(name) }));
  };

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const addSize = () => {
    const value = sizeInput.trim();
    if (!value || form.sizes.includes(value)) return;
    setForm((f) => ({ ...f, sizes: [...f.sizes, value] }));
    setSizeInput('');
  };

  const removeSize = (size) => {
    setForm((f) => ({ ...f, sizes: f.sizes.filter((s) => s !== size) }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setError('');
    try {
      for (const file of files) {
        const { filename } = await uploadImage(file);
        setForm((f) => ({ ...f, images: [...f.images, filename] }));
      }
    } catch {
      setError('One or more images failed to upload. Please try again.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = async (filename) => {
    setForm((f) => ({ ...f, images: f.images.filter((i) => i !== filename) }));
    try {
      await deleteImage(filename);
    } catch {
      // Non-fatal: the image is already detached from this product.
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.category_id) {
      setError('Please choose a category.');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, category_id: Number(form.category_id) };
      if (isEditing) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err?.response?.data?.detail || 'Could not save this product.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="state-message">Loading&hellip;</p>;

  return (
    <>
      <div className="admin__header">
        <div>
          <h1>{isEditing ? 'Edit Product' : 'Add Product'}</h1>
          <p>This information fills the reusable product page template on the live site.</p>
        </div>
        <Link to="/admin/products" className="btn btn--outline btn--sm">Back to Products</Link>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        {error && <p className="admin-form__error">{error}</p>}

        <div className="admin-form__row">
          <label>
            Product name
            <input value={form.name} onChange={handleNameChange} required />
          </label>
          <label>
            URL slug
            <input
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setForm((f) => ({ ...f, slug: slugify(e.target.value) }));
              }}
              required
            />
          </label>
        </div>

        <div className="admin-form__row">
          <label>
            Category
            <select value={form.category_id} onChange={handleChange('category_id')} required>
              <option value="">Select a category&hellip;</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
          <label>
            Price (optional, free text)
            <input
              placeholder='e.g. "From UGX 350,000" or leave blank'
              value={form.price || ''}
              onChange={handleChange('price')}
            />
          </label>
        </div>

        <label>
          Short description <span style={{ fontWeight: 400 }}>(shown on product cards)</span>
          <input value={form.short_description} onChange={handleChange('short_description')} maxLength={300} />
        </label>

        <label>
          Full description
          <textarea rows={5} value={form.description} onChange={handleChange('description')} />
        </label>

        <label>
          Sizes <span style={{ fontWeight: 400 }}>(optional -- leave empty for items without size variants)</span>
          <div className="admin-chip-input">
            <input
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSize();
                }
              }}
              placeholder="e.g. 6 x 4 x 6"
            />
            <button type="button" className="btn btn--outline btn--sm" onClick={addSize}>Add</button>
          </div>
        </label>
        {form.sizes.length > 0 && (
          <div className="admin-chips">
            {form.sizes.map((size) => (
              <span className="admin-chip" key={size}>
                {size}
                <button type="button" onClick={() => removeSize(size)} aria-label={`Remove ${size}`}>&times;</button>
              </span>
            ))}
          </div>
        )}

        <label>
          Photos
          <div className="admin-image-grid">
            {form.images.map((img) => (
              <div className="admin-image" key={img}>
                <img src={imageUrl(img)} alt="" />
                <button type="button" onClick={() => removeImage(img)} aria-label="Remove photo">&times;</button>
              </div>
            ))}
            <label className="admin-image-upload">
              {uploading ? 'Uploading…' : '+ Add photo'}
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleImageUpload} disabled={uploading} />
            </label>
          </div>
        </label>

        <label className="admin-form__checkbox">
          <input type="checkbox" checked={form.is_featured} onChange={handleChange('is_featured')} />
          Feature this product on the home page
        </label>

        <div className="admin-form__actions">
          <button className="btn btn--coral" type="submit" disabled={saving || uploading}>
            {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Product'}
          </button>
          <Link to="/admin/products" className="btn btn--outline">Cancel</Link>
        </div>
      </form>
    </>
  );
}
