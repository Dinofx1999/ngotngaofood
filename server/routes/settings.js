const express = require('express');
const { requireAdmin } = require('../auth');
const { getSettings, parseSettings, saveSettings } = require('../settings');

const router = express.Router();

// GET /api/settings - thông tin cửa hàng (công khai)
router.get('/', (req, res) => res.json(getSettings()));

// PUT /api/settings (admin) - cập nhật thông tin cửa hàng
router.put('/', requireAdmin, (req, res) => {
  const { data, error } = parseSettings(req.body || {}, getSettings());
  if (error) return res.status(400).json({ message: error });
  saveSettings(data);
  res.json(data);
});

module.exports = router;
