const express = require('express');
const crypto = require('crypto');
const db = require('../db');
const { requireAdmin } = require('../auth');

const router = express.Router();

const STATUSES = ['pending', 'confirmed', 'delivering', 'done', 'cancelled'];
const PAYMENT_METHODS = ['cod', 'bank'];
const FREE_SHIP_FROM = 300000;
const SHIPPING_FEE = 20000;

function makeCode() {
  const ymd = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const rand = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `NN${ymd}${rand}`;
}

// GET /api/orders  (admin) - danh sách đơn, mới nhất trước
router.get('/', requireAdmin, (req, res) => {
  const orders = db.read('orders').sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  res.json(orders);
});

// GET /api/orders/:code - khách tra cứu đơn theo mã
router.get('/:code', (req, res) => {
  const code = String(req.params.code).trim().toUpperCase();
  const order = db.read('orders').find((o) => o.code === code);
  if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng với mã này' });
  res.json(order);
});

// POST /api/orders - tạo đơn hàng
router.post('/', (req, res) => {
  const { customer = {}, items = [], paymentMethod = 'cod' } = req.body || {};

  const name = String(customer.name || '').trim();
  const phone = String(customer.phone || '').replace(/[\s.-]/g, '');
  const address = String(customer.address || '').trim();
  const note = String(customer.note || '').trim().slice(0, 500);

  if (name.length < 2) return res.status(400).json({ message: 'Vui lòng nhập họ tên' });
  if (!/^(0|\+84)\d{9}$/.test(phone)) return res.status(400).json({ message: 'Số điện thoại không hợp lệ' });
  if (address.length < 5) return res.status(400).json({ message: 'Vui lòng nhập địa chỉ giao hàng' });
  if (!PAYMENT_METHODS.includes(paymentMethod)) return res.status(400).json({ message: 'Phương thức thanh toán không hợp lệ' });
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'Giỏ hàng đang trống' });

  // Lấy giá từ server, không tin giá do client gửi lên
  const products = db.read('products');
  const orderItems = [];
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    const quantity = Number(item.quantity);
    if (!product) return res.status(400).json({ message: `Sản phẩm không tồn tại: ${item.productId}` });
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      return res.status(400).json({ message: `Số lượng không hợp lệ cho ${product.name}` });
    }
    orderItems.push({ productId: product.id, name: product.name, price: product.price, quantity });
  }

  const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingFee = subtotal >= FREE_SHIP_FROM ? 0 : SHIPPING_FEE;

  const order = {
    id: crypto.randomUUID(),
    code: makeCode(),
    customer: { name, phone, address, note },
    items: orderItems,
    subtotal,
    shippingFee,
    total: subtotal + shippingFee,
    paymentMethod,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  const orders = db.read('orders');
  orders.push(order);
  db.write('orders', orders);

  res.status(201).json(order);
});

// PATCH /api/orders/:id/status (admin) - cập nhật trạng thái
router.patch('/:id/status', requireAdmin, (req, res) => {
  const { status } = req.body || {};
  if (!STATUSES.includes(status)) return res.status(400).json({ message: 'Trạng thái không hợp lệ' });

  const orders = db.read('orders');
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

  order.status = status;
  order.updatedAt = new Date().toISOString();
  db.write('orders', orders);
  res.json(order);
});

module.exports = router;
