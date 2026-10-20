import { useState } from 'react';
import { api } from '../../api';
import ProductImage from '../ProductImage';

const EMPTY = { name: '', category: '', price: '', unit: 'cái', description: '', image: '', featured: false };

export default function ProductForm({ initial, categories, adminKey, onSave, onCancel }) {
  const [form, setForm] = useState({ ...EMPTY, category: categories[0]?.id || '', ...(initial || {}) });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const { url } = await api.adminUploadImage(adminKey, file);
      set('image', url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave({ ...form, price: Number(form.price) });
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
        <span>Ảnh sản phẩm</span>
        <div className="image-picker">
          <ProductImage src={form.image} alt="Xem trước" className="image-preview" />
          <div className="image-picker-controls">
            <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} />
            {uploading && <div className="muted small">Đang tải ảnh lên...</div>}
            <input value={form.image} onChange={(e) => set('image', e.target.value)} placeholder="Hoặc dán link ảnh: https://..." />
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
