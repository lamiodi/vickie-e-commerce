import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronDownIcon, UserIcon, ShoppingCartIcon, SearchIcon, PhoneIcon, MenuIcon, XIcon } from './AppIcons';
import { useCart } from '@/lib/cart';
import { siteConfig } from '@/site-config';

export function Header({ variant = 'light' }) {
  const { items } = useCart();
  const cartCount = items.reduce((total, item) => total + item.qty, 0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Determine logo and text color based on variant
  const isTransparent = variant === 'transparent';
  const textColor = isTransparent ? 'text-white' : 'text-black';
  const logoSrc = isTransparent ? '/vickielogowhite.png' : '/vickielogoblack.png';
  const bgColor = isTransparent ? 'bg-transparent' : 'bg-white';
  const borderColor = isTransparent ? 'border-white/10' : 'border-gray-100';

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
        navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
        setIsSearchOpen(false);
        setSearchQuery('');
    }
  };

  return (
    <header className={`${bgColor} ${isTransparent ? 'absolute top-0 left-0 right-0' : 'sticky top-0'} border-b ${borderColor} z-50 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Row 1: Logo and Actions */}
        <div className="relative flex items-center justify-between py-4 h-16">
            
            {/* Left Side: Mobile Menu & Desktop Brand Text */}
            <div className="flex items-center gap-4 z-10">
                {/* Mobile Menu Button */}
                <button 
                    className={`lg:hidden p-2 -ml-2 hover:bg-gray-100/10 rounded-full transition-colors ${textColor}`}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                </button>
                
                {/* Desktop Brand Text - Hidden on Mobile */}
                <Link to="/" className={`hidden lg:block text-2xl font-bold tracking-tight font-poiret ${textColor}`}>
                    ASWBY<span className="text-[#C41E3A]">VICKIE</span>
                </Link>
            </div>

            {/* Center: Logo - Absolute Centered */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
                <Link to="/">
                    <img 
                        src={logoSrc} 
                        alt="ASWBYVICKIE Logo" 
                        className="h-12 w-auto object-contain"
                    />
                </Link>
            </div>

          {/* Right side Actions */}
          <div className={`flex items-center gap-1 z-10 ${textColor}`}>
            <Link
              to="/account"
              className="hidden sm:flex items-center gap-1.5 p-2 hover:bg-gray-100/10 rounded-full transition-colors"
            >
              <UserIcon className="w-5 h-5" />
              <span className="text-sm font-medium">SIGN IN</span>
            </Link>
             <Link
              to="/account"
              className="sm:hidden p-2 hover:bg-gray-100/10 rounded-full transition-colors"
            >
              <UserIcon className="w-5 h-5" />
            </Link>
            <Link
              to="/cart"
              className="p-2 hover:bg-gray-100/10 rounded-full transition-colors relative"
            >
              <ShoppingCartIcon className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C41E3A] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <button 
                className="p-2 hover:bg-gray-100/10 rounded-full transition-colors"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <SearchIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Search Bar (Collapsible) */}
        {isSearchOpen && (
            <div className={`py-4 border-t ${borderColor}`}>
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent text-black bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                    />
                    <button 
                        type="submit" 
                        className="px-6 py-2 bg-[#C41E3A] text-white font-bold rounded-md hover:bg-[#a3182f] transition-colors"
                    >
                        Search
                    </button>
                </form>
            </div>
        )}

        {/* Row 2: Navigation and Contact (Desktop) */}
        <div className={`hidden lg:flex items-center justify-between py-3 border-t ${borderColor}`}>
          {/* Navigation */}
          <nav className={`flex items-center gap-8 ${textColor}`}>
            <div className="relative group">
              <Link to="/products" className="flex items-center gap-1 text-sm font-semibold hover:text-[#C41E3A] transition-colors uppercase tracking-wide">
                BROWSE CATEGORIES
                <ChevronDownIcon className="w-4 h-4" />
              </Link>
              <div className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-b-md py-2 hidden group-hover:block border-t border-gray-100 z-50 text-black">
                <Link to="/products?category=Activewear" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#C41E3A]">Activewear</Link>
                <Link to="/products?category=Waist Trainers" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#C41E3A]">Waist Trainers</Link>
                <div className="relative group/acc">
                  <Link to="/products?category=Accessories" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#C41E3A] flex items-center justify-between whitespace-nowrap">
                    Accessories
                    <span className="ml-2 text-[8px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium border border-gray-200">Coming Soon</span>
                  </Link>
                </div>
                <Link to="/products?category=Gym Socks" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#C41E3A]">Gym Socks</Link>
                <Link to="/products?category=Bags" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#C41E3A]">Bags</Link>
              </div>
            </div>
            <Link
              to="/products"
              className="text-sm font-semibold hover:text-[#C41E3A] transition-colors uppercase tracking-wide"
            >
              PRODUCTS
            </Link>
            <Link
              to="/blog"
              className="text-sm font-semibold hover:text-[#C41E3A] transition-colors uppercase tracking-wide"
            >
              BLOG
            </Link>
            <Link
              to="/contact"
              className="text-sm font-semibold hover:text-[#C41E3A] transition-colors uppercase tracking-wide"
            >
              CONTACT
            </Link>
          </nav>

          {/* Contact Phone */}
          <div className={`flex items-center gap-2 text-sm ${isTransparent ? 'text-white/80' : 'text-gray-600'}`}>
            <PhoneIcon className="w-4 h-4" />
            <span className="font-medium tracking-wide">{siteConfig.phone}</span>
          </div>
        </div>
        
        {/* Mobile Menu (Collapsible) */}
        {isMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-100 space-y-4 bg-white text-black absolute top-full left-0 right-0 px-4 shadow-lg border-b">
                 {/* Mobile Brand Text (Shown inside menu) */}
                <div className="pb-4 border-b border-gray-100">
                     <Link to="/" className="text-xl font-bold tracking-tight font-poiret text-black">
                        ASWBY<span className="text-[#C41E3A]">VICKIE</span>
                    </Link>
                </div>

                <nav className="flex flex-col space-y-4">
                    <Link 
                        to="/products" 
                        className="text-sm font-semibold hover:text-[#C41E3A] transition-colors uppercase tracking-wide"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        BROWSE CATEGORIES
                    </Link>
                    <Link
                        to="/products"
                        className="text-sm font-semibold hover:text-[#C41E3A] transition-colors uppercase tracking-wide"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        PRODUCTS
                    </Link>
                    <Link
                        to="/blog"
                        className="text-sm font-semibold hover:text-[#C41E3A] transition-colors uppercase tracking-wide"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        BLOG
                    </Link>
                    <Link
                        to="/contact"
                        className="text-sm font-semibold hover:text-[#C41E3A] transition-colors uppercase tracking-wide"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        CONTACT
                    </Link>
                     <div className="flex items-center gap-2 text-sm text-gray-600 pt-4 border-t border-gray-100">
                        <PhoneIcon className="w-4 h-4" />
                        <span className="font-medium tracking-wide">{siteConfig.phone}</span>
                    </div>
                </nav>
            </div>
        )}
      </div>
    </header>
  );
}
