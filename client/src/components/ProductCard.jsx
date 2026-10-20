import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils';
import ProductImage from './ProductImage';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const toast = useToast();

  const handleAdd = () => {
    addItem(product, 1);
    toast(`Đã thêm "${product.name}" vào giỏ hàng`);
  };

  return (
    <div className="card">
      <Link to={`/san-pham/${product.id}`}>
        <ProductImage src={product.image} alt={product.name} className="card-img" />
      </Link>
      <div className="card-body">
        <Link to={`/san-pham/${product.id}`}><h3>{product.name}</h3></Link>
        <p className="muted small clamp-2">{product.description}</p>
        <div className="card-actions">
          <div>
            <div className="price">{formatPrice(product.price)}</div>
            <div className="muted small">/ {product.unit}</div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleAdd}>+ Thêm</button>
        </div>
      </div>
    </div>
  );
}
