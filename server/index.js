const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const { CATEGORIES } = require('./categories');

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// API
app.get('/api/health', (req, res) => res.json({ ok: true, name: 'Ngọt Ngào Food API' }));
app.get('/api/categories', (req, res) => res.json(CATEGORIES));
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);

// Ảnh sản phẩm do quản trị tải lên
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', (req, res) => res.status(404).json({ message: 'Không tìm thấy API' }));

// Khi đã build React (npm run build), server phục vụ luôn giao diện
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.use((req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

// Xử lý lỗi chung
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Lỗi máy chủ' });
});

app.listen(PORT, () => {
  console.log(`🧁 Ngọt Ngào Food API đang chạy tại http://localhost:${PORT}`);
});
