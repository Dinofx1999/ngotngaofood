import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import ProductCard from '../components/ProductCard';
import { useSettings } from '../context/SettingsContext';
import { formatPrice } from '../utils';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const settings = useSettings();

  useEffect(() => {
    api.getProducts({ featured: 'true' }).then(setFeatured).catch(() => setFeatured([]));
    api.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="tag">Tiệm bánh thủ công</span>
            <h1>Ngọt ngào trong từng chiếc bánh</h1>
            <p className="lead">
              Bánh kem, bánh ngọt và bánh mì tươi làm mới mỗi ngày từ nguyên liệu tự nhiên.
              Đặt hàng online, giao tận nơi trong 2 giờ.
            </p>
            <div className="hero-actions">
              <Link to="/thuc-don" className="btn btn-primary btn-lg">Xem thực đơn</Link>
              <Link to="/tra-cuu" className="btn btn-outline btn-lg">Tra cứu đơn hàng</Link>
            </div>
          </div>
          <img
            className="hero-img"
            src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=900&q=80"
            alt="Bánh kem Ngọt Ngào Food"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/placeholder.svg'; }}
          />
        </div>
      </section>

      <section className="section container">
        <h2 className="section-title">Danh mục</h2>
        <div className="category-grid">
          {categories.map((c) => (
            <Link key={c.id} to={`/thuc-don?category=${c.id}`} className="category-card">
              <span className="category-icon">{c.icon}</span>
              <span>{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <h2 className="section-title">Bánh bán chạy</h2>
          <Link to="/thuc-don" className="link">Xem tất cả →</Link>
        </div>
        <div className="grid">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section className="section container">
        <div className="features">
          <div className="feature">
            <div className="feature-icon">🌾</div>
            <h3>Nguyên liệu tự nhiên</h3>
            <p className="muted">Bơ, trứng, sữa tươi chọn lọc. Không chất bảo quản.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">⏱️</div>
            <h3>Làm mới mỗi ngày</h3>
            <p className="muted">Bánh ra lò mỗi sáng, giao trong ngày để giữ trọn hương vị.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🚚</div>
            <h3>Giao hàng tận nơi</h3>
            <p className="muted">{settings.freeShipFrom > 0 ? `Miễn phí giao hàng cho đơn từ ${formatPrice(settings.freeShipFrom)}.` : 'Giao hàng tận nơi trong nội thành.'}</p>
          </div>
        </div>
      </section>
    </>
  );
}
