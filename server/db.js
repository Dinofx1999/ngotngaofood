// Lưu trữ dữ liệu đơn giản bằng file JSON trong thư mục data/
// Nếu chưa có file <name>.json nhưng có <name>.seed.json thì tự tạo từ file seed (dữ liệu mẫu)
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');

function filePath(name) {
  return path.join(DATA_DIR, `${name}.json`);
}

function read(name) {
  try {
    return JSON.parse(fs.readFileSync(filePath(name), 'utf8'));
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
    const seedPath = path.join(DATA_DIR, `${name}.seed.json`);
    if (fs.existsSync(seedPath)) {
      const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
      write(name, seed);
      return seed;
    }
    return [];
  }
}

function write(name, data) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(filePath(name), JSON.stringify(data, null, 2));
}

module.exports = { read, write };
