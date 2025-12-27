import { Link } from 'react-router-dom';
import { QuantitySelector } from './QuantitySelector';
import { TrashIcon } from './AppIcons';

export function CartItem({ item, onQuantityChange, onRemove }) {
  return (
    <div className="flex gap-4 py-6 border-b border-gray-200">
      {/* Product Image */}
      <Link
        to={`/products/${item.id}`}
        className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"
      >
        <img
          src={item.image || '/placeholder.jpg'}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <div>
            <span className="text-[#C41E3A] text-xs font-semibold uppercase tracking-wide">
              {item.category}
            </span>
            <Link to={`/products/${item.id}`}>
              <h3 className="font-medium text-sm mt-1 hover:text-[#C41E3A] transition-colors">
                {item.name}
              </h3>
            </Link>
            <div className="flex gap-4 mt-1 text-xs text-gray-500">
              <span>Size: {item.size}</span>
              <span>Color: {item.color}</span>
            </div>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="text-gray-400 hover:text-[#C41E3A] transition-colors p-1"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-4">
          <QuantitySelector
            quantity={item.quantity}
            onQuantityChange={(quantity) => onQuantityChange(item.id, quantity)}
          />
          <div className="text-right">
            <p className="font-semibold">
              £{((item.price ? (typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : item.price) : 0) * (item.quantity || 1)).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">
              £{(item.price ? (typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : item.price) : 0).toFixed(2)} each
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
