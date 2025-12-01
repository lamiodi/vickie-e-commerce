import { useState, useEffect } from 'react';
import { HeartIcon } from './Icons';
import { api } from '@/lib/api';
import { Link } from 'react-router-dom';

export function TrendingProducts() {
  const [trendingProducts, setTrendingProducts] = useState([]);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        // Adjust endpoint
        const response = await api.get('/products?sort=trending&limit=6');
        // Ensure we map the data correctly if needed
        const products = response.data.products || response.data || [];
        setTrendingProducts(products);
      } catch (error) {
        console.error('Failed to fetch trending products', error);
        setTrendingProducts([]);
      }
    };
    fetchTrendingProducts();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Trending Products</h2>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Sort by</span>
            <button className="flex items-center gap-1 text-black font-medium">
              All Products
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Promotional Banner */}
        <div className="col-span-1 row-span-2 relative rounded-lg overflow-hidden hidden lg:block">
          <img
            src="/placeholder.svg?height=500&width=300"
            alt="Reach The Highest Peak"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-8 left-6 text-white">
            <p className="text-xs tracking-wider mb-2 opacity-80">REACH THE</p>
            <h3 className="text-3xl font-bold mb-4">HIGHEST PEAK</h3>
            <button className="bg-[#C41E3A] hover:bg-[#a3182f] text-white px-6 py-2 text-sm font-medium transition-colors">
              SHOP NOW
            </button>
          </div>
        </div>

        {/* Product Cards */}
        {trendingProducts.length > 0 ? (
          trendingProducts.map((product, index) => (
            <Link to={`/products/${product.id}`} key={product.id} className="group">
              <div className="bg-[#f5f5f5] rounded-lg p-4 mb-3 relative overflow-hidden aspect-square">
                <span className="absolute top-3 left-3 text-gray-400 text-xs font-medium">
                  {index + 1}
                </span>
                {product.sale && (
                  <span className="absolute top-3 right-3 bg-[#C41E3A] text-white text-[10px] px-2 py-1 rounded">
                    SALE
                  </span>
                )}
                <button className="absolute top-3 right-3 p-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <HeartIcon className="w-4 h-4" />
                </button>
                <img
                  src={product.image || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-[#C41E3A] text-[10px] font-medium tracking-wider mb-1">
                {product.category}
              </p>
              <h4 className="font-medium text-sm mb-1">{product.name}</h4>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">
                  ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-gray-400 text-xs line-through">
                    $
                    {typeof product.originalPrice === 'number'
                      ? product.originalPrice.toFixed(2)
                      : product.originalPrice}
                  </span>
                )}
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-2 lg:col-span-3 flex items-center justify-center text-gray-500 text-sm">
            Loading trending products...
          </div>
        )}
      </div>
    </section>
  );
}
