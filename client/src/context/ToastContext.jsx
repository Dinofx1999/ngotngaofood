import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [message, setMessage] = useState(null);
  const timer = useRef(null);

  const toast = useCallback((text) => {
    setMessage(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(null), 2200);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {message && <div className="toast">{message}</div>}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
