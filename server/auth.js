// Mã quản trị dùng chung cho các API quản trị (đổi bằng biến môi trường ADMIN_KEY)
const ADMIN_KEY = process.env.ADMIN_KEY || 'ngotngao123';

function requireAdmin(req, res, next) {
  if (req.get('x-admin-key') !== ADMIN_KEY) {
    return res.status(401).json({ message: 'Mã quản trị không đúng' });
  }
  next();
}

module.exports = { requireAdmin };
