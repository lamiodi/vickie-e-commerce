import { Link } from 'react-router-dom';

const shopCategories = [
  {
    name: 'SHOP WOMEN',
    image: '/woman-stretching-fitness-yoga-athletic-wear-outdoo.jpg',
  },
  {
    name: 'SHOP MEN',
    image: '/muscular-man-wearing-black-tactical-t-shirt-gym.jpg',
  },
  {
    name: 'SHOP ACCESSORIES',
    image: '/black-sports-duffel-bag-gym-bag-modern-design.jpg',
  },
];

export function ShopCategories() {
  return (
    <section className="py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {shopCategories.map((category) => (
          <Link to="/products" key={category.name} className="group cursor-pointer block">
            <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
              <img
                src={category.image || '/placeholder.svg'}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="text-sm font-bold mt-3">{category.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
