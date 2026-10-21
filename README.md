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
- Tab **Sản phẩm**: thêm / sửa / xóa bánh, mỗi bánh tối đa 8 ảnh (tải từ máy hoặc dán link, ảnh đầu là ảnh chính), đánh dấu "bán chạy", sắp xếp thứ tự hiển thị bằng ↑ ↓
- Tab **Danh mục**: thêm / đổi tên / đổi biểu tượng / sắp xếp / xóa danh mục bánh (không xóa được danh mục còn bánh)
- Tab **Cửa hàng**: đổi ảnh lớn và câu chào ở trang chủ; sửa tên, slogan, địa chỉ, điện thoại, email, giờ mở cửa, link Facebook/Zalo, thông tin chuyển khoản, phí giao hàng
- Mã quản trị mặc định: `ngotngao123` (đổi bằng biến môi trường `ADMIN_KEY`)

## Cấu trúc thư mục

```
NgotNgaoFood/
├── server/                 # Backend Node.js + Express
│   ├── index.js            # Khởi động server (cổng 5050)
│   ├── db.js               # Đọc/ghi dữ liệu file JSON
│   ├── auth.js             # Kiểm tra mã quản trị
│   ├── settings.js         # Thông tin cửa hàng (đọc/ghi, kiểm tra dữ liệu)
│   ├── categories.js       # Danh mục bánh (đọc/ghi, kiểm tra dữ liệu)
│   ├── text.js             # Bỏ dấu tiếng Việt, tạo mã (slug)
│   ├── routes/
│   │   ├── products.js     # API sản phẩm (xem, thêm, sửa, xóa, tải ảnh)
│   │   ├── orders.js       # API đơn hàng
│   │   ├── categories.js   # API danh mục (xem, thêm, sửa, sắp xếp, xóa)
│   │   └── settings.js     # API thông tin cửa hàng
│   ├── uploads/            # Ảnh sản phẩm tải lên (tự tạo, không đưa lên git)
│   └── data/
│       ├── products.seed.json  # Dữ liệu bánh mẫu (có trong git)
│       ├── products.json       # Dữ liệu bánh thật, tự tạo từ file seed lần đầu chạy (không đưa lên git)
│       ├── categories.seed.json # Danh mục mẫu (có trong git)
│       ├── categories.json     # Danh mục thật, tự tạo từ seed (không đưa lên git)
│       ├── settings.seed.json  # Thông tin cửa hàng mẫu (có trong git)
│       ├── settings.json       # Thông tin cửa hàng thật, tự tạo từ seed (không đưa lên git)
│       └── orders.json         # Đơn hàng, tự ghi khi khách đặt (không đưa lên git)
└── client/                 # Frontend React + Vite
    └── src/
        ├── pages/          # Các trang: Home, Menu, ProductDetail, Cart, Checkout, OrderPage, TrackOrder, Admin
        ├── components/     # Header, Footer, ProductCard, QuantityInput, ...
        │   └── admin/      # OrdersPanel, ProductsPanel, ProductForm, CategoriesPanel, SettingsPanel (trang quản trị)
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
- Ảnh: bấm **Choose File** để tải một hoặc nhiều ảnh từ máy (mỗi ảnh tối đa 5MB), hoặc dán link ảnh rồi bấm **Thêm link**. Tối đa 8 ảnh, ảnh đầu tiên là ảnh chính, dùng ← → để đổi thứ tự, ✕ để bỏ ảnh. Trang chi tiết bánh có dải ảnh nhỏ để khách bấm xem.
- Tick "Hiện ở mục Bánh bán chạy" nếu muốn bánh xuất hiện ở trang chủ.
- Bấm **Lưu sản phẩm**. Bánh hiện ngay trên thực đơn, không cần khởi động lại.
- Mỗi dòng sản phẩm có nút **↑ ↓** (đổi vị trí hiển thị trên thực đơn và trang chủ), **Sửa** và **Xóa**.

Danh mục bánh sửa ở tab **Danh mục** trong trang quản trị: thêm tên và biểu tượng (emoji), dùng nút ↑ ↓ để đổi thứ tự hiển thị.

## Sửa thông tin cửa hàng

Vào trang quản trị, tab **Cửa hàng**: mục **Trang chủ** đổi ảnh lớn (tải từ máy hoặc dán link, nên dùng ảnh ngang tỉ lệ 4:3), nhãn nhỏ, tiêu đề và câu mô tả đầu trang; các mục dưới sửa tên, địa chỉ, điện thoại, giờ mở cửa, link mạng xã hội, tài khoản chuyển khoản và phí giao hàng. Bấm **Lưu thay đổi** là áp dụng ngay.

Dữ liệu thật nằm ở `server/data/products.json`, `server/data/categories.json`, `server/data/orders.json`, `server/data/settings.json` và ảnh ở `server/uploads/`. Các file này không đưa lên git, nên `git pull` trên máy chủ không làm mất dữ liệu. Nhớ sao lưu các file này định kỳ.

## API

| Phương thức | Đường dẫn | Mô tả |
|---|---|---|
| GET | `/api/categories` | Danh mục |
| POST | `/api/categories` | Thêm danh mục (cần header `x-admin-key`) |
| PUT | `/api/categories/:id` | Sửa danh mục (cần header `x-admin-key`) |
| PUT | `/api/categories/order` | Sắp xếp danh mục, body `{ ids: [...] }` (cần header `x-admin-key`) |
| DELETE | `/api/categories/:id` | Xóa danh mục trống (cần header `x-admin-key`) |
| GET | `/api/settings` | Thông tin cửa hàng |
| PUT | `/api/settings` | Sửa thông tin cửa hàng (cần header `x-admin-key`) |
| GET | `/api/products?category=&q=&featured=` | Danh sách bánh |
| GET | `/api/products/:id` | Chi tiết bánh (có `image` là ảnh chính và `images` là tất cả ảnh) |
| PUT | `/api/products/order` | Sắp xếp thứ tự bánh, body `{ ids: [...] }` (cần header `x-admin-key`) |
| POST | `/api/products` | Thêm bánh (cần header `x-admin-key`) |
| PUT | `/api/products/:id` | Sửa bánh (cần header `x-admin-key`) |
| DELETE | `/api/products/:id` | Xóa bánh (cần header `x-admin-key`) |
| POST | `/api/products/upload` | Tải ảnh lên, form-data field `image` (cần header `x-admin-key`) |
| POST | `/api/orders` | Tạo đơn hàng |
| GET | `/api/orders/:code` | Tra cứu đơn theo mã |
| GET | `/api/orders` | Danh sách đơn (cần header `x-admin-key`) |
| PATCH | `/api/orders/:id/status` | Cập nhật trạng thái (cần header `x-admin-key`) |
