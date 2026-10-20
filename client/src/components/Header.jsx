import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { count } = useCart();

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <span className="logo-icon">🧁</span>
          <span>Ngọt Ngào Food</span>
        </Link>
        <nav className="nav">
          <NavLink to="/" end>Trang chủ</NavLink>
          <NavLink to="/thuc-don">Thực đơn</NavLink>
          <NavLink to="/tra-cuu">Tra cứu đơn</NavLink>
          <NavLink to="/gio-hang" className="cart-link">
            🛒 Giỏ hàng
            {count > 0 && <span className="badge">{count}</span>}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
