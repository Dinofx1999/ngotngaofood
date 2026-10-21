import { useState } from 'react';
import { api } from '../../api';
import ProductImage from '../ProductImage';

const EMPTY = { name: '', category: '', price: '', unit: 'cái', description: '', featured: false };
const MAX_IMAGES = 8;

export default function ProductForm({ initial, categories, adminKey, onSave, onCancel }) {
  const [form, setForm] = useState({ ...EMPTY, category: categories[0]?.id || '', ...(initial || {}) });
  const [images, setImages] = useState(
    initial?.images?.length ? initial.images : initial?.image ? [initial.image] : []
  );
  const [urlDraft, setUrlDraft] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const addImages = (urls) => setImages((list) => [...list, ...urls].slice(0, MAX_IMAGES));
  const removeImage = (index) => setImages((list) => list.filter((_, i) => i !== index));
  const moveImage = (index, dir) =>
    setImages((list) => {
      const target = index + dir;
      if (target < 0 || target >= list.length) return list;
      const next = [...list];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, MAX_IMAGES - images.length);
    if (files.length === 0) return;
    setUploading(true);
    setError('');
    try {
      const urls = [];
      for (const file of files) {
        const { url } = await api.adminUploadImage(adminKey, file);
        urls.push(url);
      }
      addImages(urls);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleAddUrl = () => {
    const url = urlDraft.trim();
    if (!url) return;
    addImages([url]);
    setUrlDraft('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave({ ...form, price: Number(form.price), images, image: images[0] || '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="form-card product-form" onSubmit={handleSubmit}>
      <h3>{initial ? `Sửa: ${initial.name}` : 'Thêm sản phẩm mới'}</h3>

      <div className="form-grid">
        <label className="field">
          <span>Tên sản phẩm *</span>
          <input value={form.name} onChange={(e) => set('name', e.target.value)} required placeholder="Bánh kem dâu tây" />
        </label>
        <label className="field">
          <span>Danh mục *</span>
          <select value={form.category} onChange={(e) => set('category', e.target.value)} required>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Giá (₫) *</span>
          <input type="number" min="0" step="1000" value={form.price} onChange={(e) => set('price', e.target.value)} required placeholder="250000" />
        </label>
        <label className="field">
          <span>Đơn vị</span>
          <input value={form.unit} onChange={(e) => set('unit', e.target.value)} placeholder="cái, hộp, ổ..." />
        </label>
      </div>

      <label className="field">
        <span>Mô tả</span>
        <textarea rows="3" value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Mô tả ngắn về bánh..." />
      </label>

      <div className="field">
        <span>Ảnh sản phẩm ({images.length}/{MAX_IMAGES}) – ảnh đầu tiên là ảnh chính, dùng ← → để đổi thứ tự</span>
        <div className="gallery-editor">
          {images.map((url, i) => (
            <div key={url + i} className="gallery-item">
              <ProductImage src={url} alt={`Ảnh ${i + 1}`} className="gallery-thumb" />
              {i === 0 && <span className="gallery-main">Ảnh chính</span>}
              <div className="gallery-actions">
                <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0} aria-label="Sang trái">←</button>
                <button type="button" onClick={() => moveImage(i, 1)} disabled={i === images.length - 1} aria-label="Sang phải">→</button>
                <button type="button" onClick={() => removeImage(i)} aria-label="Xóa ảnh">✕</button>
              </div>
            </div>
          ))}
          {images.length === 0 && (
            <div className="gallery-item">
              <ProductImage src="" alt="Chưa có ảnh" className="gallery-thumb" />
              <div className="muted small center">Chưa có ảnh</div>
            </div>
          )}
        </div>
        <div className="image-picker-controls">
          <input type="file" accept="image/*" multiple onChange={handleFiles} disabled={uploading || images.length >= MAX_IMAGES} />
          {uploading && <div className="muted small">Đang tải ảnh lên...</div>}
          <div className="add-row-inline">
            <input value={urlDraft} onChange={(e) => setUrlDraft(e.target.value)} placeholder="Hoặc dán link ảnh: https://..." disabled={images.length >= MAX_IMAGES} />
            <button type="button" className="btn btn-outline btn-sm" onClick={handleAddUrl} disabled={!urlDraft.trim() || images.length >= MAX_IMAGES}>Thêm link</button>
          </div>
        </div>
      </div>

      <label className="checkbox">
        <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
        <span>Hiện ở mục "Bánh bán chạy" trên trang chủ</span>
      </label>

      {error && <div className="alert">{error}</div>}

      <div className="row-actions">
        <button className="btn btn-primary" type="submit" disabled={saving || uploading}>
          {saving ? 'Đang lưu...' : 'Lưu sản phẩm'}
        </button>
        <button className="btn btn-outline" type="button" onClick={onCancel}>Hủy</button>
      </div>
    </form>
  );
}
