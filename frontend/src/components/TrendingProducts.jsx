import { useEffect, useState } from 'react';
import { ProductCard } from './ProductCard';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';
import { getImageUrl } from '@/lib/utils';

export const TrendingProducts = () => {
  const [products, setProducts] = useState([]);
  const [bannerProduct, setBannerProduct] = useState(null);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const response = await api.get('/products?limit=100');
        const data = response.data;
        let allProducts = [];
        if (Array.isArray(data)) {
          allProducts = data;
        } else if (data && Array.isArray(data.products)) {
          allProducts = data.products;
        }

        // Find a specific product for the banner (e.g., Winter/Snow related or just an Activewear item)
        // Design shows a snowboarder - let's look for something "outdoor" or just pick a cool image
        const banner =
          allProducts.find(
            (p) =>
              (p.image || p.images?.[0]) &&
              (p.category === 'Activewear' || p.category === 'Hoodies')
          ) || allProducts[0];
        setBannerProduct(banner);

        // Sort by trending (mock logic: just take some distinct products)
        const trendingProducts = allProducts.filter((p) => p.id !== banner?.id).slice(0, 6); // 2x3 grid or 6 items

        setProducts(trendingProducts);
      } catch (error) {
        console.error('Error fetching trending products:', error);
      }
    };

    fetchTrendingProducts();
  }, []);

  return (
    <section className="py-16 max-w-7xl mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold font-poiret">Trending Products</h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Sorting:</span>
          <select className="border-none bg-transparent font-medium text-black focus:ring-0 cursor-pointer">
            <option>All Products</option>
            <option>Best Selling</option>
            <option>Newest</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Banner */}
        {bannerProduct && (
          <div className="lg:col-span-1 relative h-[400px] lg:h-auto rounded-lg overflow-hidden group">
            <img
              src={getImageUrl(
                bannerProduct.image || bannerProduct.images?.[0] || '/placeholder.jpg'
              )}
              alt="Reach the highest peak"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute top-8 left-0 right-0 text-center">
              <h3 className="text-xl font-bold tracking-widest uppercase">
                <span className="text-white">ASWBY</span>
                <span className="text-[#C41E3A] drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">VICKIE</span>
              </h3>
            </div>
            <div className="absolute bottom-12 left-0 right-0 text-center px-4">
              <p className="text-white text-sm tracking-widest mb-2 uppercase opacity-90">
                REACH THE
              </p>
              <h2 className="text-white text-3xl font-bold uppercase mb-6 leading-tight">
                HIGHEST
                <br />
                PEAK
              </h2>
              <Link
                to={`/products/${bannerProduct.id}`}
                className="inline-block bg-[#C41E3A] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors"
              >
                SHOP NOW
              </Link>
            </div>
          </div>
        )}

        {/* Right Grid */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length > 0
            ? products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  placeholderImage="/placeholder.jpg"
                />
              ))
            : null}
        </div>
      </div>
    </section>
  );
};
