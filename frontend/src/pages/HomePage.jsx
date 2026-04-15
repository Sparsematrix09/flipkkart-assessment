import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductGrid from '../components/ProductGrid';
import { FaFilter, FaTimes } from 'react-icons/fa';

export default function HomePage({ API_URL }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    fetchCategories();
  }, []);
  
  useEffect(() => {
    const search = searchParams.get('search') || '';
    fetchProducts(search, selectedCategory);
  }, [searchParams, selectedCategory]);
  
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/categories`);
      setCategories(res.data);
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };
  
  const fetchProducts = async (search, category) => {
    setLoading(true);
    try {
      const url = `${API_URL}/api/products?search=${encodeURIComponent(search)}&category=${category}`;
      const res = await axios.get(url);
      setProducts(res.data);
    } catch (error) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };
  
  const FilterSidebar = () => (
    <div className="bg-white rounded-sm p-4">
      <div className="flex justify-between items-center mb-4 lg:hidden">
        <h3 className="font-bold text-lg">Filters</h3>
        <button onClick={() => setMobileFilterOpen(false)} className="text-gray-500">
          <FaTimes />
        </button>
      </div>
      <h3 className="font-bold text-lg mb-3 hidden lg:block">Filters</h3>
      
      <div className="mb-6">
        <h4 className="font-medium text-flipkart-text mb-2">CATEGORIES</h4>
        <div className="space-y-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`w-full text-left px-3 py-2 rounded transition-colors ${
              selectedCategory === '' 
                ? 'bg-flipkart-blue text-white' 
                : 'hover:bg-gray-100'
            }`}
          >
            All Products
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                selectedCategory === cat.id 
                  ? 'bg-flipkart-blue text-white' 
                  : 'hover:bg-gray-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="max-w-7xl mx-auto">
      {/* mobile filter button */}
      <div className="lg:hidden sticky top-16 z-40 bg-white shadow-sm p-3">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="w-full bg-flipkart-blue text-white py-2 rounded-sm flex items-center justify-center gap-2"
        >
          <FaFilter /> Filter by Category
        </button>
      </div>
      
      <div className="flex">
        {/* desktop sidebar */}
        <div className="hidden lg:block w-64 m-4">
          <FilterSidebar />
        </div>
        
        {/* mobile sidebar */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setMobileFilterOpen(false)}></div>
            <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
              <FilterSidebar />
            </div>
          </div>
        )}
        
        {/* products grid */}
        <div className="flex-1">
          <ProductGrid 
            products={products} 
            loading={loading} 
            API_URL={API_URL}
          />
        </div>
      </div>
    </div>
  );
}