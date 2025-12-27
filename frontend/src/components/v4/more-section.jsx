import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '@/lib/utils';
import { api } from '@/lib/api';

const tabs = ['TRENDING', 'ACCESSORIES', 'GYM', 'NEW'];

export function MoreSection() {
  const [activeTab, setActiveTab] = useState('TRENDING');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        let endpoint = '/products?limit=5';
        if (activeTab === 'TRENDING') endpoint += '&sort=trending';
        else if (activeTab === 'ACCESSORIES') endpoint += '&category=Accessories';
        else if (activeTab === 'GYM') endpoint += '&q=Gym';
        else if (activeTab === 'NEW') endpoint += '&sort=newest';

        const { data } = await api.get(endpoint);
        setItems(data.products || data || []);
      } catch (error) {
        console.error('Failed to fetch more section items', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [activeTab]);

  return (
    <section className="py-12 px-4 bg-gray-50">
      <h2 className="text-2xl font-bold mb-6">WAIT THERE&apos;S MORE...</h2>

      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
        {items.map((item) => (
          <Link
            to={`/products/${item.id}`}
            key={item.id}
            className="flex-shrink-0 w-72 group cursor-pointer block"
          >
            <div className="relative aspect-[4/3] bg-gray-200 mb-3 overflow-hidden rounded-lg">
              <img
                src={getImageUrl(item.image || item.images?.[0] || '/placeholder.svg')}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="text-xs font-bold mb-1 leading-tight line-clamp-1">{item.name}</h3>
            <p className="text-xs text-gray-600 line-clamp-2">
              {item.description || item.category}
            </p>
          </Link>
        ))}
        {loading && <div className="p-4 text-sm text-gray-500">Loading...</div>}
      </div>
    </section>
  );
}
