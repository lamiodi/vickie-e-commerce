import { useState } from 'react';
import { Link } from 'react-router-dom';

const tabs = ['GUIDES', 'TRENDING', 'TRAINING', 'APPS'];

const articles = [
  {
    title: 'WHAT LENGTH GYM SHORTS SHOULD I BE WEARING?',
    description:
      'A useful guide to help you find the right length, short, shorts are great for gym, sport, and...',
    image: '/man-wearing-black-tactical-shorts-athletic.jpg',
  },
  {
    title: 'LEGGINGS GUIDE',
    description:
      'Shop leggings tips including info on our fabrics and compression styles and more...',
    image: '/woman-wearing-black-seamless-leggings-athletic-wea.jpg',
  },
  {
    title: 'SPORTS BRA GUIDE',
    description:
      'Find the right high impact medium and low impact sports bra depending on exercise...',
    image: '/woman-wearing-black-sports-bra-athletic.jpg',
  },
  {
    title: "MEN'S SHORTS GUIDE",
    description:
      'Everything you need to know including 5 inch, 7 inch, or longer length options...',
    image: '/man-wearing-black-tactical-shorts-athletic.jpg',
  },
  {
    title: 'NEW IN',
    description: 'The latest products from Vickie Ecom, including new drops...',
    image: '/athletic-woman-in-dark-seamless-workout-outfit-pos.jpg',
  },
];

export function MoreSection() {
  const [activeTab, setActiveTab] = useState('GUIDES');

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
        {articles.map((article) => (
          <Link
            to="#"
            key={article.title}
            className="flex-shrink-0 w-72 group cursor-pointer block"
          >
            <div className="relative aspect-[4/3] bg-gray-200 mb-3 overflow-hidden rounded-lg">
              <img
                src={article.image || '/placeholder.svg'}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="text-xs font-bold mb-1 leading-tight">{article.title}</h3>
            <p className="text-xs text-gray-600 line-clamp-2">{article.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
