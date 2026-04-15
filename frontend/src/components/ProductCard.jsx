import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function ProductCard({ product, API_URL, setCartCount }) {
  const navigate = useNavigate();
  
  const addToCart = async (e) => {
    e.stopPropagation();
    try {
      await axios.post(`${API_URL}/api/cart/add`, {
        productId: product.id,
        quantity: 1
      });
      
      // Update cart count
      const res = await axios.get(`${API_URL}/api/cart`);
      const count = res.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      if (setCartCount) setCartCount(count);
      
      toast.success('Added to cart', {
        duration: 2000,
        icon: '🛒',
        style: {
          background: '#388e3c',
          color: '#fff',
        }
      });
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };
  
  return (
    <div 
      className="product-card bg-white rounded-sm cursor-pointer overflow-hidden group"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-48 object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />
        {product.stock < 10 && product.stock > 0 && (
          <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Out of Stock
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-800 text-sm line-clamp-2 min-h-[40px]">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="bg-flipkart-green text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
            ★ {product.rating || '4.5'}
          </span>
          <span className="text-flipkart-text text-xs">{product.brand}</span>
        </div>
        <div className="mt-2">
          <span className="text-lg font-bold">₹{parseInt(product.price).toLocaleString()}</span>
          <span className="text-flipkart-text text-sm line-through ml-2">
            ₹{parseInt(product.price * 1.2).toLocaleString()}
          </span>
          <span className="text-flipkart-green text-sm ml-2">20% off</span>
        </div>
        <button 
          onClick={addToCart} 
          className="w-full mt-3 bg-flipkart-orange text-white py-2 rounded-sm font-medium hover:bg-opacity-90 transition-all"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}