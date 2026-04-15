import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag } from 'react-icons/fa';

export default function CartPage({ API_URL, setCartCount }) {
  const [cart, setCart] = useState({ items: [], subtotal: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchCart();
  }, []);
  
  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/cart`);
      setCart(res.data);
      // Update cart count in navbar
      const count = res.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      if (setCartCount) setCartCount(count);
    } catch (error) {
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };
  
  const updateQuantity = async (itemId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;
    if (newQuantity > 10) {
      toast.error('Maximum 10 items allowed');
      return;
    }
    
    try {
      await axios.put(`${API_URL}/api/cart/update/${itemId}`, { quantity: newQuantity });
      fetchCart();
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };
  
  const removeItem = async (itemId, itemName) => {
    try {
      await axios.delete(`${API_URL}/api/cart/remove/${itemId}`);
      toast.success(`${itemName} removed from cart`);
      fetchCart();
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white rounded-sm text-center py-16">
          <FaShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-medium text-gray-600 mb-2">Your cart is empty!</h2>
          <p className="text-flipkart-text mb-6">Add items to your cart to proceed</p>
          <button 
            onClick={() => navigate('/')} 
            className="bg-flipkart-blue text-white px-8 py-2 rounded-sm hover:bg-opacity-90"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-sm p-4">
            <h2 className="text-lg font-bold">My Cart ({cart.items.length} items)</h2>
          </div>
          
          {cart.items.map(item => (
            <div key={item.id} className="bg-white rounded-sm p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-32 h-32 object-contain mx-auto sm:mx-0"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{item.name}</h3>
                  <div className="mt-2">
                    <span className="text-xl font-bold">₹{parseInt(item.price).toLocaleString()}</span>
                    <span className="text-flipkart-text text-sm line-through ml-2">
                      ₹{parseInt(item.price * 1.2).toLocaleString()}
                    </span>
                    <span className="text-flipkart-green text-sm ml-2">20% off</span>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2 border rounded-sm">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity, -1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus size={12} className={item.quantity <= 1 ? 'text-gray-300' : 'text-flipkart-blue'} />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity, 1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <FaPlus size={12} className="text-flipkart-blue" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeItem(item.id, item.name)}
                      className="text-flipkart-blue hover:text-red-500 transition-colors flex items-center gap-1"
                    >
                      <FaTrash size={14} /> Remove
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">
                    ₹{(parseInt(item.price) * item.quantity).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Price Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-sm p-4 sticky top-20">
            <h3 className="font-bold text-lg mb-4">Price Details</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-flipkart-text">Subtotal ({cart.items.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
                <span>₹{parseInt(cart.subtotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-flipkart-text">Delivery Fee</span>
                <span className="text-flipkart-green font-medium">FREE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-flipkart-text">Discount</span>
                <span className="text-flipkart-green">- ₹{parseInt(cart.subtotal * 0.2).toLocaleString()}</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total Amount</span>
                <span>₹{parseInt(cart.total).toLocaleString()}</span>
              </div>
              <div className="text-flipkart-green text-sm">
                You will save ₹{parseInt(cart.subtotal * 0.2).toLocaleString()} on this order
              </div>
            </div>
            
            <button
              onClick={() => navigate('/checkout')}
              className="w-full mt-6 bg-flipkart-orange text-white py-3 rounded-sm font-bold hover:bg-opacity-90 transition-all"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}