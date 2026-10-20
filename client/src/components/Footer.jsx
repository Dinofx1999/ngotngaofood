import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="logo"><span className="logo-icon">🧁</span> Ngọt Ngào Food</div>
          <p className="muted">Bánh tươi làm mới mỗi ngày, nguyên liệu tự nhiên, ít ngọt, giao tận nơi.</p>
        </div>
        <div>
          <h4>Liên hệ</h4>
          <p className="muted">📍 123 Nguyễn Huệ, Quận 1, TP. HCM</p>
          <p className="muted">📞 0909 123 456</p>
          <p className="muted">🕗 7:00 – 21:00 hằng ngày</p>
        </div>
        <div>
          <h4>Liên kết</h4>
          <p><Link to="/thuc-don">Thực đơn</Link></p>
          <p><Link to="/tra-cuu">Tra cứu đơn hàng</Link></p>
          <p><Link to="/admin">Quản trị</Link></p>
        </div>
      </div>
      <div className="container footer-bottom muted">© {new Date().getFullYear()} Ngọt Ngào Food</div>
    </footer>
  );
}
