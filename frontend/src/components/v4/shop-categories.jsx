import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';

const initialShopCategories = [
  {
    name: 'SHOP WOMEN',
    slug: 'Women',
    image: '/placeholder.jpg',
  },
  {
    name: 'SHOP MEN',
    slug: 'Men',
    image: '/placeholder.jpg',
  },
  {
    name: 'SHOP ACCESSORIES',
    slug: 'Accessories',
    image: '/placeholder.jpg',
  },
];

export function ShopCategories() {
  const [categories, setCategories] = useState(initialShopCategories);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const updated = await Promise.all(
          initialShopCategories.map(async (cat) => {
            try {
              const { data } = await api.get(`/products?category=${cat.slug}&limit=1`);
              const products = data.products || data || [];
              const product = products[0];
              if (product && (product.image || product.images?.[0] || product.video_thumbnail_url)) {
                return { ...cat, image: product.image || product.images?.[0] || product.video_thumbnail_url };
              }
            } catch {
              console.warn('Failed to fetch image for category', cat.name);
            }
            return cat;
          })
        );
        setCategories(updated);
      } catch (error) {
        console.error('Failed to fetch shop category images', error);
      }
    };
    fetchImages();
  }, []);

  return (
    <section className="py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Link
            to={`/products?category=${category.slug}`}
            key={category.name}
            className="group cursor-pointer block relative h-[600px] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gray-200">
              <img
                src={getImageUrl(category.image)}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors duration-300" />
            <div className="absolute bottom-8 left-8">
              <h3 className="text-white text-3xl font-bold uppercase tracking-tight drop-shadow-md">
                {category.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
