const express = require('express');
const db = require('../db');

const router = express.Router();

// Bỏ dấu tiếng Việt để tìm kiếm không phân biệt dấu ("banh kem" vẫn tìm được "Bánh kem")
function normalize(str = '') {
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
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

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const product = db.read('products').find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
  res.json(product);
});

module.exports = router;
