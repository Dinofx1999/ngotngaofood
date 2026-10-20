import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../api';

// Giá trị mặc định (trùng với dữ liệu mẫu) để giao diện không bị trống khi đang tải
export const DEFAULT_SETTINGS = {
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
};

// Ảnh lớn trang chủ mặc định khi chưa cài đặt
export const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=900&q=80';

const SettingsContext = createContext({ settings: DEFAULT_SETTINGS, refresh: () => {} });

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const refresh = useCallback(
    () => api.getSettings().then((s) => setSettings({ ...DEFAULT_SETTINGS, ...s })).catch(() => {}),
    []
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  return <SettingsContext.Provider value={{ settings, refresh }}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext).settings;
export const useSettingsRefresh = () => useContext(SettingsContext).refresh;

// Phí giao hàng theo cài đặt: miễn phí từ mức freeShipFrom
export function calcShipping(subtotal, settings) {
  return subtotal >= settings.freeShipFrom ? 0 : settings.shippingFee;
}
