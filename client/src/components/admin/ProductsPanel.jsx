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
        <h2 className="section-title">Sản phẩm ({products.length})</h2>
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
          {products.map((p) => (
            <div key={p.id} className="product-admin-row">
              <ProductImage src={p.image} alt={p.name} className="cart-img" />
              <div>
                <div className="cart-name">{p.name} {p.featured && <span title="Bán chạy">⭐</span>}</div>
                <div className="muted small">{categoryName(p.category)} · {p.unit}</div>
              </div>
              <div className="price">{formatPrice(p.price)}</div>
              <div className="row-actions">
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
