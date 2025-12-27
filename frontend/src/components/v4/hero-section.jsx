import { Link } from 'react-router-dom';

export function HeroSection({ title, subtitle, image, link }) {
  return (
    <section className="relative bg-[#1a1a1a] text-white overflow-hidden">
      <div className="flex flex-col md:flex-row min-h-[500px]">
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            {title || 'NEW IN'}
          </h1>
          <p className="text-gray-300 mb-6 max-w-md text-sm leading-relaxed line-clamp-3 md:line-clamp-4">
            {subtitle ||
              'Elevate your workout wardrobe with our latest collection. Designed for style and performance.'}
          </p>
          <Link
            to={link || '/products'}
            className="text-white underline underline-offset-4 text-sm font-medium hover:no-underline"
          >
            Shop Now
          </Link>
        </div>
        <div className="flex-1 relative min-h-[300px] md:min-h-auto">
          <img
            src={image || '/placeholder.jpg'}
            alt={title || 'Collection'}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        </div>
      </div>
    </section>
  );
}
