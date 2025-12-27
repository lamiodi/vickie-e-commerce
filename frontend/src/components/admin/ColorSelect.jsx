import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const ColorSelect = ({ value, onChange, colors }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
      >
        <div className="flex items-center gap-2">
          {value ? (
            <>
              <div
                className="w-4 h-4 rounded-full border border-gray-200"
                style={{ backgroundColor: colors[value] }}
              />
              <span>{value}</span>
            </>
          ) : (
            <span className="text-muted-foreground">Select Color</span>
          )}
        </div>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white text-popover-foreground shadow-md">
          <div className="p-1">
            {Object.entries(colors).map(([name, hex]) => (
              <div
                key={name}
                className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 ${
                  value === name ? 'bg-gray-100' : ''
                }`}
                onClick={() => {
                  onChange(name);
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: hex }}
                  />
                  <span>{name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorSelect;
