import ProductCard from './ProductCard';

export default function ProductGrid({ products, loading, API_URL, setCartCount }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-sm p-4 animate-pulse">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded mt-4"></div>
            <div className="h-4 bg-gray-200 rounded mt-2 w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded mt-4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-medium text-gray-600">No products found</h3>
        <p className="text-flipkart-text mt-2">Try searching for something else</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {products.map(product => (
        <ProductCard 
          key={product.id} 
          product={product} 
          API_URL={API_URL}
          setCartCount={setCartCount}
        />
      ))}
    </div>
  );
}