const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const db = require('../db');
const { requireAdmin } = require('../auth');
const { getCategories } = require('../categories');
const { normalize, slugify, uniqueId } = require('../text');

const router = express.Router();

// Thư mục chứa ảnh tải lên, được phục vụ tại /uploads/...
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
      cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Chỉ chấp nhận file ảnh (jpg, png, webp...)'));
  },
});

// Kiểm tra và chuẩn hóa dữ liệu sản phẩm gửi lên
function parseProduct(body) {
  const name = String(body.name || '').trim();
  const category = String(body.category || '');
  const price = Number(body.price);
  const unit = String(body.unit || '').trim() || 'cái';
  const description = String(body.description || '').trim();
  const image = String(body.image || '').trim();
  const featured = body.featured === true || body.featured === 'true';

  if (name.length < 2) return { error: 'Vui lòng nhập tên sản phẩm' };
  if (!getCategories().some((c) => c.id === category)) return { error: 'Danh mục không hợp lệ' };
  if (!Number.isFinite(price) || price < 0) return { error: 'Giá không hợp lệ' };

  return { data: { name, category, price: Math.round(price), unit, description, image, featured } };
}

// GET /api/products?category=banh-kem&q=dau&featured=true
router.get('/', (req, res) => {
  const { category, q, featured } = req.query;
  let products = db.read('products');

  if (category) products = products.filter((p) => p.category === category);
  if (featured === 'true') products = products.filter((p) => p.featured);
  if (q) {
    const kw = normalize(q);
    products = products.filter(
      (p) => normalize(p.name).includes(kw) || normalize(p.description).includes(kw)
    );
  }

  res.json(products);
});

// POST /api/products/upload (admin) - tải ảnh lên, trả về đường dẫn ảnh
router.post('/upload', requireAdmin, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      const message = err.code === 'LIMIT_FILE_SIZE' ? 'Ảnh tối đa 5MB' : err.message;
      return res.status(400).json({ message });
    }
    if (!req.file) return res.status(400).json({ message: 'Chưa chọn file ảnh' });
    res.status(201).json({ url: `/uploads/${req.file.filename}` });
  });
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const product = db.read('products').find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
  res.json(product);
});

// POST /api/products (admin) - thêm sản phẩm
router.post('/', requireAdmin, (req, res) => {
  const { data, error } = parseProduct(req.body || {});
  if (error) return res.status(400).json({ message: error });

  const products = db.read('products');
  const id = uniqueId(slugify(data.name, 'san-pham'), products.map((p) => p.id));

  const product = { id, ...data };
  products.push(product);
  db.write('products', products);
  res.status(201).json(product);
});

// PUT /api/products/:id (admin) - sửa sản phẩm
router.put('/:id', requireAdmin, (req, res) => {
  const products = db.read('products');
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

  const { data, error } = parseProduct({ ...products[index], ...(req.body || {}) });
  if (error) return res.status(400).json({ message: error });

  products[index] = { id: products[index].id, ...data };
  db.write('products', products);
  res.json(products[index]);
});

// DELETE /api/products/:id (admin) - xóa sản phẩm
router.delete('/:id', requireAdmin, (req, res) => {
  const products = db.read('products');
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

  db.write('products', products.filter((p) => p.id !== product.id));

  // Xóa luôn file ảnh đã tải lên (nếu có)
  if (product.image && product.image.startsWith('/uploads/')) {
    fs.unlink(path.join(UPLOAD_DIR, path.basename(product.image)), () => {});
  }
  res.json({ ok: true });
});

module.exports = router;
