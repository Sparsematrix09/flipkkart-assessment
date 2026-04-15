import { useParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaHome } from 'react-icons/fa';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-flipkart-gray flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-sm p-8 text-center shadow-lg">
        <FaCheckCircle className="text-6xl text-flipkart-green mx-auto mb-4" />
        
        <h1 className="text-2xl font-bold text-flipkart-green mb-2">
          Order Placed Successfully!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Thank you for shopping with us
        </p>
        
        <div className="bg-gray-50 rounded-sm p-4 mb-6">
          <p className="text-flipkart-text text-sm mb-1">Order ID</p>
          <p className="text-xl font-mono font-bold text-gray-800">{orderId}</p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-flipkart-blue text-white py-3 rounded-sm font-medium hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <FaHome /> Continue Shopping
          </button>
          
          <button
            onClick={() => navigate('/orders')}
            className="w-full border border-flipkart-blue text-flipkart-blue py-3 rounded-sm font-medium hover:bg-blue-50 transition-all"
          >
            View Order History
          </button>
        </div>
        
      </div>
    </div>
  );
}