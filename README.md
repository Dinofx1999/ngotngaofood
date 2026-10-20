# 🧁 Ngọt Ngào Food – Website bán bánh

Website bán bánh đơn giản, dễ dùng, xây dựng bằng **Node.js (Express)** + **React (Vite)**.

## Tính năng

**Khách hàng**
- Trang chủ: giới thiệu, danh mục, bánh bán chạy
- Thực đơn: lọc theo danh mục, tìm kiếm (không phân biệt dấu)
- Xem chi tiết bánh, chọn số lượng, thêm vào giỏ
- Giỏ hàng lưu tự động (không mất khi tải lại trang)
- Đặt hàng: nhập họ tên, SĐT, địa chỉ, ghi chú; thanh toán COD hoặc chuyển khoản
- Miễn phí giao hàng cho đơn từ 300.000 ₫
- Tra cứu đơn hàng theo mã đơn

**Quản trị** (`/admin`)
- Xem toàn bộ đơn hàng, thống kê nhanh
- Lọc và cập nhật trạng thái đơn (Chờ xác nhận → Đã xác nhận → Đang giao → Hoàn thành / Đã hủy)
- Mã quản trị mặc định: `ngotngao123` (đổi bằng biến môi trường `ADMIN_KEY`)

## Cấu trúc thư mục

```
NgotNgaoFood/
├── server/                 # Backend Node.js + Express
│   ├── index.js            # Khởi động server (cổng 5050)
│   ├── db.js               # Đọc/ghi dữ liệu file JSON
│   ├── categories.js       # Danh mục bánh
│   ├── routes/
│   │   ├── products.js     # API sản phẩm
│   │   └── orders.js       # API đơn hàng
│   └── data/
│       ├── products.json   # Danh sách bánh (sửa file này để thêm/bớt bánh)
│       └── orders.json     # Đơn hàng (tự động ghi khi khách đặt)
└── client/                 # Frontend React + Vite
    └── src/
        ├── pages/          # Các trang: Home, Menu, ProductDetail, Cart, Checkout, OrderPage, TrackOrder, Admin
        ├── components/     # Header, Footer, ProductCard, QuantityInput, ...
        ├── context/        # CartContext (giỏ hàng), ToastContext (thông báo)
        ├── api.js          # Gọi API
        └── index.css       # Toàn bộ giao diện
```

## Cài đặt & chạy

Yêu cầu: Node.js 18 trở lên.

```bash
npm run install:all   # cài đặt cho cả root, server và client
npm run dev           # chạy đồng thời server (5050) và client (3000)
```

Mở trình duyệt tại **http://localhost:3000**.

## Chạy thật (production)

```bash
npm run build         # build React vào client/dist
npm start             # server Node phục vụ luôn API + giao diện tại http://localhost:5050
```

Đổi mã quản trị khi chạy thật:

```bash
ADMIN_KEY=matkhau-cua-ban npm start
```

## Thêm / sửa bánh

Mở `server/data/products.json`, thêm một mục theo mẫu:

```json
{
  "id": "banh-moi",
  "name": "Bánh mới",
  "category": "banh-ngot",
  "price": 50000,
  "unit": "cái",
  "description": "Mô tả ngắn...",
  "image": "https://link-anh-cua-ban.jpg",
  "featured": true
}
```

- `category` là một trong: `banh-kem`, `banh-ngot`, `banh-mi`, `banh-quy` (sửa trong `server/categories.js`).
- `featured: true` để hiện ở mục "Bánh bán chạy" trang chủ.
- Ảnh có thể để trong `client/public/` và dùng đường dẫn `/ten-anh.jpg`. Nếu link ảnh lỗi, web tự hiện ảnh thay thế.

## API

| Phương thức | Đường dẫn | Mô tả |
|---|---|---|
| GET | `/api/categories` | Danh mục |
| GET | `/api/products?category=&q=&featured=` | Danh sách bánh |
| GET | `/api/products/:id` | Chi tiết bánh |
| POST | `/api/orders` | Tạo đơn hàng |
| GET | `/api/orders/:code` | Tra cứu đơn theo mã |
| GET | `/api/orders` | Danh sách đơn (cần header `x-admin-key`) |
| PATCH | `/api/orders/:id/status` | Cập nhật trạng thái (cần header `x-admin-key`) |
