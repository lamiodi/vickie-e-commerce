import { useState } from 'react';
import { HeartIcon, ShoppingCartIcon, ShareIcon, EyeIcon } from './AppIcons';
import { useCart } from '@/lib/cart';
import { toast } from 'sonner';
import { getImageUrl, convertPrice, formatPrice } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { usePreferences } from '@/contexts/PreferencesContext';

export function ProductCard({ product, placeholderImage }) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();
  const navigate = useNavigate();
  const { currency, exchangeRates, isLoading } = usePreferences();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation if inside a Link
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
      image: product.image,
      size: 'M', // Default size
      color: 'Default', // Default color
      category: product.category,
    });
    toast.success('Added to cart');
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Simple local storage wishlist for now
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (wishlist.some(id => id === product.id)) {
        const newWishlist = wishlist.filter(id => id !== product.id);
        localStorage.setItem('wishlist', JSON.stringify(newWishlist));
        toast.info('Removed from wishlist');
    } else {
        wishlist.push(product.id);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        toast.success('Added to wishlist');
    }
  };

  const handleQuickView = (e) => {
      e.preventDefault();
      e.stopPropagation();
      navigate(`/products/${product.id}`);
  };

  const handleShare = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        await navigator.clipboard.writeText(`${window.location.origin}/products/${product.id}`);
        toast.success('Link copied to clipboard');
      } catch (err) {
        toast.error('Failed to copy link');
      }
  };

  return (
    <div
      className="group relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      {/* Product Image Container */}
      <div className="relative bg-gray-100 rounded-lg aspect-square mb-3 overflow-hidden">
        <img
          src={getImageUrl(
            product.image || product.video_thumbnail_url || placeholderImage || '/placeholder.jpg'
          )}
          alt={product.name}
          className="w-full h-full object-cover object-center"
        />

        {/* Badges */}
        {product.badge && (
          <span
            className={`absolute top-3 left-3 text-white text-[10px] font-bold px-2 py-1 uppercase rounded-sm ${
              product.badge === 'SALE' ? 'bg-red-600' : 'bg-black'
            }`}
          >
            {product.badge}
          </span>
        )}

        {/* Hover Action Icons */}
        <div
          className={`absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <button 
            onClick={handleWishlist}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#C41E3A] hover:text-white transition-colors"
          >
            <HeartIcon className="w-4 h-4" />
          </button>
          <button
            onClick={handleAddToCart}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#C41E3A] hover:text-white transition-colors"
          >
            <ShoppingCartIcon className="w-4 h-4" />
          </button>
          <button 
            onClick={handleShare}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#C41E3A] hover:text-white transition-colors"
          >
            <ShareIcon className="w-4 h-4" />
          </button>
          <button 
            onClick={handleQuickView}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#C41E3A] hover:text-white transition-colors"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div>
        <span className="text-[#C41E3A] text-xs font-black uppercase tracking-wide font-poiret">
          {product.category}
        </span>
        <h3 className="text-sm font-medium mt-1 mb-1 group-hover:text-[#C41E3A] transition-colors font-quicksand">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium font-quicksand">
            {isLoading ? (
              <span className="inline-block w-12 h-4 bg-gray-200 animate-pulse rounded"></span>
            ) : (
              formatPrice(
                convertPrice(
                  typeof product.price === 'number' ? product.price : parseFloat(product.price),
                  'GBP',
                  currency,
                  exchangeRates
                ),
                currency
              )
            )}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              {isLoading ? (
                <span className="inline-block w-10 h-3 bg-gray-200 animate-pulse rounded"></span>
              ) : (
                formatPrice(
                  convertPrice(
                    typeof product.originalPrice === 'number' ? product.originalPrice : parseFloat(product.originalPrice),
                    'GBP',
                    currency,
                    exchangeRates
                  ),
                  currency
                )
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
