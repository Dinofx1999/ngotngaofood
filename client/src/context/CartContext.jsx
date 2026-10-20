import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'ngotngao_cart';

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  // Giữ giỏ hàng khi tải lại trang
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: Math.min(99, i.quantity + quantity) } : i
        );
      }
      return [
        ...prev,
        { id: product.id, name: product.name, price: product.price, image: product.image, unit: product.unit, quantity },
      ];
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return removeItem(id);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: Math.min(99, quantity) } : i)));
  };

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => setItems([]);

  const value = useMemo(() => {
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    return { items, count, subtotal, addItem, updateQuantity, removeItem, clearCart };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
