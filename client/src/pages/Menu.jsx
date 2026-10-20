import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api';
import ProductCard from '../components/ProductCard';

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const q = searchParams.get('q') || '';

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState(q);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category) params.category = category;
    if (q) params.q = q;
    api.getProducts(params)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, q]);

  const updateParams = (next) => {
    const params = {};
    const merged = { category, q, ...next };
    if (merged.category) params.category = merged.category;
    if (merged.q) params.q = merged.q;
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateParams({ q: keyword.trim() });
  };

  return (
    <div className="container section">
      <h1 className="page-title">Thực đơn</h1>

      <div className="toolbar">
        <div className="chips">
          <button className={`chip ${!category ? 'active' : ''}`} onClick={() => updateParams({ category: '' })}>
            Tất cả
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              className={`chip ${category === c.id ? 'active' : ''}`}
              onClick={() => updateParams({ category: c.id })}
            >
              {c.icon} {c.name}
            </button>
          ))}
        </div>
        <form className="search" onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="Tìm bánh..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">Tìm</button>
        </form>
      </div>

      {loading ? (
        <p className="muted">Đang tải...</p>
      ) : products.length === 0 ? (
        <div className="empty">
          <p>Không tìm thấy sản phẩm phù hợp.</p>
          <button className="btn btn-outline" onClick={() => { setKeyword(''); setSearchParams({}); }}>
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
