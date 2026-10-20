import { useEffect, useState } from 'react';
import { api } from '../../api';
import StatusBadge from '../StatusBadge';
import { formatPrice, formatDate, STATUS_LABELS, PAYMENT_LABELS } from '../../utils';

export default function OrdersPanel({ adminKey, onAuthError }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');

  const loadOrders = async () => {
    setLoading(true);
    try {
      setOrders(await api.adminGetOrders(adminKey));
    } catch (err) {
      onAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminKey]);

  const handleStatusChange = async (order, status) => {
    try {
      const updated = await api.adminUpdateStatus(adminKey, order.id, status);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    } catch (err) {
      alert(err.message);
    }
  };

  const visible = filter ? orders.filter((o) => o.status === filter) : orders;
  const revenue = orders.filter((o) => o.status === 'done').reduce((s, o) => s + o.total, 0);

  return (
    <>
      <div className="section-head">
        <h2 className="section-title">Đơn hàng</h2>
        <button className="btn btn-outline btn-sm" onClick={loadOrders} disabled={loading}>↻ Tải lại</button>
      </div>

      <div className="stats">
        <div className="stat"><div className="stat-value">{orders.length}</div><div className="muted small">Tổng đơn</div></div>
        <div className="stat"><div className="stat-value">{orders.filter((o) => o.status === 'pending').length}</div><div className="muted small">Chờ xác nhận</div></div>
        <div className="stat"><div className="stat-value">{formatPrice(revenue)}</div><div className="muted small">Doanh thu (đơn hoàn thành)</div></div>
      </div>

      <div className="chips">
        <button className={`chip ${!filter ? 'active' : ''}`} onClick={() => setFilter('')}>Tất cả</button>
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <button key={value} className={`chip ${filter === value ? 'active' : ''}`} onClick={() => setFilter(value)}>{label}</button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="muted">Chưa có đơn hàng nào.</p>
      ) : (
        <div className="order-list">
          {visible.map((o) => (
            <div key={o.id} className="order-card">
              <div className="order-card-head">
                <div>
                  <b className="order-code">{o.code}</b>
                  <div className="muted small">{formatDate(o.createdAt)} · {PAYMENT_LABELS[o.paymentMethod]}</div>
                </div>
                <div className="row-actions">
                  <StatusBadge status={o.status} />
                  <select value={o.status} onChange={(e) => handleStatusChange(o, e.target.value)}>
                    {Object.entries(STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </div>
              </div>
              <div className="order-card-body">
                <div>
                  <div><b>{o.customer.name}</b> – {o.customer.phone}</div>
                  <div className="muted small">{o.customer.address}</div>
                  {o.customer.note && <div className="muted small">Ghi chú: {o.customer.note}</div>}
                </div>
                <ul className="order-items">
                  {o.items.map((i) => <li key={i.productId}>{i.name} × {i.quantity}</li>)}
                </ul>
                <div className="price right">{formatPrice(o.total)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
