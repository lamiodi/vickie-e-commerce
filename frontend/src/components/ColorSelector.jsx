import { CheckIcon } from './AppIcons';

export function ColorSelector({ colors, selectedColor, onColorChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      {colors.map((color) => (
        <button
          key={color.name}
          onClick={() => onColorChange(color.name)}
          title={color.name}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${
            selectedColor === color.name
              ? 'ring-2 ring-offset-2 ring-[#C41E3A] scale-110'
              : 'hover:scale-110'
          }`}
          style={{ backgroundColor: color.value }}
        >
          {selectedColor === color.name && (
            <CheckIcon
              className={`w-4 h-4 ${color.value === '#FFFFFF' ? 'text-gray-900' : 'text-white'}`}
            />
          )}
        </button>
      ))}
    </div>
  );
}
