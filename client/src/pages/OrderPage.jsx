import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { api } from '../api';
import StatusBadge from '../components/StatusBadge';
import { formatPrice, formatDate, PAYMENT_LABELS } from '../utils';

export default function OrderPage() {
  const { code } = useParams();
  const location = useLocation();
  const justOrdered = location.state?.justOrdered;

  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getOrder(code).then(setOrder).catch((e) => setError(e.message));
  }, [code]);

  if (error) {
    return (
      <div className="container section empty">
        <p>{error}</p>
        <Link to="/tra-cuu" className="btn btn-outline">Tra cứu lại</Link>
      </div>
    );
  }
  if (!order) return <div className="container section muted">Đang tải...</div>;

  return (
    <div className="container section narrow">
      {justOrdered && (
        <div className="success-box">
          <div className="empty-icon">🎉</div>
          <h2>Đặt hàng thành công!</h2>
          <p>Cảm ơn bạn. Chúng tôi sẽ liên hệ xác nhận trong ít phút. Hãy lưu lại mã đơn để tra cứu.</p>
        </div>
      )}

      <div className="form-card">
        <div className="section-head">
          <div>
            <div className="muted small">Mã đơn hàng</div>
            <h2 className="order-code">{order.code}</h2>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div className="order-meta">
          <div><span className="muted">Ngày đặt:</span> {formatDate(order.createdAt)}</div>
          <div><span className="muted">Thanh toán:</span> {PAYMENT_LABELS[order.paymentMethod]}</div>
          <div><span className="muted">Người nhận:</span> {order.customer.name} – {order.customer.phone}</div>
          <div><span className="muted">Địa chỉ:</span> {order.customer.address}</div>
          {order.customer.note && <div><span className="muted">Ghi chú:</span> {order.customer.note}</div>}
        </div>

        <table className="table">
          <thead>
            <tr><th>Sản phẩm</th><th>SL</th><th className="right">Thành tiền</th></tr>
          </thead>
          <tbody>
            {order.items.map((i) => (
              <tr key={i.productId}>
                <td>{i.name}</td>
                <td>{i.quantity}</td>
                <td className="right">{formatPrice(i.price * i.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="summary-row"><span>Tạm tính</span><span>{formatPrice(order.subtotal)}</span></div>
        <div className="summary-row"><span>Phí giao hàng</span><span>{order.shippingFee === 0 ? 'Miễn phí' : formatPrice(order.shippingFee)}</span></div>
        <div className="summary-row summary-total"><span>Tổng cộng</span><span>{formatPrice(order.total)}</span></div>

        <Link to="/thuc-don" className="btn btn-primary">Tiếp tục mua sắm</Link>
      </div>
    </div>
  );
}
