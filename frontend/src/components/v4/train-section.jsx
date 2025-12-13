import { useState } from 'react';
import { Link } from 'react-router-dom';

const trainingTypes = ['LIFTING', 'RUNNING', 'TRAINING', 'HIIT'];

const trainingImages = {
  LIFTING: [
    '/dumbbell-weight-fitness-equipment.jpg',
    '/muscular-man-wearing-black-tactical-t-shirt-gym.jpg',
    '/black-dumbbell-weight-fitness-equipment-gym.jpg',
    '/man-wearing-black-oversized-t-shirt-gym.jpg',
  ],
  RUNNING: [
    '/colorful-running-shoes.jpg',
    '/athletic-man-running-outdoor-sports-photography-dr.jpg',
    '/colorful-running-shoes-sneakers.jpg',
    '/white-running-shoes-sneakers.jpg',
  ],
  TRAINING: [
    '/woman-wearing-gray-seamless-leggings-gym.jpg',
    '/woman-in-black-gym-leggings-fitness-pose.jpg',
    '/woman-wearing-black-sports-bra-athletic.jpg',
    '/purple-yoga-mat-rolled.jpg',
  ],
  HIIT: [
    '/woman-stretching-fitness-yoga-athletic-wear-outdoo.jpg',
    '/happy-child-playing-sports-outdoors-kid-running-su.jpg',
    '/man-wearing-olive-oversized-t-shirt-athletic.jpg',
    '/woman-in-high-waisted-leggings-workout.jpg',
  ],
};

export function TrainSection() {
  const [activeType, setActiveType] = useState('LIFTING');

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
        {trainingImages[activeType].map((image, index) => (
          <Link to={`/products?q=${activeType}`} key={index} className="group cursor-pointer block">
            <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
              <img
                src={image || '/placeholder.svg'}
                alt={`${activeType} training ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-4 left-4">
                <span className="text-white text-sm font-bold drop-shadow-lg">
                  {['LIFTING', 'RUNNING', 'PILATES', 'HIIT'][index]}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
