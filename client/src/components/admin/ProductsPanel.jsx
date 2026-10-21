import { useEffect, useState } from 'react';
import { api } from '../../api';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../utils';
import ProductImage from '../ProductImage';
import ProductForm from './ProductForm';

export default function ProductsPanel({ adminKey }) {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null); // null | 'new' | product

  const load = () => api.getProducts().then(setProducts).catch(() => setProducts([]));

  useEffect(() => {
    load();
    api.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const categoryName = (id) => categories.find((c) => c.id === id)?.name || id;

  const handleSave = async (data) => {
    if (editing === 'new') await api.adminCreateProduct(adminKey, data);
    else await api.adminUpdateProduct(adminKey, editing.id, data);
    toast('Đã lưu sản phẩm');
    setEditing(null);
    load();
  };

  const move = async (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= products.length) return;
    const ids = products.map((p) => p.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    try {
      setProducts(await api.adminReorderProducts(adminKey, ids));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Xóa "${product.name}"?`)) return;
    try {
      await api.adminDeleteProduct(adminKey, product.id);
      toast('Đã xóa sản phẩm');
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <div className="section-head">
        <div>
          <h2 className="section-title">Sản phẩm ({products.length})</h2>
          <div className="muted small">Thứ tự ở đây là thứ tự hiện trên thực đơn và trang chủ. Dùng ↑ ↓ để đổi.</div>
        </div>
        {!editing && (
          <button className="btn btn-primary btn-sm" onClick={() => setEditing('new')}>+ Thêm sản phẩm</button>
        )}
      </div>

      {editing && (
        <ProductForm
          key={editing === 'new' ? 'new' : editing.id}
          initial={editing === 'new' ? null : editing}
          categories={categories}
          adminKey={adminKey}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}

      {products.length === 0 ? (
        <p className="muted">Chưa có sản phẩm nào. Bấm "Thêm sản phẩm" để bắt đầu.</p>
      ) : (
        <div className="product-admin-list">
          {products.map((p, index) => (
            <div key={p.id} className="product-admin-row">
              <ProductImage src={p.image} alt={p.name} className="cart-img" />
              <div>
                <div className="cart-name">{p.name} {p.featured && <span title="Bán chạy">⭐</span>}</div>
                <div className="muted small">
                  {categoryName(p.category)} · {p.unit}
                  {p.images?.length > 1 && <> · 📷 {p.images.length} ảnh</>}
                </div>
              </div>
              <div className="price">{formatPrice(p.price)}</div>
              <div className="row-actions">
                <button className="btn-icon" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Lên">↑</button>
                <button className="btn-icon" onClick={() => move(index, 1)} disabled={index === products.length - 1} aria-label="Xuống">↓</button>
                <button className="btn btn-outline btn-sm" onClick={() => setEditing(p)}>Sửa</button>
                <button className="btn btn-text btn-sm" onClick={() => handleDelete(p)}>Xóa</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
