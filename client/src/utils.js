export function formatPrice(value) {
  return new Intl.NumberFormat('vi-VN').format(value) + ' ₫';
}

export function formatDate(iso) {
  return new Date(iso).toLocaleString('vi-VN', { hour12: false });
}

export const STATUS_LABELS = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  delivering: 'Đang giao',
  done: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

export const PAYMENT_LABELS = {
  cod: 'Thanh toán khi nhận hàng',
  bank: 'Chuyển khoản ngân hàng',
};
