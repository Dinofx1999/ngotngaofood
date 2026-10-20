import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Menu from './pages/Menu';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderPage from './pages/OrderPage';
import TrackOrder from './pages/TrackOrder';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/thuc-don" element={<Menu />} />
          <Route path="/san-pham/:id" element={<ProductDetail />} />
          <Route path="/gio-hang" element={<Cart />} />
          <Route path="/thanh-toan" element={<Checkout />} />
          <Route path="/don-hang/:code" element={<OrderPage />} />
          <Route path="/tra-cuu" element={<TrackOrder />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
