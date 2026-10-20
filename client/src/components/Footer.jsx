import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

export default function Footer() {
  const s = useSettings();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="logo"><span className="logo-icon">🧁</span> {s.name}</div>
          <p className="muted">{s.tagline}</p>
          {(s.facebook || s.zalo) && (
            <p className="social">
              {s.facebook && <a href={s.facebook} target="_blank" rel="noreferrer">Facebook</a>}
              {s.zalo && <a href={s.zalo} target="_blank" rel="noreferrer">Zalo</a>}
            </p>
          )}
        </div>
        <div>
          <h4>Liên hệ</h4>
          {s.address && <p className="muted">📍 {s.address}</p>}
          {s.phone && <p className="muted">📞 <a href={`tel:${s.phone.replace(/\s/g, '')}`}>{s.phone}</a></p>}
          {s.email && <p className="muted">✉️ <a href={`mailto:${s.email}`}>{s.email}</a></p>}
          {s.openingHours && <p className="muted">🕗 {s.openingHours}</p>}
        </div>
        <div>
          <h4>Liên kết</h4>
          <p><Link to="/thuc-don">Thực đơn</Link></p>
          <p><Link to="/tra-cuu">Tra cứu đơn hàng</Link></p>
          <p><Link to="/admin">Quản trị</Link></p>
        </div>
      </div>
      <div className="container footer-bottom muted">© {new Date().getFullYear()} {s.name}</div>
    </footer>
  );
}
