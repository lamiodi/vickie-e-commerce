import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '@/lib/utils';
import { api } from '@/lib/api';

const tabs = ['WOMENS', 'MENS'];

const initialCategories = {
  WOMENS: [
    { name: 'Gym Leggings', search: 'Leggings', image: '/placeholder.jpg' },
    { name: 'Leggings With Pockets', search: 'Pockets', image: '/placeholder.jpg' },
    { name: 'High Waisted Leggings', search: 'Waisted', image: '/placeholder.jpg' },
    { name: 'Black Leggings', search: 'Black', image: '/placeholder.jpg' },
  ],
  MENS: [
    { name: 'Gym Shorts', search: 'Shorts', image: '/placeholder.jpg' },
    { name: 'T-Shirts', search: 'T-Shirt', image: '/placeholder.jpg' },
    { name: 'Joggers', search: 'Joggers', image: '/placeholder.jpg' },
    { name: 'Hoodies', search: 'Hoodie', image: '/placeholder.jpg' },
  ],
};

export function PopularSection() {
  const [activeTab, setActiveTab] = useState('WOMENS');
  const [categories, setCategories] = useState(initialCategories);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchImages = async () => {
      const updatedCategories = { ...initialCategories };

      for (const tab of tabs) {
        updatedCategories[tab] = await Promise.all(
          initialCategories[tab].map(async (cat) => {
            try {
              const { data } = await api.get(`/products?q=${cat.search}&limit=1`);
              const products = data.products || data || [];
              const product = products[0];
              if (product && (product.image || product.images?.[0] || product.video_thumbnail_url)) {
                return { ...cat, image: product.image || product.images?.[0] || product.video_thumbnail_url };
              }
            } catch {
              console.warn('Failed to fetch image for popular section', cat.name);
            }
            return cat;
          })
        );
      }
      if (isMounted) {
        setCategories(updatedCategories);
        setIsLoading(false);
      }
    };
    fetchImages();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <section className="py-12 px-4">
        <h2 className="text-2xl font-bold mb-6">POPULAR RIGHT NOW</h2>
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <div key={tab} className="h-9 w-24 bg-gray-200 rounded-full animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[4/5] bg-gray-200 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4">
      <h2 className="text-2xl font-bold mb-6">POPULAR RIGHT NOW</h2>

      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab ? 'bg-black text-white' : 'bg-gray-100 text-black hover:bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories[activeTab].map((category) => (
          <Link
            to={`/products?q=${category.search}`}
            key={category.name}
            className="group cursor-pointer block"
          >
            <div className="relative aspect-[4/5] bg-gray-100 mb-3 overflow-hidden">
              <img
                src={getImageUrl(category.image)}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="text-sm font-medium">{category.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
