import { Search, User, Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="sticky top-0 bg-white z-50 border-b border-gray-100">
      <div className="flex items-center justify-between px-4 py-3">
        <nav className="flex items-center gap-6">
          <Link to="/products?category=women" className="text-sm font-medium hover:underline">
            Women
          </Link>
          <Link to="/products?category=men" className="text-sm font-medium hover:underline">
            Men
          </Link>
          <Link to="/products?category=accessories" className="text-sm font-medium hover:underline">
            Accessories
          </Link>
        </nav>

        <Link to="/" className="absolute left-1/2 -translate-x-1/2">
          <img src="/vickielogoblack.png" alt="Vickie Ecom" className="h-8 w-auto" />
        </Link>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm w-48 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <button className="md:hidden">
            <Search className="w-5 h-5" />
          </button>
          <Link to="/account">
            <User className="w-5 h-5" />
          </Link>
          <button>
            <Heart className="w-5 h-5" />
          </button>
          <Link to="/cart" className="relative">
            <ShoppingBag className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
