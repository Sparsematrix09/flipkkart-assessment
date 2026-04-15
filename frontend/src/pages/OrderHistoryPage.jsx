import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBox, FaCalendarAlt, FaRupeeSign, FaMapMarkerAlt, FaPhone, FaEye, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function OrderHistoryPage({ API_URL }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/orders/history`);
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'placed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'placed':
        return 'Order Placed';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded mb-6 w-64"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-sm p-6 mb-4">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white rounded-sm text-center py-16">
          <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-medium text-gray-600 mb-2">No Orders Yet</h2>
          <p className="text-flipkart-text mb-6">You haven't placed any orders yet</p>
          <button 
            onClick={() => navigate('/')} 
            className="bg-flipkart-blue text-white px-8 py-2 rounded-sm hover:bg-opacity-90"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
        <p className="text-flipkart-text">View all your past orders</p>
      </div>

      {/* orders list */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-sm shadow-sm overflow-hidden">
            {/* order header */}
            <div 
              className="p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleOrderDetails(order.id)}
            >
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <FaBox className="text-flipkart-blue text-xl" />
                  <div>
                    <p className="text-sm text-flipkart-text">Order ID</p>
                    <p className="font-mono font-medium text-gray-800">{order.id.slice(0, 8)}...</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-flipkart-text">Total Amount</p>
                    <p className="font-bold text-lg text-gray-800">₹{parseInt(order.total_amount).toLocaleString()}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-flipkart-text">Order Date</p>
                    <p className="text-sm text-gray-600">{order.created_at}</p>
                  </div>
                  
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  
                  <div className="text-gray-400">
                    {expandedOrder === order.id ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </div>
              </div>
            </div>

            {/* order details (expandable) */}
            {expandedOrder === order.id && (
              <div className="p-4 bg-gray-50">
                {/* shipping address */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-flipkart-blue" />
                    Shipping Address
                  </h3>
                  <div className="bg-white rounded-sm p-3">
                    <p className="font-medium">{order.full_name}</p>
                    <p className="text-sm text-gray-600">{order.address_line}</p>
                    <p className="text-sm text-gray-600">{order.city}, {order.state} - {order.pincode}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <FaPhone size={12} /> {order.phone}
                    </p>
                  </div>
                </div>

                {/* order items */}
                <div>
                  <h3 className="font-medium text-gray-800 mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {order.items && order.items.map((item, idx) => (
                      <div key={idx} className="bg-white rounded-sm p-3 flex flex-col sm:flex-row gap-4">
                        <img 
                          src={item.image} 
                          alt={item.product_name}
                          className="w-20 h-20 object-contain"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{item.product_name}</p>
                          <div className="flex flex-wrap justify-between items-center mt-2">
                            <div>
                              <span className="text-lg font-bold">₹{parseInt(item.price).toLocaleString()}</span>
                              <span className="text-flipkart-text text-sm ml-2">Quantity: {item.quantity}</span>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-flipkart-text">Subtotal</p>
                              <p className="font-medium">₹{parseInt(item.subtotal).toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* order summary */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-flipkart-text">Total Items: {order.items?.length || 0}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-flipkart-text">Order Total</p>
                      <p className="text-2xl font-bold text-flipkart-green">₹{parseInt(order.total_amount).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* back to shopping button */}
      <div className="mt-8 text-center">
        <button
          onClick={() => navigate('/')}
          className="bg-flipkart-blue text-white px-6 py-2 rounded-sm hover:bg-opacity-90 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}