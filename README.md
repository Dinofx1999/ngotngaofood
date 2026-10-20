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
- Tab **Đơn hàng**: xem toàn bộ đơn, thống kê nhanh, lọc và cập nhật trạng thái (Chờ xác nhận → Đã xác nhận → Đang giao → Hoàn thành / Đã hủy)
- Tab **Sản phẩm**: thêm / sửa / xóa bánh, tải ảnh từ máy lên hoặc dán link ảnh, đánh dấu "bán chạy"
- Tab **Cửa hàng**: sửa tên, slogan, địa chỉ, điện thoại, email, giờ mở cửa, link Facebook/Zalo, thông tin chuyển khoản, phí giao hàng
- Mã quản trị mặc định: `ngotngao123` (đổi bằng biến môi trường `ADMIN_KEY`)

## Cấu trúc thư mục

```
NgotNgaoFood/
├── server/                 # Backend Node.js + Express
│   ├── index.js            # Khởi động server (cổng 5050)
│   ├── db.js               # Đọc/ghi dữ liệu file JSON
│   ├── auth.js             # Kiểm tra mã quản trị
│   ├── settings.js         # Thông tin cửa hàng (đọc/ghi, kiểm tra dữ liệu)
│   ├── categories.js       # Danh mục bánh
│   ├── routes/
│   │   ├── products.js     # API sản phẩm (xem, thêm, sửa, xóa, tải ảnh)
│   │   ├── orders.js       # API đơn hàng
│   │   └── settings.js     # API thông tin cửa hàng
│   ├── uploads/            # Ảnh sản phẩm tải lên (tự tạo, không đưa lên git)
│   └── data/
│       ├── products.seed.json  # Dữ liệu bánh mẫu (có trong git)
│       ├── products.json       # Dữ liệu bánh thật, tự tạo từ file seed lần đầu chạy (không đưa lên git)
│       ├── settings.seed.json  # Thông tin cửa hàng mẫu (có trong git)
│       ├── settings.json       # Thông tin cửa hàng thật, tự tạo từ seed (không đưa lên git)
│       └── orders.json         # Đơn hàng, tự ghi khi khách đặt (không đưa lên git)
└── client/                 # Frontend React + Vite
    └── src/
        ├── pages/          # Các trang: Home, Menu, ProductDetail, Cart, Checkout, OrderPage, TrackOrder, Admin
        ├── components/     # Header, Footer, ProductCard, QuantityInput, ...
        │   └── admin/      # OrdersPanel, ProductsPanel, ProductForm, SettingsPanel (trang quản trị)
        ├── context/        # CartContext (giỏ hàng), ToastContext (thông báo), SettingsContext (thông tin cửa hàng)
        ├── api.js          # Gọi API
        └── index.css       # Toàn bộ giao diện
```

## Cài đặt & chạy

Yêu cầu: Node.js 18 trở lên.

```bash
npm install           # tự động cài cho cả root, server và client
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

Vào **http://localhost:3000/admin** (hoặc địa chỉ web của bạn + `/admin`), nhập mã quản trị, chọn tab **Sản phẩm**:

- Bấm **+ Thêm sản phẩm**, điền tên, danh mục, giá, đơn vị, mô tả.
- Ảnh: bấm **Choose File** để tải ảnh từ máy (tối đa 5MB), hoặc dán link ảnh vào ô bên dưới.
- Tick "Hiện ở mục Bánh bán chạy" nếu muốn bánh xuất hiện ở trang chủ.
- Bấm **Lưu sản phẩm**. Bánh hiện ngay trên thực đơn, không cần khởi động lại.
- Mỗi dòng sản phẩm có nút **Sửa** và **Xóa**.

Danh mục bánh (Bánh kem, Bánh ngọt, Bánh mì, Bánh quy) sửa trong `server/categories.js`.

## Sửa thông tin cửa hàng

Vào trang quản trị, tab **Cửa hàng**: sửa tên, địa chỉ, điện thoại, giờ mở cửa, link mạng xã hội, tài khoản chuyển khoản và phí giao hàng rồi bấm **Lưu thay đổi**. Thông tin hiện ngay ở chân trang và trang thanh toán.

Dữ liệu thật nằm ở `server/data/products.json`, `server/data/orders.json`, `server/data/settings.json` và ảnh ở `server/uploads/`. Các file này không đưa lên git, nên `git pull` trên máy chủ không làm mất dữ liệu. Nhớ sao lưu các file này định kỳ.

## API

| Phương thức | Đường dẫn | Mô tả |
|---|---|---|
| GET | `/api/categories` | Danh mục |
| GET | `/api/settings` | Thông tin cửa hàng |
| PUT | `/api/settings` | Sửa thông tin cửa hàng (cần header `x-admin-key`) |
| GET | `/api/products?category=&q=&featured=` | Danh sách bánh |
| GET | `/api/products/:id` | Chi tiết bánh |
| POST | `/api/products` | Thêm bánh (cần header `x-admin-key`) |
| PUT | `/api/products/:id` | Sửa bánh (cần header `x-admin-key`) |
| DELETE | `/api/products/:id` | Xóa bánh (cần header `x-admin-key`) |
| POST | `/api/products/upload` | Tải ảnh lên, form-data field `image` (cần header `x-admin-key`) |
| POST | `/api/orders` | Tạo đơn hàng |
| GET | `/api/orders/:code` | Tra cứu đơn theo mã |
| GET | `/api/orders` | Danh sách đơn (cần header `x-admin-key`) |
| PATCH | `/api/orders/:id/status` | Cập nhật trạng thái (cần header `x-admin-key`) |
