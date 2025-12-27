import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '@/lib/utils';
import { api } from '@/lib/api';

const trainingTypes = ['LIFTING', 'RUNNING', 'TRAINING', 'HIIT'];

export function TrainSection() {
  const [activeType, setActiveType] = useState('LIFTING');
  const [images, setImages] = useState({});

  useEffect(() => {
    const fetchImages = async () => {
      const typeImages = {};

      for (const type of trainingTypes) {
        try {
          const { data } = await api.get(`/products?q=${type}&limit=4`);
          const products = data.products || data || [];
          typeImages[type] = products.map((p) =>
            getImageUrl(p.image || p.images?.[0] || '/placeholder.svg')
          );

          // Fill missing with placeholder
          while (typeImages[type].length < 4) {
             // Use the last available image or a generic valid one if we have at least one
             if (typeImages[type].length > 0) {
                 typeImages[type].push(typeImages[type][0]); 
             } else {
                 typeImages[type].push('/placeholder.svg');
             }
          }
        } catch {
          console.warn('Failed to fetch images for training type', type);
          typeImages[type] = Array(4).fill('/placeholder.svg');
        }
      }
      setImages(typeImages);
    };
    fetchImages();
  }, []);

  return (
    <section className="py-12 px-4 bg-white">
      <h2 className="text-2xl font-bold mb-6">HOW DO YOU TRAIN?</h2>

      <div className="flex gap-2 mb-6 flex-wrap">
        {trainingTypes.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeType === type
                ? 'bg-black text-white'
                : 'bg-gray-100 text-black hover:bg-gray-200'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(images[activeType] || Array(4).fill('/placeholder.svg')).map((image, index) => (
          <Link to={`/products?q=${activeType}`} key={index} className="group cursor-pointer block">
            <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
              <img
                src={image}
                alt={`${activeType} training ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-4 left-4">
                <span className="text-white text-sm font-bold drop-shadow-lg">
                  {trainingTypes[index] || activeType}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
