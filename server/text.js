// Bỏ dấu tiếng Việt ("Bánh kem" -> "banh kem") và tạo mã (slug) từ tên
function normalize(str = '') {
  return String(str)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

function slugify(str, fallback = 'muc') {
  return normalize(str).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || fallback;
}

// Tạo id duy nhất: nếu trùng thì thêm -2, -3, ...
function uniqueId(base, taken) {
  let id = base;
  let n = 2;
  while (taken.includes(id)) id = `${base}-${n++}`;
  return id;
}

module.exports = { normalize, slugify, uniqueId };
