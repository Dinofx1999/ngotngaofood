import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container section empty">
      <div className="empty-icon">🍰</div>
      <h2>Không tìm thấy trang</h2>
      <Link to="/" className="btn btn-primary">Về trang chủ</Link>
    </div>
  );
}
