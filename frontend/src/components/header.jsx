import { Link } from 'react-router-dom';
import { ChevronDownIcon, UserIcon, ShoppingCartIcon, SearchIcon, PhoneIcon } from './Icons';
import { useCart } from '@/lib/cart';

export function Header() {
  const { items } = useCart();
  const cartCount = items.reduce((total, item) => total + item.qty, 0);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold tracking-tight">
            SPORT<span className="text-[#C41E3A]">Z</span>Y
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <button className="flex items-center gap-1 text-sm font-medium hover:text-[#C41E3A] transition-colors">
              BROWSE CATEGORIES
              <ChevronDownIcon className="w-4 h-4" />
            </button>
            <Link
              to="/products"
              className="flex items-center gap-1 text-sm font-medium hover:text-[#C41E3A] transition-colors"
            >
              PRODUCTS
              <ChevronDownIcon className="w-4 h-4" />
            </Link>
            <Link to="#" className="text-sm font-medium hover:text-[#C41E3A] transition-colors">
              BLOG
            </Link>
            <Link to="#" className="text-sm font-medium hover:text-[#C41E3A] transition-colors">
              CONTACT
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-sm">
              <PhoneIcon className="w-4 h-4" />
              <span className="font-medium">+1 (312) 555-1234</span>
            </div>

            <div className="flex items-center gap-1">
              <Link
                to="/account"
                className="flex items-center gap-1.5 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <UserIcon className="w-5 h-5" />
                <span className="hidden sm:inline text-sm font-medium">SIGN IN</span>
              </Link>
              <Link
                to="/cart"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#C41E3A] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <SearchIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
