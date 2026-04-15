import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaUserCircle, FaChevronDown, FaHistory } from 'react-icons/fa';

export default function Navbar({ cartCount }) {
  const [search, setSearch] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
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
          {/* Logo */}
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

          {/* profile dropdown-order history */}
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="bg-white text-flipkart-blue px-6 py-1.5 font-medium rounded-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <FaUserCircle size={18} />
              My Account
              <FaChevronDown size={12} />
            </button>
            
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-sm shadow-lg py-2 z-50">
                <button
                  onClick={() => {
                    navigate('/orders');
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <FaHistory /> Order History
                </button>
                <hr className="my-1" />
                <div className="px-4 py-2 text-xs text-gray-500">
                  Guest User
                </div>
              </div>
            )}
          </div>

          {/* seller */}
          <div className="text-white font-medium cursor-pointer hover:underline hidden lg:block">
            Become a Seller
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