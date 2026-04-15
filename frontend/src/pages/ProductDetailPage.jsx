import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import ProductCarousel from '../components/ProductCarousel';

export default function ProductDetailPage({ API_URL, setCartCount }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  useEffect(() => {
    fetchProduct();
  }, [id]);
  
  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products/${id}`);
      setProduct(res.data);
    } catch (error) {
      toast.error('Failed to load product');
      navigate('/');
    }
  };
  
  const addToCart = async () => {
    try {
      await axios.post(`${API_URL}/api/cart/add`, {
        productId: id,
        quantity: quantity
      });
      
      // Update cart count
      const res = await axios.get(`${API_URL}/api/cart`);
      const count = res.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      if (setCartCount) setCartCount(count);
      
      toast.success(`Added ${quantity} item(s) to cart`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add to cart');
    }
  };
  
  const buyNow = async () => {
    await addToCart();
    navigate('/cart');
  };
  
  if (!product) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-flipkart-blue"></div>
    </div>
  );
  
  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="bg-white rounded-sm overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 p-6">
          {/* Left Column - Images */}
          <div>
            <ProductCarousel images={product.images || [product.image]} />
          </div>
          
          {/* Right Column - Details */}
          <div>
            <h1 className="text-2xl font-medium text-gray-800 mb-2">{product.name}</h1>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-flipkart-green text-white px-2 py-0.5 rounded text-sm flex items-center gap-1">
                ★ {product.rating || '4.5'}
              </span>
              <span className="text-flipkart-text text-sm">{product.brand}</span>
            </div>
            
            <div className="mb-4">
              <span className="text-3xl font-bold">₹{parseInt(product.price).toLocaleString()}</span>
              <span className="text-flipkart-text text-sm line-through ml-2">
                ₹{parseInt(product.price * 1.2).toLocaleString()}
              </span>
              <span className="text-flipkart-green text-sm ml-2">20% off</span>
            </div>
            
            <div className="mb-4">
              <span className={`font-medium ${product.stock > 0 ? 'text-flipkart-green' : 'text-red-500'}`}>
                {product.stock > 0 ? '✓ In Stock' : '✗ Out of Stock'}
              </span>
              {product.stock > 0 && product.stock < 20 && (
                <span className="text-orange-500 text-sm ml-2">Only {product.stock} left</span>
              )}
            </div>
            
            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="mb-4 flex items-center gap-3">
                <span className="text-flipkart-text">Quantity:</span>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="border rounded-sm px-3 py-1 focus:outline-none focus:border-flipkart-blue"
                >
                  {[...Array(Math.min(10, product.stock))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="flex gap-3 mb-6">
              <button
                onClick={addToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-flipkart-yellow text-white py-3 rounded-sm font-medium hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                🛒 ADD TO CART
              </button>
              <button
                onClick={buyNow}
                disabled={product.stock === 0}
                className="flex-1 bg-flipkart-orange text-white py-3 rounded-sm font-medium hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                BUY NOW
              </button>
            </div>
            
            {/* Description */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Product Description</h3>
              <p className="text-gray-600 text-sm">{product.description}</p>
            </div>
            
            {/* Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-2">Specifications</h3>
                <div className="space-y-1">
                  {product.specifications.map((spec, idx) => (
                    <div key={idx} className="flex text-sm">
                      <span className="w-32 text-flipkart-text">{spec.spec_key}</span>
                      <span className="text-gray-800">{spec.spec_value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}