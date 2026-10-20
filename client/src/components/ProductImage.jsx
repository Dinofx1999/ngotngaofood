// Ảnh sản phẩm, tự động dùng ảnh thay thế nếu link ảnh lỗi
export default function ProductImage({ src, alt, className }) {
  return (
    <img
      src={src || '/placeholder.svg'}
      alt={alt}
      className={className}
      loading="lazy"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = '/placeholder.svg';
      }}
    />
  );
}
