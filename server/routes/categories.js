const express = require('express');
const db = require('../db');
const { requireAdmin } = require('../auth');
const { getCategories, saveCategories, parseCategory } = require('../categories');
const { slugify, uniqueId } = require('../text');

const router = express.Router();

// GET /api/categories - danh sách danh mục (công khai)
router.get('/', (req, res) => res.json(getCategories()));

// POST /api/categories (admin) - thêm danh mục
router.post('/', requireAdmin, (req, res) => {
  const { data, error } = parseCategory(req.body || {});
  if (error) return res.status(400).json({ message: error });

  const categories = getCategories();
  const id = uniqueId(slugify(data.name, 'danh-muc'), categories.map((c) => c.id));
  const category = { id, ...data };
  categories.push(category);
  saveCategories(categories);
  res.status(201).json(category);
});

// PUT /api/categories/order (admin) - sắp xếp lại thứ tự, body: { ids: [...] }
router.put('/order', requireAdmin, (req, res) => {
  const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
  const categories = getCategories();
  const valid = ids.length === categories.length && categories.every((c) => ids.includes(c.id));
  if (!valid) return res.status(400).json({ message: 'Danh sách thứ tự không hợp lệ' });

  const ordered = ids.map((id) => categories.find((c) => c.id === id));
  saveCategories(ordered);
  res.json(ordered);
});

// PUT /api/categories/:id (admin) - sửa tên / biểu tượng
router.put('/:id', requireAdmin, (req, res) => {
  const categories = getCategories();
  const index = categories.findIndex((c) => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Không tìm thấy danh mục' });

  const { data, error } = parseCategory(req.body || {}, categories[index]);
  if (error) return res.status(400).json({ message: error });

  categories[index] = { id: categories[index].id, ...data };
  saveCategories(categories);
  res.json(categories[index]);
});

// DELETE /api/categories/:id (admin) - xóa danh mục (chỉ khi không còn sản phẩm)
router.delete('/:id', requireAdmin, (req, res) => {
  const categories = getCategories();
  const category = categories.find((c) => c.id === req.params.id);
  if (!category) return res.status(404).json({ message: 'Không tìm thấy danh mục' });

  const inUse = db.read('products').filter((p) => p.category === category.id).length;
  if (inUse > 0) {
    return res.status(400).json({
      message: `Còn ${inUse} sản phẩm thuộc danh mục "${category.name}". Hãy chuyển hoặc xóa các sản phẩm đó trước.`,
    });
  }

  saveCategories(categories.filter((c) => c.id !== category.id));
  res.json({ ok: true });
});

module.exports = router;
