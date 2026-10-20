import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TrackOrder() {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (trimmed) navigate(`/don-hang/${trimmed}`);
  };

  return (
    <div className="container section narrow">
      <div className="form-card center">
        <div className="empty-icon">🔎</div>
        <h1 className="page-title">Tra cứu đơn hàng</h1>
        <p className="muted">Nhập mã đơn hàng bạn nhận được sau khi đặt (ví dụ: NN2610201A2B).</p>
        <form className="search" onSubmit={handleSubmit}>
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Mã đơn hàng" required />
          <button className="btn btn-primary" type="submit">Tra cứu</button>
        </form>
      </div>
    </div>
  );
}
