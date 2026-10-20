import { useEffect, useState } from 'react';
import { api } from '../../api';
import { useToast } from '../../context/ToastContext';

export default function CategoriesPanel({ adminKey }) {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [draft, setDraft] = useState({ name: '', icon: '' });
  const [editing, setEditing] = useState(null); // { id, name, icon }
  const [error, setError] = useState('');

  const load = () =>
    Promise.all([api.getCategories(), api.getProducts()])
      .then(([c, p]) => { setCategories(c); setProducts(p); })
      .catch(() => {});

  useEffect(() => { load(); }, []);

  const countFor = (id) => products.filter((p) => p.category === id).length;

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.adminCreateCategory(adminKey, draft);
      setDraft({ name: '', icon: '' });
      toast('Đã thêm danh mục');
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await api.adminUpdateCategory(adminKey, editing.id, { name: editing.name, icon: editing.icon });
      setEditing(null);
      toast('Đã lưu danh mục');
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (c) => {
    if (!window.confirm(`Xóa danh mục "${c.name}"?`)) return;
    try {
      await api.adminDeleteCategory(adminKey, c.id);
      toast('Đã xóa danh mục');
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const move = async (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= categories.length) return;
    const ids = categories.map((c) => c.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    try {
      setCategories(await api.adminReorderCategories(adminKey, ids));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <div className="section-head">
        <h2 className="section-title">Danh mục ({categories.length})</h2>
      </div>

      <form className="form-card add-row" onSubmit={handleAdd}>
        <input
          className="icon-input"
          value={draft.icon}
          onChange={(e) => setDraft({ ...draft, icon: e.target.value })}
          placeholder="🎂"
          maxLength={8}
          title="Biểu tượng (emoji), có thể để trống"
        />
        <input
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          placeholder="Tên danh mục mới, ví dụ: Bánh trung thu"
          required
        />
        <button className="btn btn-primary" type="submit">+ Thêm danh mục</button>
        {error && <div className="alert add-row-error">{error}</div>}
      </form>
      <p className="muted small">
        Dùng nút ↑ ↓ để đổi thứ tự hiển thị. Danh mục đang có sản phẩm thì không xóa được, hãy chuyển các bánh sang danh mục khác trước.
      </p>

      <div className="product-admin-list">
        {categories.map((c, index) => (
          <div key={c.id} className="product-admin-row category-row">
            {editing?.id === c.id ? (
              <form className="category-edit" onSubmit={handleSaveEdit}>
                <input className="icon-input" value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} maxLength={8} placeholder="🎂" />
                <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required />
                <button className="btn btn-primary btn-sm" type="submit">Lưu</button>
                <button className="btn btn-outline btn-sm" type="button" onClick={() => setEditing(null)}>Hủy</button>
              </form>
            ) : (
              <>
                <div className="category-icon-cell">{c.icon || '📁'}</div>
                <div>
                  <div className="cart-name">{c.name}</div>
                  <div className="muted small">{countFor(c.id)} sản phẩm</div>
                </div>
                <div className="row-actions">
                  <button className="btn-icon" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Lên">↑</button>
                  <button className="btn-icon" onClick={() => move(index, 1)} disabled={index === categories.length - 1} aria-label="Xuống">↓</button>
                  <button className="btn btn-outline btn-sm" onClick={() => setEditing({ id: c.id, name: c.name, icon: c.icon || '' })}>Sửa</button>
                  <button className="btn btn-text btn-sm" onClick={() => handleDelete(c)}>Xóa</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
