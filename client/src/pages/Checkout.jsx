import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useCart } from '../context/CartContext';
import { calcShipping, useSettings } from '../context/SettingsContext';
import { formatPrice, PAYMENT_LABELS } from '../utils';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const settings = useSettings();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', phone: '', address: '', note: '' });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) return <Navigate to="/gio-hang" replace />;

  const shippingFee = calcShipping(subtotal, settings);
  const total = subtotal + shippingFee;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const order = await api.createOrder({
        customer: form,
        paymentMethod,
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
      });
      clearCart();
      navigate(`/don-hang/${order.code}`, { state: { justOrdered: true }, replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container section">
      <h1 className="page-title">Đặt hàng</h1>

      <form className="checkout-layout" onSubmit={handleSubmit}>
        <div className="form-card">
          <h3>Thông tin giao hàng</h3>

          <label className="field">
            <span>Họ tên *</span>
            <input name="name" value={form.name} onChange={handleChange} required placeholder="Nguyễn Văn A" />
          </label>
          <label className="field">
            <span>Số điện thoại *</span>
            <input name="phone" type="tel" value={form.phone} onChange={handleChange} required placeholder="0909 123 456" />
          </label>
          <label className="field">
            <span>Địa chỉ giao hàng *</span>
            <input name="address" value={form.address} onChange={handleChange} required placeholder="Số nhà, đường, phường, quận" />
          </label>
          <label className="field">
            <span>Ghi chú (lời chúc trên bánh, giờ giao...)</span>
            <textarea name="note" rows="3" value={form.note} onChange={handleChange} placeholder="Ví dụ: Ghi chữ 'Happy Birthday Lan', giao trước 17h" />
          </label>

          <h3>Phương thức thanh toán</h3>
          {Object.entries(PAYMENT_LABELS).map(([value, label]) => (
            <label key={value} className="radio">
              <input type="radio" name="payment" value={value} checked={paymentMethod === value} onChange={() => setPaymentMethod(value)} />
              <span>{label}</span>
            </label>
          ))}
          {paymentMethod === 'bank' && (
            <div className="note-box">
              Chuyển khoản tới <b>{settings.bankName} {settings.bankAccount} - {settings.bankOwner}</b>, nội dung: số điện thoại của bạn.
              Đơn sẽ được xác nhận sau khi nhận được thanh toán.
            </div>
          )}

          {error && <div className="alert">{error}</div>}
        </div>

        <aside className="summary">
          <h3>Đơn hàng của bạn</h3>
          {items.map((i) => (
            <div key={i.id} className="summary-row small">
              <span>{i.name} × {i.quantity}</span>
              <span>{formatPrice(i.price * i.quantity)}</span>
            </div>
          ))}
          <hr />
          <div className="summary-row"><span>Tạm tính</span><span>{formatPrice(subtotal)}</span></div>
          <div className="summary-row"><span>Phí giao hàng</span><span>{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</span></div>
          <div className="summary-row summary-total"><span>Tổng cộng</span><span>{formatPrice(total)}</span></div>
          <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
            {submitting ? 'Đang gửi...' : 'Xác nhận đặt hàng'}
          </button>
          <Link to="/gio-hang" className="btn btn-text btn-block">← Quay lại giỏ hàng</Link>
        </aside>
      </form>
    </div>
  );
}
