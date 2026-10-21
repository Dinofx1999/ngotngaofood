// Thông tin cửa hàng (liên hệ, chuyển khoản, phí ship) - quản trị sửa được trên web
const db = require('./db');

const DEFAULTS = {
  name: 'Ngọt Ngào Food',
  tagline: 'Bánh tươi làm mới mỗi ngày, nguyên liệu tự nhiên, ít ngọt, giao tận nơi.',
  address: '',
  phone: '',
  email: '',
  openingHours: '',
  facebook: '',
  zalo: '',
  bankName: '',
  bankAccount: '',
  bankOwner: '',
  freeShipFrom: 300000,
  shippingFee: 20000,
  heroTag: 'Tiệm bánh thủ công',
  heroTitle: 'Ngọt ngào trong từng chiếc bánh',
  heroSubtitle: 'Bánh kem, bánh ngọt và bánh mì tươi làm mới mỗi ngày từ nguyên liệu tự nhiên. Đặt hàng online, giao tận nơi trong 2 giờ.',
  heroImage: '',
  companyName: '',
  taxCode: '',
  businessLicense: '',
  representative: '',
  legalAddress: '',
};

const STRING_FIELDS = ['name', 'tagline', 'address', 'phone', 'email', 'openingHours', 'facebook', 'zalo', 'bankName', 'bankAccount', 'bankOwner', 'heroTag', 'heroTitle', 'heroSubtitle', 'heroImage', 'companyName', 'taxCode', 'businessLicense', 'representative', 'legalAddress'];
const MAX_LENGTH = { heroImage: 1000, heroSubtitle: 500 };
const NUMBER_FIELDS = ['freeShipFrom', 'shippingFee'];

function getSettings() {
  const saved = db.read('settings');
  const data = saved && !Array.isArray(saved) ? saved : {};
  return { ...DEFAULTS, ...data };
}

// Kiểm tra dữ liệu gửi lên, trả về { data } hoặc { error }
function parseSettings(body, current) {
  const next = { ...current };
  for (const key of STRING_FIELDS) {
    if (body[key] !== undefined) next[key] = String(body[key]).trim().slice(0, MAX_LENGTH[key] || 300);
  }
  for (const key of NUMBER_FIELDS) {
    if (body[key] !== undefined) {
      const n = Number(body[key]);
      if (!Number.isFinite(n) || n < 0) return { error: 'Phí giao hàng không hợp lệ' };
      next[key] = Math.round(n);
    }
  }
  if (next.name.length < 2) return { error: 'Vui lòng nhập tên cửa hàng' };
  return { data: next };
}

function saveSettings(data) {
  db.write('settings', data);
}

module.exports = { getSettings, parseSettings, saveSettings, DEFAULTS };
