import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from './AppIcons';
import { api } from '@/lib/api';

const initialCategories = [
  {
    name: 'ACTIVEWEAR',
    slug: 'Activewear',
    defaultImage: '/placeholder.jpg',
  },
  {
    name: 'WAIST TRAINERS',
    slug: 'Waist Trainers',
    defaultImage: '/placeholder.jpg',
  },
  {
    name: 'ACCESSORIES',
    slug: 'Accessories',
    defaultImage: '/placeholder.jpg',
    isComingSoon: true,
  },
  {
    name: 'GYM SOCKS',
    slug: 'Gym Socks',
    defaultImage: '/placeholder.jpg',
  },
  {
    name: 'BAGS',
    slug: 'Bags',
    defaultImage: '/placeholder.jpg',
  },
];

export function CategorySection() {
  const [categories, setCategories] = useState(initialCategories);

  useEffect(() => {
    const fetchCategoryImages = async () => {
      try {
        // Fetch products to find representative images for each category
        const { data } = await api.get('/products?limit=100');
        let products = [];
        if (Array.isArray(data)) {
          products = data;
        } else if (data && Array.isArray(data.products)) {
          products = data.products;
        }

        // Map initial categories to real images
        const updatedCategories = initialCategories.map((cat) => {
          // Find a product in this category with an image
          const product = products.find(
            (p) =>
              p.category &&
              p.category.toLowerCase() === cat.slug.toLowerCase() &&
              (p.image || (p.images && p.images.length > 0))
          );

          return {
            ...cat,
            image: product ? product.image || product.images[0] : cat.defaultImage,
          };
        });

        setCategories(updatedCategories);
      } catch (error) {
        console.error('Failed to fetch category images', error);
        // Fallback to initial categories
        setCategories(initialCategories);
      }
    };
    fetchCategoryImages();
  }, []);

  return (
    <section className="max-w-[1400px] mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-12 uppercase tracking-tight font-poiret">
        Shop By Category
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 h-auto lg:h-[500px]">
        {categories.map((category, index) => {
          if (category.isComingSoon) {
            return (
              <div
                key={index}
                className="relative rounded-xl overflow-hidden group cursor-default h-[300px] lg:h-full bg-gradient-to-br from-gray-900 to-gray-800"
              >
                {/* Decorative Dumbbell Icon */}
                <div className="absolute right-[-20px] bottom-[-20px] opacity-10 rotate-[-12deg] transform group-hover:scale-110 transition-transform duration-500">
                  <svg
                    width="240"
                    height="240"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-white"
                  >
                    <path d="M20.57 14.86L22 13.43L20.57 12L17 15.57L8.43 7L12 3.43L10.57 2L9.14 3.43L7.71 2L5.57 4.14L4.14 2.71L2.71 4.14L4.14 5.57L2 7.71L3.43 9.14L2 10.57L3.43 12L7 8.43L15.57 17L12 20.57L13.43 22L14.86 20.57L16.29 22L18.43 19.86L19.86 21.29L21.29 19.86L19.86 18.43L22 16.29L20.57 14.86Z" />
                  </svg>
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center h-full z-10 p-6">
                  <span className="inline-block px-3 py-1 bg-[#C41E3A]/20 text-[#C41E3A] text-[10px] font-bold tracking-widest uppercase mb-4 rounded-full border border-[#C41E3A]/30">
                    COMING SOON
                  </span>
                  <h3 className="font-bold text-3xl text-white leading-tight tracking-wide text-center">
                    GYM
                    <br />
                    ACCESSORIES
                  </h3>
                </div>
              </div>
            );
          }

          return (
            <div
              key={index}
              className="relative rounded-xl overflow-hidden group cursor-pointer h-[300px] lg:h-full"
            >
              {/* Background Image */}
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlays */}
              <div className="absolute inset-0 transition-opacity duration-300 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                  <h3 className="text-white font-bold text-xl mb-2 tracking-wider">
                    {category.name}
                  </h3>
                  <Link
                    to={`/products?category=${category.slug}`}
                    className="inline-flex items-center gap-2 text-sm text-gray-300 group-hover:text-white transition-colors uppercase tracking-wide font-medium"
                  >
                    Shop Now <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
