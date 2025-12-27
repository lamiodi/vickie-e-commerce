export function SizeSelector({ sizes, selectedSize, onSizeChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => onSizeChange(size)}
          className={`min-w-[48px] h-10 px-3 rounded-lg border font-medium text-sm transition-colors ${
            selectedSize === size
              ? 'bg-[#C41E3A] text-white border-[#C41E3A]'
              : 'bg-white text-gray-900 border-gray-300 hover:border-[#C41E3A]'
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
