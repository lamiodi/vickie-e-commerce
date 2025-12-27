import { Link } from 'react-router-dom';
import { getImageUrl } from '@/lib/utils';

export function TacticalSection({
  title = "ALICIA'S SET\nLIVE",
  subtitle = "Discover the perfect balance of comfort and support with our newest collection.\nIt's here.",
  image = '/woman-wearing-gray-seamless-leggings-gym.jpg',
  link = '/products?q=Alicia',
}) {
  return (
    <section className="relative bg-[#f5f0e8] overflow-hidden my-8">
      <div className="flex flex-col md:flex-row min-h-[400px]">
        <div className="flex-1 relative min-h-[250px] md:min-h-auto">
          <img
            src={getImageUrl(image)}
            alt="Collection"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-black whitespace-pre-line">
            {title}
          </h2>
          <p className="text-gray-700 mb-6 max-w-md text-sm whitespace-pre-line line-clamp-3 md:line-clamp-4">{subtitle}</p>
          <Link
            to={link}
            className="text-black underline underline-offset-4 text-sm font-medium hover:no-underline"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}
