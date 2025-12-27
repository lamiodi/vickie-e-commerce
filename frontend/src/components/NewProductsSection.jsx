import { useState, useEffect } from 'react';
import { ArrowRightIcon } from './AppIcons';
import { api } from '@/lib/api';
import { Link } from 'react-router-dom';
import { getImageUrl, convertPrice, formatPrice } from '@/lib/utils';
import { usePreferences } from '@/contexts/PreferencesContext';

export function NewProductsSection() {
  const [newProducts, setNewProducts] = useState([]);
  const { currency, exchangeRates, isLoading } = usePreferences();

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        // Fetch all products and sort by newest first
        const response = await api.get('/products?limit=100');
        const data = response.data;
        let products = [];
        if (Array.isArray(data)) {
          products = data;
        } else if (data && Array.isArray(data.products)) {
          products = data.products;
        } else {
          console.error('Invalid new products response', data);
        }

        // Sort by creation date (newest first) and take first 3
        const sortedProducts = products
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 3);

        setNewProducts(sortedProducts);
      } catch (error) {
        console.error('Failed to fetch new products', error);
        setNewProducts([]);
      }
    };
    fetchNewProducts();
  }, []);

  const featuredProduct = newProducts[0];
  const gridProducts = newProducts.slice(1, 3);

  if (newProducts.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Featured Banner */}
        {featuredProduct && (
          <div className="relative rounded-lg overflow-hidden h-[350px] lg:h-auto group">
            <img
              src={getImageUrl(
                featuredProduct.image || featuredProduct.images?.[0] || '/placeholder.jpg'
              )}
              alt={featuredProduct.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white max-w-sm">
              <p className="text-[#C41E3A] text-xs tracking-wider mb-2 uppercase">
                {featuredProduct.category || 'NEW ARRIVAL'}
              </p>
              <h3 className="text-3xl font-bold leading-tight mb-2">
                {featuredProduct.name.toUpperCase()}
              </h3>
              <div className="h-0.5 w-12 bg-[#C41E3A] mb-4"></div>
              <p className="text-sm opacity-80 mb-4 line-clamp-2">{featuredProduct.description}</p>
              <Link
                to={`/products/${featuredProduct.id}`}
                className="flex items-center gap-2 text-sm font-medium hover:text-[#C41E3A] transition-colors"
              >
                Shop Now <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Right Column: Header & Grid */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="relative">
              <h2 className="text-2xl font-bold font-poiret">New Products</h2>
              <div className="absolute -bottom-4 left-0 w-12 h-1 bg-[#C41E3A]"></div>
            </div>
            <Link
              to="/products?sort=newest"
              className="flex items-center gap-2 text-sm text-[#C41E3A] hover:underline"
            >
              View All <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {gridProducts.map((product) => (
              <Link to={`/products/${product.id}`} key={product.id} className="group">
                <div className="bg-[#f5f5f5] rounded-lg p-4 mb-3 relative overflow-hidden aspect-square">
                  {product.originalPrice && (
                    <span className="absolute top-3 left-3 bg-[#C41E3A] text-white text-[10px] px-2 py-1 rounded">
                      SALE
                    </span>
                  )}
                  <img
                    src={getImageUrl(product.image || product.images?.[0] || '/placeholder.jpg')}
                    alt={product.name}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-[#C41E3A] text-xs font-black uppercase tracking-wide font-poiret mb-1">
                  {product.category}
                </p>
                <h4 className="text-sm font-medium mt-1 mb-1 group-hover:text-[#C41E3A] transition-colors font-quicksand truncate">{product.name}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium font-quicksand">
                    {isLoading ? (
                      <span className="inline-block w-12 h-4 bg-gray-200 animate-pulse rounded"></span>
                    ) : (
                      formatPrice(
                        convertPrice(
                          Number(product.price),
                          'GBP',
                          currency,
                          exchangeRates
                        ),
                        currency
                      )
                    )}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      {isLoading ? (
                        <span className="inline-block w-10 h-3 bg-gray-200 animate-pulse rounded"></span>
                      ) : (
                        formatPrice(
                          convertPrice(
                            Number(product.originalPrice),
                            'GBP',
                            currency,
                            exchangeRates
                          ),
                          currency
                        )
                      )}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
