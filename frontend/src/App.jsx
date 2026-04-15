import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';

const API_URL = 'http://localhost:5000';

function App() {
  const [cartCount, setCartCount] = useState(0);
  
  useEffect(() => {
    fetchCartCount();
  }, []);
  
  const fetchCartCount = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/cart`);
      const count = res.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setCartCount(count);
    } catch (error) {
      console.error('Failed to fetch cart count');
    }
  };
  
  return (
    <BrowserRouter>
      <Navbar cartCount={cartCount} />
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<HomePage API_URL={API_URL} />} />
        <Route path="/product/:id" element={<ProductDetailPage API_URL={API_URL} setCartCount={setCartCount} />} />
        <Route path="/cart" element={<CartPage API_URL={API_URL} setCartCount={setCartCount} />} />
        <Route path="/checkout" element={<CheckoutPage API_URL={API_URL} />} />
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;