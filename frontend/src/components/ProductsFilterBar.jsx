import { ChevronDownIcon, GridIcon, ListIcon } from './AppIcons';
import { useState } from 'react';

export function ProductsFilterBar({ totalResults, currentPage, pageSize, onFilterChange, onLayoutChange }) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalResults);

  const [activeLayout, setActiveLayout] = useState('grid');
  const [activeFilter, setActiveFilter] = useState(null);

  const toggleLayout = (layout) => {
    setActiveLayout(layout);
    if (onLayoutChange) onLayoutChange(layout);
  };

  const handleFilterClick = (filterName) => {
    setActiveFilter(activeFilter === filterName ? null : filterName);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-gray-200">
      {/* Left: Filters */}
      <div className="flex flex-wrap items-center gap-2 text-sm relative">
        <span className="text-gray-500">Sort by</span>
        <span className="text-gray-300">|</span>

        <div className="relative">
            <button 
                onClick={() => handleFilterClick('categories')}
                className={`flex items-center gap-1 px-2 py-1 hover:text-[#C41E3A] transition-colors ${activeFilter === 'categories' ? 'text-[#C41E3A] font-medium' : ''}`}
            >
            All Categories
            <ChevronDownIcon className="w-4 h-4" />
            </button>
            {activeFilter === 'categories' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-xl z-50 py-2">
                    {['Activewear', 'Waist Trainers', 'Accessories', 'Gym Socks', 'Bags'].map(cat => (
                        <button key={cat} onClick={() => onFilterChange && onFilterChange('category', cat)} className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">
                            {cat}
                        </button>
                    ))}
                    <button onClick={() => onFilterChange && onFilterChange('category', '')} className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-[#C41E3A] font-medium border-t border-gray-50 mt-1 pt-2">
                        Reset
                    </button>
                </div>
            )}
        </div>
        <span className="text-gray-300">|</span>

        <div className="relative">
            <button 
                onClick={() => handleFilterClick('brands')}
                className={`flex items-center gap-1 px-2 py-1 hover:text-[#C41E3A] transition-colors ${activeFilter === 'brands' ? 'text-[#C41E3A] font-medium' : ''}`}
            >
            All Brands
            <ChevronDownIcon className="w-4 h-4" />
            </button>
            {activeFilter === 'brands' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-xl z-50 py-2">
                    {['Adidas', 'Under Armour'].map(brand => (
                        <button key={brand} onClick={() => onFilterChange && onFilterChange('brand', brand)} className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">
                            {brand}
                        </button>
                    ))}
                </div>
            )}
        </div>
        <span className="text-gray-300">|</span>

        <div className="relative">
            <button 
                onClick={() => handleFilterClick('sizes')}
                className={`flex items-center gap-1 px-2 py-1 hover:text-[#C41E3A] transition-colors ${activeFilter === 'sizes' ? 'text-[#C41E3A] font-medium' : ''}`}
            >
            All Sizes
            <ChevronDownIcon className="w-4 h-4" />
            </button>
             {activeFilter === 'sizes' && (
                <div className="absolute top-full left-0 mt-2 w-32 bg-white border border-gray-100 rounded-lg shadow-xl z-50 py-2">
                    {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                        <button key={size} onClick={() => onFilterChange && onFilterChange('size', size)} className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">
                            {size}
                        </button>
                    ))}
                </div>
            )}
        </div>
        <span className="text-gray-300">|</span>

        <div className="relative">
            <button 
                onClick={() => handleFilterClick('price')}
                className={`flex items-center gap-1 px-2 py-1 hover:text-[#C41E3A] transition-colors ${activeFilter === 'price' ? 'text-[#C41E3A] font-medium' : ''}`}
            >
            Price Range
            <ChevronDownIcon className="w-4 h-4" />
            </button>
             {activeFilter === 'price' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-xl z-50 py-2">
                    <button onClick={() => onFilterChange && onFilterChange('price', '0-50')} className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">$0 - $50</button>
                    <button onClick={() => onFilterChange && onFilterChange('price', '50-100')} className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">$50 - $100</button>
                    <button onClick={() => onFilterChange && onFilterChange('price', '100-200')} className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">$100 - $200</button>
                    <button onClick={() => onFilterChange && onFilterChange('price', '200+')} className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">$200+</button>
                </div>
            )}
        </div>

        <span className="text-gray-400 ml-2">
          Showing {totalResults > 0 ? startItem : 0} - {endItem} of {totalResults} results.
        </span>
      </div>

      {/* Right: View Toggle */}
      <div className="flex items-center gap-1">
        <button 
            onClick={() => toggleLayout('grid')}
            className={`p-2 rounded transition-colors ${activeLayout === 'grid' ? 'bg-gray-100 text-black' : 'hover:bg-gray-100 text-gray-400'}`}
        >
          <GridIcon className="w-4 h-4" />
        </button>
        <button 
            onClick={() => toggleLayout('list')}
            className={`p-2 rounded transition-colors ${activeLayout === 'list' ? 'bg-gray-100 text-black' : 'hover:bg-gray-100 text-gray-400'}`}
        >
          <ListIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
