import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import ProductImage from '../components/ProductImage';
import QuantityInput from '../components/QuantityInput';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setProduct(null);
    setError('');
    api.getProduct(id).then(setProduct).catch((e) => setError(e.message));
  }, [id]);

  if (error) {
    return (
      <div className="container section empty">
        <p>{error}</p>
        <Link to="/thuc-don" className="btn btn-outline">Về thực đơn</Link>
      </div>
    );
  }
  if (!product) return <div className="container section muted">Đang tải...</div>;

  const handleAdd = () => {
    addItem(product, quantity);
    toast(`Đã thêm ${quantity} × "${product.name}" vào giỏ hàng`);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    navigate('/gio-hang');
  };

  return (
    <div className="container section">
      <Link to="/thuc-don" className="link">← Về thực đơn</Link>
      <div className="detail">
        <ProductImage src={product.image} alt={product.name} className="detail-img" />
        <div className="detail-info">
          <h1>{product.name}</h1>
          <div className="price price-lg">{formatPrice(product.price)}</div>
          <div className="muted">Đơn vị: {product.unit}</div>
          <p className="lead">{product.description}</p>

          <div className="detail-actions">
            <QuantityInput value={quantity} onChange={setQuantity} />
            <button className="btn btn-primary" onClick={handleAdd}>Thêm vào giỏ</button>
            <button className="btn btn-outline" onClick={handleBuyNow}>Mua ngay</button>
          </div>
        </div>
      </div>
    </div>
  );
}
