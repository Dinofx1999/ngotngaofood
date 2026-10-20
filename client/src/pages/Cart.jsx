import { Link } from 'react-router-dom';
import ProductImage from '../components/ProductImage';
import QuantityInput from '../components/QuantityInput';
import { useCart } from '../context/CartContext';
import { calcShipping, useSettings } from '../context/SettingsContext';
import { formatPrice } from '../utils';

export default function Cart() {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const settings = useSettings();
  const shippingFee = calcShipping(subtotal, settings);

  if (items.length === 0) {
    return (
      <div className="container section empty">
        <div className="empty-icon">🛒</div>
        <h2>Giỏ hàng đang trống</h2>
        <p className="muted">Hãy chọn vài chiếc bánh ngọt ngào nhé!</p>
        <Link to="/thuc-don" className="btn btn-primary">Xem thực đơn</Link>
      </div>
    );
  }

  return (
    <div className="container section">
      <div className="section-head">
        <h1 className="page-title">Giỏ hàng</h1>
        <button className="btn btn-text" onClick={clearCart}>Xóa tất cả</button>
      </div>

      <div className="cart-layout">
        <div className="cart-list">
          {items.map((item) => (
            <div key={item.id} className="cart-row">
              <ProductImage src={item.image} alt={item.name} className="cart-img" />
              <div className="cart-info">
                <Link to={`/san-pham/${item.id}`} className="cart-name">{item.name}</Link>
                <div className="muted small">{formatPrice(item.price)} / {item.unit}</div>
              </div>
              <QuantityInput value={item.quantity} onChange={(q) => updateQuantity(item.id, q)} />
              <div className="cart-line-total price">{formatPrice(item.price * item.quantity)}</div>
              <button className="btn-icon" onClick={() => removeItem(item.id)} aria-label="Xóa">✕</button>
            </div>
          ))}
        </div>

        <aside className="summary">
          <h3>Tóm tắt đơn hàng</h3>
          <div className="summary-row"><span>Tạm tính</span><span>{formatPrice(subtotal)}</span></div>
          <div className="summary-row">
            <span>Phí giao hàng</span>
            <span>{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</span>
          </div>
          {shippingFee > 0 && (
            <div className="muted small">Mua thêm {formatPrice(settings.freeShipFrom - subtotal)} để được miễn phí giao hàng</div>
          )}
          <div className="summary-row summary-total"><span>Tổng cộng</span><span>{formatPrice(subtotal + shippingFee)}</span></div>
          <Link to="/thanh-toan" className="btn btn-primary btn-block">Tiến hành đặt hàng</Link>
          <Link to="/thuc-don" className="btn btn-outline btn-block">Chọn thêm bánh</Link>
        </aside>
      </div>
    </div>
  );
}
