import { useState } from 'react';

export function ProductTabs({ description, specifications, reviews }) {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'reviews', label: `Reviews (${reviews.length})` },
  ];

  return (
    <div>
      {/* Tab headers */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id ? 'text-[#C41E3A]' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C41E3A]" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="py-6">
        {activeTab === 'description' && (
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-600 leading-relaxed">{description}</p>
          </div>
        )}

        {activeTab === 'specifications' && (
          <div className="space-y-3">
            {specifications.map((spec, index) => (
              <div key={index} className="flex border-b border-gray-100 pb-3">
                <span className="w-40 text-sm font-medium text-gray-900">{spec.label}</span>
                <span className="text-sm text-gray-600">{spec.value}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <div key={index} className="border-b border-gray-100 pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">{review.author[0]}</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{review.author}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 ml-13">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
