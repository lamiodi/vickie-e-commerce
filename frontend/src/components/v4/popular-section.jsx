import { useState } from 'react';
import { Link } from 'react-router-dom';

const tabs = ['WOMENS', 'MENS'];

const categories = {
  WOMENS: [
    {
      name: 'Gym Leggings',
      image: '/woman-in-black-gym-leggings-fitness-pose.jpg',
    },
    {
      name: 'Leggings With Pockets',
      image: '/woman-in-leggings-with-pockets-athletic.jpg',
    },
    {
      name: 'High Waisted Leggings',
      image: '/woman-in-high-waisted-leggings-workout.jpg',
    },
    {
      name: 'Black Leggings',
      image: '/woman-wearing-black-seamless-leggings-athletic-wea.jpg',
    },
  ],
  MENS: [
    {
      name: 'Gym Shorts',
      image: '/man-wearing-black-tactical-shorts-athletic.jpg',
    },
    {
      name: 'T-Shirts',
      image: '/muscular-man-wearing-black-tactical-t-shirt-gym.jpg',
    },
    {
      name: 'Joggers',
      image: '/man-wearing-black-tactical-joggers-workout.jpg',
    },
    {
      name: 'Hoodies',
      image: '/gray-hooded-jacket-sportswear.jpg',
    },
  ],
};

export function PopularSection() {
  const [activeTab, setActiveTab] = useState('WOMENS');

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
            to={`/products?q=${category.name}`}
            key={category.name}
            className="group cursor-pointer block"
          >
            <div className="relative aspect-[4/5] bg-gray-100 mb-3 overflow-hidden">
              <img
                src={category.image || '/placeholder.svg'}
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
