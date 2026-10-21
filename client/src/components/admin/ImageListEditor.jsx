import { useState } from 'react';
import { api } from '../../api';
import ProductImage from '../ProductImage';

// Bộ chọn nhiều ảnh dùng chung: tải từ máy, dán link, đổi thứ tự, bỏ ảnh
export default function ImageListEditor({ images, onChange, adminKey, max = 8, mainLabel = 'Ảnh chính', onUploading }) {
  const [urlDraft, setUrlDraft] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const setBusy = (value) => {
    setUploading(value);
    onUploading?.(value);
  };

  const add = (urls) => onChange([...images, ...urls].slice(0, max));
  const remove = (index) => onChange(images.filter((_, i) => i !== index));
  const move = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, max - images.length);
    if (files.length === 0) return;
    setBusy(true);
    setError('');
    try {
      const urls = [];
      for (const file of files) {
        const { url } = await api.adminUploadImage(adminKey, file);
        urls.push(url);
      }
      add(urls);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  const handleAddUrl = () => {
    const url = urlDraft.trim();
    if (!url) return;
    add([url]);
    setUrlDraft('');
  };

  const full = images.length >= max;

  return (
    <div className="image-list-editor">
      <div className="gallery-editor">
        {images.map((url, i) => (
          <div key={url + i} className="gallery-item">
            <ProductImage src={url} alt={`Ảnh ${i + 1}`} className="gallery-thumb" />
            {i === 0 && mainLabel && <span className="gallery-main">{mainLabel}</span>}
            <div className="gallery-actions">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Sang trái">←</button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1} aria-label="Sang phải">→</button>
              <button type="button" onClick={() => remove(i)} aria-label="Xóa ảnh">✕</button>
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
        <input type="file" accept="image/*" multiple onChange={handleFiles} disabled={uploading || full} />
        {uploading && <div className="muted small">Đang tải ảnh lên...</div>}
        <div className="add-row-inline">
          <input value={urlDraft} onChange={(e) => setUrlDraft(e.target.value)} placeholder="Hoặc dán link ảnh: https://..." disabled={full} />
          <button type="button" className="btn btn-outline btn-sm" onClick={handleAddUrl} disabled={!urlDraft.trim() || full}>Thêm link</button>
        </div>
        {error && <div className="alert">{error}</div>}
      </div>
    </div>
  );
}
