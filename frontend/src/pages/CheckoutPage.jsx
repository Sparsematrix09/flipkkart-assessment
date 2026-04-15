import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function CheckoutPage({ API_URL }) {
  const [cart, setCart] = useState({ items: [], subtotal: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [placingOrder, setPlacingOrder] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchCart();
  }, []);
  
  const fetchCart = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/cart`);
      if (res.data.items.length === 0) {
        toast.error('Your cart is empty');
        navigate('/cart');
        return;
      }
      setCart(res.data);
    } catch (error) {
      toast.error('Failed to load cart');
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePlaceOrder = async () => {
    if (!address.fullName || !address.phone || !address.address || !address.city || !address.state || !address.pincode) {
      toast.error('Please fill all address fields');
      return;
    }
    
    if (!/^\d{10}$/.test(address.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    
    if (!/^\d{6}$/.test(address.pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }
    
    setPlacingOrder(true);
    try {
      const res = await axios.post(`${API_URL}/api/orders/create`, {
        address: {
          fullName: address.fullName,
          phone: address.phone,
          address: address.address,
          city: address.city,
          state: address.state,
          pincode: address.pincode
        },
        cartItems: cart.items,
        totalAmount: cart.total
      });
      
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${res.data.orderId}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-flipkart-blue"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Address Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-sm p-6">
            <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
            
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-flipkart-text text-sm mb-1">Full Name *</label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={address.fullName}
                    onChange={(e) => setAddress({...address, fullName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-flipkart-blue"
                  />
                </div>
                <div>
                  <label className="block text-flipkart-text text-sm mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={address.phone}
                    onChange={(e) => setAddress({...address, phone: e.target.value})}
                    maxLength={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-flipkart-blue"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-flipkart-text text-sm mb-1">Address *</label>
                <textarea
                  placeholder="House number, street, landmark"
                  value={address.address}
                  onChange={(e) => setAddress({...address, address: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-flipkart-blue"
                />
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-flipkart-text text-sm mb-1">City *</label>
                  <input
                    type="text"
                    placeholder="City"
                    value={address.city}
                    onChange={(e) => setAddress({...address, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-flipkart-blue"
                  />
                </div>
                <div>
                  <label className="block text-flipkart-text text-sm mb-1">State *</label>
                  <input
                    type="text"
                    placeholder="State"
                    value={address.state}
                    onChange={(e) => setAddress({...address, state: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-flipkart-blue"
                  />
                </div>
                <div>
                  <label className="block text-flipkart-text text-sm mb-1">Pincode *</label>
                  <input
                    type="text"
                    placeholder="6-digit pincode"
                    value={address.pincode}
                    onChange={(e) => setAddress({...address, pincode: e.target.value})}
                    maxLength={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-flipkart-blue"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-sm p-6 sticky top-20">
            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
            
            <div className="max-h-80 overflow-y-auto mb-4">
              {cart.items.map(item => (
                <div key={item.id} className="flex justify-between mb-3 text-sm">
                  <span className="text-gray-600">{item.name} x{item.quantity}</span>
                  <span className="font-medium">₹{(parseInt(item.price) * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            
            <hr className="my-3" />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-flipkart-text">Subtotal</span>
                <span>₹{parseInt(cart.subtotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-flipkart-text">Delivery Fee</span>
                <span className="text-flipkart-green">FREE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-flipkart-text">Discount</span>
                <span className="text-flipkart-green">- ₹{parseInt(cart.subtotal * 0.2).toLocaleString()}</span>
              </div>
            </div>
            
            <hr className="my-3" />
            
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Total</span>
              <span>₹{parseInt(cart.total).toLocaleString()}</span>
            </div>
            
            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="w-full bg-flipkart-orange text-white py-3 rounded-sm font-bold hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {placingOrder ? 'PLACING ORDER...' : 'CONFIRM ORDER'}
            </button>
            
            <p className="text-xs text-flipkart-text text-center mt-4">
              By placing this order, you agree to our terms and conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}