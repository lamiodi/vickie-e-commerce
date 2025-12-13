import { Link } from 'react-router-dom';

const categories = [
  {
    name: 'GIVE THE GIFT OF PROGRESS',
    description: "Get your training partner something they'll like.",
    image: '/colorful-running-shoes-red-blue.jpg',
  },
  {
    name: 'LIFTING ESSENTIALS',
    description: "All of today's essentials for you to nail the lift.",
    image: '/dumbbell-weight-fitness-equipment.jpg',
  },
  {
    name: 'OUR BESTSELLERS',
    description: "Vickie Ecom classics that you've all loved.",
    image: '/woman-wearing-black-seamless-leggings-athletic-wea.jpg',
  },
  {
    name: 'WINTER SHOP',
    description: 'Layering season is here now. Keep that winter chill at bay.',
    image: '/gray-hooded-jacket-sportswear.jpg',
  },
  {
    name: 'A-GAME',
    description: 'Play hard. Train harder.',
    image: '/man-wearing-black-tactical-shorts-athletic.jpg',
  },
];

export function CategoryCards() {
  return (
    <section className="py-8 px-4">
      <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
        {categories.map((category) => (
          <Link
            to="/products"
            key={category.name}
            className="flex-shrink-0 w-56 group cursor-pointer block"
          >
            <div className="relative aspect-square bg-gray-100 mb-3 overflow-hidden rounded-lg">
              <img
                src={category.image || '/placeholder.svg'}
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
