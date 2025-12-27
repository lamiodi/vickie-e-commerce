import { useState, useEffect } from 'react';
import { Play } from 'lucide-react';

export function ProductGallery({ media = [], productName }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Reset selection when media changes (e.g. color switch)
  useEffect(() => {
    // Use a microtask to avoid synchronous setState in effect
    Promise.resolve().then(() => setSelectedIndex(0));
  }, [media]);

  if (!media || media.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
        No Media Available
      </div>
    );
  }

  const currentMedia = media[selectedIndex];

  return (
    <div className="flex gap-4 flex-col-reverse md:flex-row">
      {/* Thumbnail column */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
        {media.map((item, index) => (
          <button
            key={item.id || index}
            onClick={() => setSelectedIndex(index)}
            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors relative ${
              selectedIndex === index ? 'border-[#C41E3A]' : 'border-transparent'
            }`}
          >
            {item.mediaType === 'video' || item.type === 'video' ? (
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <Play className="w-8 h-8 text-white opacity-80" />
              </div>
            ) : (
              <img
                src={item.filePath || item.url || '/placeholder.svg'}
                alt={`${productName} view ${index + 1}`}
                className="w-full h-full object-cover"
              />
            )}
          </button>
        ))}
      </div>

      {/* Main Display */}
      <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden aspect-square relative">
        {currentMedia && (currentMedia.mediaType === 'video' || currentMedia.type === 'video') ? (
          <video
            src={currentMedia.filePath || currentMedia.url}
            controls
            className="w-full h-full object-contain bg-black"
            poster={currentMedia.thumbnailPath}
          />
        ) : (
          <img
            src={currentMedia?.filePath || currentMedia?.url || '/placeholder.svg'}
            alt={productName}
            className="w-full h-full object-cover"
          />
        )}
      </div>
    </div>
  );
}
