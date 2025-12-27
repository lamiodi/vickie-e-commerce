import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutTemplate } from 'lucide-react';
import { useState } from 'react';

export function VariantSwitcher() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Only show on home pages
  const isHomePage = ['/', '/v3', '/v4'].includes(location.pathname);
  if (!isHomePage) return null;

  const variants = [
    { path: '/', label: 'Default Home' },
    { path: '/v3', label: 'Variant 3 (Clean)' },
    { path: '/v4', label: 'Variant 4 (Modular)' },
  ];

  return (
    <div className="fixed bottom-6 left-6 z-[100]">
      <div
        className={`absolute bottom-full left-0 mb-4 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 origin-bottom-left ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
      >
        <div className="p-2 min-w-[200px]">
          <div className="text-xs font-semibold text-gray-500 px-3 py-2 uppercase tracking-wider">
            Switch Homepage
          </div>
          {variants.map((v) => (
            <button
              key={v.path}
              onClick={() => {
                navigate(v.path);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                location.pathname === v.path
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
      >
        <LayoutTemplate className="w-5 h-5" />
        <span className="font-medium pr-1">Switch Layout</span>
      </button>
    </div>
  );
}
