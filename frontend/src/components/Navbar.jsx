import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaUserCircle, FaChevronDown } from 'react-icons/fa';

export default function Navbar({ cartCount }) {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <nav className="bg-flipkart-blue sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4 lg:gap-8">
          <div 
            onClick={() => navigate('/')} 
            className="cursor-pointer flex flex-col items-start"
          >
            <span className="text-white text-xl font-bold italic">Flipkart</span>
            <div className="text-white text-[11px] leading-3 flex items-center gap-1">
              <span>Explore</span>
              <span className="text-flipkart-yellow font-semibold">Plus</span>
              <img 
                src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/plus_aef861.png" 
                alt="plus" 
                className="h-3 w-3"
              />
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products, brands and more"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 pr-12 rounded-sm text-gray-700 focus:outline-none shadow-sm"
              />
              <button 
                type="submit" 
                className="absolute right-0 top-0 h-full px-4 text-flipkart-blue hover:text-flipkart-orange transition-colors"
              >
                <FaSearch size={18} />
              </button>
            </div>
          </form>

          {/* login button (static) */}
          <div className="relative group">
            <button className="bg-white text-flipkart-blue px-8 py-1.5 font-medium rounded-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
              <FaUserCircle size={18} />
              Guest
              <FaChevronDown size={12} />
            </button>
          </div>

          {/* seller */}
          <div className="text-white font-medium cursor-pointer hover:underline hidden lg:block">
            Become a Seller
          </div>

          {/* more */}
          <div className="text-white font-medium cursor-pointer hover:underline hidden lg:block flex items-center gap-1">
            More
            <FaChevronDown size={12} />
          </div>

          {/* cart */}
          <div 
            onClick={() => navigate('/cart')} 
            className="text-white font-medium cursor-pointer hover:underline flex items-center gap-2 relative"
          >
            <FaShoppingCart size={20} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-flipkart-orange text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}