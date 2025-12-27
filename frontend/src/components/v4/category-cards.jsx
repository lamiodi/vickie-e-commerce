import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';

const initialCategories = [
  {
    name: 'GIVE THE GIFT OF PROGRESS',
    description: "Get your training partner something they'll like.",
    search: 'Accessories', // Fallback search term
    image: '/placeholder.jpg',
  },
  {
    name: 'LIFTING ESSENTIALS',
    description: "All of today's essentials for you to nail the lift.",
    search: 'Lifting', // Better search term
    image: '/placeholder.jpg',
  },
  {
    name: 'OUR BESTSELLERS',
    description: "Vickie Ecom classics that you've all loved.",
    search: 'Hoodie',
    image: '/placeholder.jpg',
  },
  {
    name: 'WINTER SHOP',
    description: 'Layering season is here now. Keep that winter chill at bay.',
    search: 'Jacket',
    image: '/placeholder.jpg',
  },
  {
    name: 'A-GAME',
    description: 'Play hard. Train harder.',
    search: 'Shorts',
    image: '/placeholder.jpg',
  },
];

export function CategoryCards() {
  const [categories, setCategories] = useState(initialCategories);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const updated = await Promise.all(
          initialCategories.map(async (cat) => {
            try {
              // Search by query (q) or category
              const { data } = await api.get(`/products?q=${cat.search}&limit=1`);
              const products = data.products || data || [];
              const product = products[0];
              if (product && (product.image || product.images?.[0] || product.video_thumbnail_url)) {
                return { ...cat, image: product.image || product.images?.[0] || product.video_thumbnail_url };
              }
            } catch {
              console.warn('Failed to fetch image for category card', cat.name);
            }
            return cat;
          })
        );
        setCategories(updated);
      } catch (error) {
        console.error('Failed to fetch category card images', error);
      }
    };
    fetchImages();
  }, []);

  return (
    <section className="py-8 px-4">
      <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
        {categories.map((category) => (
          <Link
            to={`/products?q=${category.search}`}
            key={category.name}
            className="flex-shrink-0 w-56 group cursor-pointer block"
          >
            <div className="relative aspect-square bg-gray-100 mb-3 overflow-hidden rounded-lg">
              <img
                src={getImageUrl(category.image)}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="text-sm font-bold mb-1">{category.name}</h3>
            <p className="text-xs text-gray-600">{category.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
