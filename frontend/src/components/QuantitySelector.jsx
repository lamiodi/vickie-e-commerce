import { MinusIcon, PlusIcon } from './AppIcons';

export function QuantitySelector({ quantity, onQuantityChange, min = 1, max = 99 }) {
  const decrease = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };

  const increase = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-lg">
      <button
        onClick={decrease}
        disabled={quantity <= min}
        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <MinusIcon className="w-4 h-4" />
      </button>
      <span className="w-12 text-center font-medium">{quantity}</span>
      <button
        onClick={increase}
        disabled={quantity >= max}
        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <PlusIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
