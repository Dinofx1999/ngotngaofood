import { useState } from 'react';
import { api } from '../api';
import OrdersPanel from '../components/admin/OrdersPanel';
import ProductsPanel from '../components/admin/ProductsPanel';

const KEY_STORAGE = 'ngotngao_admin_key';

export default function Admin() {
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem(KEY_STORAGE) || '');
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('orders');

  const handleLogin = async (e) => {
    e.preventDefault();
    const key = input.trim();
    setLoading(true);
    setError('');
    try {
      await api.adminGetOrders(key); // kiểm tra mã quản trị
      sessionStorage.setItem(KEY_STORAGE, key);
      setAdminKey(key);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = (message = '') => {
    sessionStorage.removeItem(KEY_STORAGE);
    setAdminKey('');
    setError(message);
  };

  if (!adminKey) {
    return (
      <div className="container section narrow">
        <div className="form-card center">
          <div className="empty-icon">🔐</div>
          <h1 className="page-title">Trang quản trị</h1>
          <form className="search" onSubmit={handleLogin}>
            <input type="password" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Mã quản trị" required />
            <button className="btn btn-primary" type="submit" disabled={loading}>Đăng nhập</button>
          </form>
          {error && <div className="alert">{error}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="container section">
      <div className="section-head">
        <h1 className="page-title">Trang quản trị</h1>
        <button className="btn btn-text btn-sm" onClick={() => logout()}>Đăng xuất</button>
      </div>

      <div className="tabs">
        <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}>📦 Đơn hàng</button>
        <button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}>🧁 Sản phẩm</button>
      </div>

      {tab === 'orders' ? (
        <OrdersPanel adminKey={adminKey} onAuthError={(msg) => logout(msg)} />
      ) : (
        <ProductsPanel adminKey={adminKey} />
      )}
    </div>
  );
}
