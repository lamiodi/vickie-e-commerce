import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '@/lib/utils';

export function ProductCarousel({ title, category, viewAllLink, products }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-8 px-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs text-gray-500 uppercase tracking-wide">{category}</span>
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        <div className="flex items-center gap-4">
          <Link to={viewAllLink} className="text-sm underline underline-offset-4">
            View All
          </Link>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full border border-gray-200 hover:bg-gray-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full border border-gray-200 hover:bg-gray-100"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <Link
            to={`/products/${product.id}`}
            key={product.id}
            className="flex-shrink-0 w-48 md:w-56 group cursor-pointer block"
          >
            <div className="relative aspect-[3/4] bg-gray-100 mb-3 overflow-hidden">
              <img
                src={getImageUrl(product.image || '/placeholder.jpg')}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {product.badge && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase">
                  {product.badge}
                </div>
              )}
            </div>
            <h3 className="text-sm font-medium mb-1">{product.name}</h3>
            <p className="text-xs text-gray-500 mb-1">{product.colors.join(' / ')}</p>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">{product.price}</p>
              {product.originalPrice && (
                <p className="text-xs text-gray-400 line-through">{product.originalPrice}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
