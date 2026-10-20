// Danh mục bánh - quản trị thêm/sửa/xóa được trên web, lưu ở data/categories.json
const db = require('./db');

const DEFAULTS = [
  { id: 'banh-kem', name: 'Bánh kem', icon: '🎂' },
  { id: 'banh-ngot', name: 'Bánh ngọt', icon: '🧁' },
  { id: 'banh-mi', name: 'Bánh mì', icon: '🥐' },
  { id: 'banh-quy', name: 'Bánh quy', icon: '🍪' },
];

function getCategories() {
  const saved = db.read('categories');
  return Array.isArray(saved) ? saved : DEFAULTS;
}

function saveCategories(list) {
  db.write('categories', list);
}

// Kiểm tra tên/biểu tượng gửi lên
function parseCategory(body, current = {}) {
  const name = body.name !== undefined ? String(body.name).trim() : current.name;
  const icon = body.icon !== undefined ? String(body.icon).trim().slice(0, 8) : current.icon || '';
  if (!name || name.length < 2 || name.length > 50) return { error: 'Tên danh mục cần từ 2 đến 50 ký tự' };
  return { data: { name, icon } };
}

module.exports = { getCategories, saveCategories, parseCategory };
