import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from './AppIcons';
import { api } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';

export function HeroSection() {
  const [heroProduct, setHeroProduct] = useState(null);
  const [sideProducts, setSideProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products?limit=100');
        let products = [];
        if (Array.isArray(data)) {
          products = data;
        } else if (data && Array.isArray(data.products)) {
          products = data.products;
        } else {
          console.error('Invalid products response format', data);
          setHeroProduct(null); // Ensure fallback or null
          setLoading(false);
          return;
        }

        // Find Hero Product (Preferably Activewear or just the first available with image)
        const hero =
          products.find(
            (p) => (p.image || (p.images && p.images.length > 0)) && p.category === 'Activewear'
          ) ||
          products.find((p) => p.image || (p.images && p.images.length > 0)) ||
          products[0];

        setHeroProduct(hero);

        // Find side products - take next 3 available products excluding hero
        const sides = products.filter((p) => p.id !== hero?.id).slice(0, 3);

        setSideProducts(sides);
      } catch (error) {
        console.error('Failed to fetch hero products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="h-[480px] bg-gray-100 animate-pulse rounded-lg m-4" />;

  if (!heroProduct) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Hero */}
        <div className="lg:col-span-2 relative rounded-lg overflow-hidden h-[400px] lg:h-[480px] group">
          <img
            src={getImageUrl(heroProduct.image || heroProduct.images?.[0] || '/placeholder.jpg')}
            alt={heroProduct.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div className="absolute bottom-8 left-8 text-white max-w-sm">
            <p className="text-xs tracking-widest mb-2 opacity-80 uppercase">
              {heroProduct.category || 'NEW COLLECTION'}
            </p>
            <div className="h-0.5 w-12 bg-[#C41E3A] mb-4"></div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
              {heroProduct.name.toUpperCase()}
            </h1>
            <p className="text-sm opacity-80 mb-6 line-clamp-2">{heroProduct.description}</p>
            <Link
              to={`/products/${heroProduct.id}`}
              className="inline-block bg-[#C41E3A] hover:bg-[#a3182f] text-white px-6 py-3 text-sm font-medium transition-colors"
            >
              SHOP NOW
            </Link>
          </div>
        </div>

        {/* Side Column */}
        <div className="lg:col-span-1 grid grid-rows-4 gap-4 h-[400px] lg:h-[480px]">
          {/* Missing Grid Element: Top Banner (Coming Soon) */}
          <div className="row-span-1 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-5 relative overflow-hidden group flex items-center justify-between shadow-sm">
            <div className="relative z-10">
              <span className="inline-block px-2 py-0.5 rounded bg-[#C41E3A]/20 text-[#C41E3A] text-[10px] font-bold tracking-wider mb-2 border border-[#C41E3A]/30">
                COMING SOON
              </span>
              <h3 className="font-bold text-lg text-white leading-tight tracking-wide">
                GYM
                <br />
                ACCESSORIES
              </h3>
            </div>
            {/* Decorative Dumbbell Icon */}
            <div className="absolute right-[-10px] bottom-[-20px] opacity-10 rotate-[-12deg] transform group-hover:scale-110 transition-transform duration-500">
              <svg
                width="120"
                height="120"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-white"
              >
                <path d="M20.57 14.86L22 13.43L20.57 12L17 15.57L8.43 7L12 3.43L10.57 2L9.14 3.43L7.71 2L5.57 4.14L4.14 2.71L2.71 4.14L4.14 5.57L2 7.71L3.43 9.14L2 10.57L3.43 12L7 8.43L15.57 17L12 20.57L13.43 22L14.86 20.57L16.29 22L18.43 19.86L19.86 21.29L21.29 19.86L19.86 18.43L22 16.29L20.57 14.86Z" />
              </svg>
            </div>
          </div>

          {/* Product List */}
          {sideProducts.map((product) => (
            <div
              key={product.id}
              className="row-span-1 bg-[#f5f5f5] rounded-lg p-4 flex justify-between items-center relative overflow-hidden group"
            >
              <div className="flex flex-col justify-center relative z-10">
                <h3 className="text-xs font-medium mb-1 leading-tight font-quicksand group-hover:text-[#C41E3A] transition-colors">
                  {product.name.toUpperCase()}
                </h3>
                <p className="text-[10px] font-medium font-quicksand mb-1">
                  £{Number(product.price).toFixed(2)}
                </p>
                <Link
                  to={`/products/${product.id}`}
                  className="text-[10px] flex items-center gap-1 hover:text-[#C41E3A] transition-colors font-medium"
                >
                  Shop Now <ArrowRightIcon className="w-3 h-3" />
                </Link>
              </div>
              <img
                src={getImageUrl(product.image || product.images?.[0] || '/placeholder.jpg')}
                alt={product.name}
                className="w-14 h-14 object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
