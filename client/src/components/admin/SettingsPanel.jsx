import { useEffect, useState } from 'react';
import { api } from '../../api';
import { DEFAULT_HERO_IMAGE, useSettings, useSettingsRefresh } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';
import ProductImage from '../ProductImage';

const FIELDS = [
  { key: 'name', label: 'Tên cửa hàng *', placeholder: 'Ngọt Ngào Food' },
  { key: 'tagline', label: 'Câu giới thiệu ngắn (hiện ở chân trang)', placeholder: 'Bánh tươi làm mới mỗi ngày...', full: true },
  { key: 'address', label: 'Địa chỉ', placeholder: '123 Nguyễn Huệ, Quận 1, TP. HCM', full: true },
  { key: 'phone', label: 'Số điện thoại', placeholder: '0909 123 456' },
  { key: 'email', label: 'Email', placeholder: 'lienhe@ngotngaofood.com', type: 'email' },
  { key: 'openingHours', label: 'Giờ mở cửa', placeholder: '7:00 – 21:00 hằng ngày' },
  { key: 'facebook', label: 'Link Facebook', placeholder: 'https://facebook.com/...' },
  { key: 'zalo', label: 'Link Zalo', placeholder: 'https://zalo.me/...' },
];

const BANK_FIELDS = [
  { key: 'bankName', label: 'Ngân hàng', placeholder: 'Vietcombank' },
  { key: 'bankAccount', label: 'Số tài khoản', placeholder: '0123456789' },
  { key: 'bankOwner', label: 'Chủ tài khoản', placeholder: 'NGUYEN VAN A' },
];

export default function SettingsPanel({ adminKey }) {
  const settings = useSettings();
  const refresh = useSettingsRefresh();
  const toast = useToast();
  const [form, setForm] = useState(settings);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => setForm(settings), [settings]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleHeroFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const { url } = await api.adminUploadImage(adminKey, file);
      set('heroImage', url);
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
      await api.adminUpdateSettings(adminKey, {
        ...form,
        freeShipFrom: Number(form.freeShipFrom),
        shippingFee: Number(form.shippingFee),
      });
      await refresh();
      toast('Đã lưu thông tin cửa hàng');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const renderField = (f) => (
    <label key={f.key} className={`field ${f.full ? 'field-full' : ''}`}>
      <span>{f.label}</span>
      <input
        type={f.type || 'text'}
        value={form[f.key] ?? ''}
        onChange={(e) => set(f.key, e.target.value)}
        placeholder={f.placeholder}
        required={f.key === 'name'}
      />
    </label>
  );

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h3>Trang chủ</h3>
      <p className="muted small">Ảnh lớn và câu chào ở đầu trang chủ.</p>
      <div className="field">
        <span>Ảnh lớn trang chủ</span>
        <div className="image-picker">
          <ProductImage src={form.heroImage || DEFAULT_HERO_IMAGE} alt="Ảnh trang chủ" className="image-preview hero-preview" />
          <div className="image-picker-controls">
            <input type="file" accept="image/*" onChange={handleHeroFile} disabled={uploading} />
            {uploading && <div className="muted small">Đang tải ảnh lên...</div>}
            <input value={form.heroImage ?? ''} onChange={(e) => set('heroImage', e.target.value)} placeholder="Hoặc dán link ảnh: https://... (để trống = ảnh mặc định)" />
            <div className="muted small">Nên dùng ảnh ngang, tỉ lệ 4:3, tối đa 5MB.</div>
          </div>
        </div>
      </div>
      <div className="form-grid">
        <label className="field">
          <span>Nhãn nhỏ phía trên tiêu đề</span>
          <input value={form.heroTag ?? ''} onChange={(e) => set('heroTag', e.target.value)} placeholder="Tiệm bánh thủ công" />
        </label>
        <label className="field">
          <span>Tiêu đề lớn</span>
          <input value={form.heroTitle ?? ''} onChange={(e) => set('heroTitle', e.target.value)} placeholder="Ngọt ngào trong từng chiếc bánh" />
        </label>
        <label className="field field-full">
          <span>Câu mô tả dưới tiêu đề</span>
          <textarea rows="2" value={form.heroSubtitle ?? ''} onChange={(e) => set('heroSubtitle', e.target.value)} placeholder="Bánh tươi làm mới mỗi ngày..." />
        </label>
      </div>

      <h3>Thông tin cửa hàng & liên hệ</h3>
      <p className="muted small">Hiển thị ở chân trang và trang thanh toán. Để trống mục nào thì mục đó sẽ không hiện.</p>
      <div className="form-grid">{FIELDS.map(renderField)}</div>

      <h3>Thông tin chuyển khoản</h3>
      <p className="muted small">Hiện cho khách khi chọn "Chuyển khoản ngân hàng" lúc đặt hàng.</p>
      <div className="form-grid form-grid-3">{BANK_FIELDS.map(renderField)}</div>

      <h3>Phí giao hàng</h3>
      <div className="form-grid">
        <label className="field">
          <span>Phí giao hàng (₫)</span>
          <input type="number" min="0" step="1000" value={form.shippingFee} onChange={(e) => set('shippingFee', e.target.value)} />
        </label>
        <label className="field">
          <span>Miễn phí giao hàng cho đơn từ (₫)</span>
          <input type="number" min="0" step="10000" value={form.freeShipFrom} onChange={(e) => set('freeShipFrom', e.target.value)} />
        </label>
      </div>

      {error && <div className="alert">{error}</div>}
      <div className="row-actions">
        <button className="btn btn-primary" type="submit" disabled={saving || uploading}>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
      </div>
    </form>
  );
}
