import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';

// ============== HEADER COMPONENT ==============
function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-100">
      {/* Top Banner */}
      <div className="bg-red-600 text-white text-center py-2 text-xs font-medium tracking-wide">
        FREE SHIPPING ON ORDERS OVER £50
      </div>

      {/* Main Navigation */}
      <nav className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Left Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/products?category=Women"
              className="text-sm font-medium text-gray-900 hover:text-gray-600"
            >
              Women
            </Link>
            <Link
              to="/products?category=Men"
              className="text-sm font-medium text-gray-900 hover:text-gray-600"
            >
              Men
            </Link>
            <Link
              to="/products?category=Accessories"
              className="text-sm font-medium text-gray-900 hover:text-gray-600"
            >
              Accessories
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>

          {/* Logo */}
          <div className="flex-1 flex justify-center md:flex-none">
            <Link to="/" className="text-2xl font-bold">
              <svg viewBox="0 0 40 40" className="w-8 h-8 fill-current">
                <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="3" />
                <polygon points="15,12 15,28 28,20" fill="currentColor" />
              </svg>
            </Link>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <Link to="/account" className="p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </Link>
            <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                0
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <Link
              to="/products?category=Women"
              className="block py-3 text-sm font-medium text-gray-900 border-b border-gray-100"
            >
              Women
            </Link>
            <Link
              to="/products?category=Men"
              className="block py-3 text-sm font-medium text-gray-900 border-b border-gray-100"
            >
              Men
            </Link>
            <Link
              to="/products?category=Accessories"
              className="block py-3 text-sm font-medium text-gray-900"
            >
              Accessories
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

// ============== HERO BANNER COMPONENT ==============
function HeroBanner({ title, subtitle, buttonText, image }) {
  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${image})`,
          backgroundColor: '#2d2d2d',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
      </div>

      <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
        <div className="text-white max-w-lg">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">{title}</h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">{subtitle}</p>
          <Link
            to="/products"
            className="inline-block bg-white text-black px-8 py-4 text-sm font-semibold hover:bg-gray-100 transition-colors uppercase tracking-wide"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============== PRODUCT CARD COMPONENT ==============
function ProductCard({ product }) {
  const { id, name, price, originalPrice, variants, image, video_thumbnail_url, badge } = product;
  const displayImage = image || video_thumbnail_url || '/placeholder.svg';

  // Calculate unique colors count
  const uniqueColors = variants
    ? new Set(variants.map((v) => v.color).filter((c) => c && c !== 'Default')).size
    : 0;

  return (
    <Link to={`/products/${id}`} className="group cursor-pointer block">
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-3 rounded-sm">
        <img
          src={displayImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {badge && (
          <div
            className={`absolute top-3 left-3 px-2 py-1 text-xs font-bold uppercase tracking-wide ${
              badge === 'NEW' ? 'bg-black text-white' : 'bg-red-600 text-white'
            }`}
          >
            {badge}
          </div>
        )}

        {uniqueColors > 1 && (
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium shadow-lg">
            {uniqueColors} colours
          </div>
        )}

        {/* Quick Add Button - Shows on Hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="w-full bg-black text-white py-2 text-xs font-semibold uppercase tracking-wide hover:bg-gray-800 transition-colors">
            Quick Add
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">{name}</h3>
        <div className="flex items-center space-x-2">
          {originalPrice ? (
            <>
              <span className="text-sm font-bold text-red-600">£{Number(price).toFixed(2)}</span>
              <span className="text-sm text-gray-400 line-through">
                £{Number(originalPrice).toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-sm font-bold text-gray-900">£{Number(price).toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ============== PRODUCT SECTION COMPONENT ==============
function ProductSection({ title, products, showShopAll }) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-wide">
          {title}
        </h2>
        {showShopAll && (
          <Link
            to="/products"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 underline underline-offset-4"
          >
            Shop All
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

// ============== PROMO BANNER COMPONENT ==============
function PromoBanner({ title, subtitle, buttonText, image, dark = true }) {
  return (
    <section className="relative h-[400px] md:h-[500px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${image})`,
          backgroundColor: '#1a1a1a',
        }}
      >
        <div className={`absolute inset-0 ${dark ? 'bg-black/50' : 'bg-black/20'}`} />
      </div>

      <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
        <div className="text-white max-w-md">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 italic">{title}</h2>
          <p className="text-base md:text-lg mb-8 opacity-90">{subtitle}</p>
          <Link
            to="/products"
            className="inline-block border-2 border-white text-white px-8 py-4 text-sm font-semibold hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-wide"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============== COMPLETE OUTFIT COMPONENT ==============
function CompleteOutfit() {
  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden bg-gray-100">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(/colorful-running-shoes-red-blue.jpg)`,
        }}
      />

      <div className="relative h-full max-w-7xl mx-auto px-4 flex items-end pb-16 md:pb-24">
        <div className="text-gray-900 max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-lg">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 uppercase">COMPLETE YOUR OUTFIT</h2>
          <p className="text-base mb-6 text-gray-700">Head to toe. Everything for you.</p>
          <Link
            to="/products"
            className="inline-block border-2 border-black text-black px-8 py-4 text-sm font-semibold hover:bg-black hover:text-white transition-all duration-300 uppercase tracking-wide"
          >
            ACCESSORIES
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============== NEWSLETTER COMPONENT ==============
function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing with: ${email}`);
    setEmail('');
  };

  return (
    <section className="bg-black text-white">
      {/* Newsletter Bar */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
          <span className="text-sm font-semibold uppercase tracking-wide">
            JOIN EMAILS & SAVE AN EXTRA 10%
          </span>
          <form onSubmit={handleSubmit} className="flex w-full md:w-auto max-w-md">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 md:w-64 px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="bg-white text-black px-6 py-3 text-sm font-bold hover:bg-gray-200 transition-colors uppercase tracking-wide"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>

      {/* Brand Story */}
      <div className="border-t border-gray-800">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-8 uppercase tracking-wider">
            NEVER GIVE UP
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed mb-6">
            Since 2024, we have been dedicated to creating premium activewear built for intense
            training and everyday wear. Our mission is simple: create high-quality products that
            inspire confidence and help you perform at your best.
          </p>
          <p className="text-sm text-gray-400 leading-relaxed">
            Our diverse range of styles offers an unbeatable value. Whether sending running miles or
            smashing PBs, we believe everyone deserves to look and feel their best. We&apos;re
            committed to constantly evolving our products to be the best they can be, so you can
            focus on being the best you can be.
          </p>
        </div>
      </div>
    </section>
  );
}

// ============== FOOTER COMPONENT ==============
function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Customer Care */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
              Customer Care
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Pages */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Pages</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Size Guide
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Get Our Apps
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="col-span-2">
            <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Social</h4>
            <div className="flex space-x-3 mb-8">
              <a
                href="#"
                className="p-3 bg-gray-100 rounded-full hover:bg-black hover:text-white transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#"
                className="p-3 bg-gray-100 rounded-full hover:bg-black hover:text-white transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a
                href="#"
                className="p-3 bg-gray-100 rounded-full hover:bg-black hover:text-white transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
              </a>
              <a
                href="#"
                className="p-3 bg-gray-100 rounded-full hover:bg-black hover:text-white transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
              <a
                href="#"
                className="p-3 bg-gray-100 rounded-full hover:bg-black hover:text-white transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
            </div>

            {/* Payment Methods */}
            <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
              Payment Methods
            </h4>
            <div className="flex flex-wrap gap-2">
              <div className="bg-blue-900 text-white px-3 py-2 rounded text-xs font-bold">VISA</div>
              <div className="bg-red-500 text-white px-3 py-2 rounded text-xs font-bold">
                Mastercard
              </div>
              <div className="bg-blue-600 text-white px-3 py-2 rounded text-xs font-bold">
                PayPal
              </div>
              <div className="bg-black text-white px-3 py-2 rounded text-xs font-bold">
                Apple Pay
              </div>
              <div className="bg-pink-500 text-white px-3 py-2 rounded text-xs font-bold">
                Klarna
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              Copyright © 2024 Fitness Store. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link to="#" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
                Terms & Conditions
              </Link>
              <Link to="#" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============== MAIN APP COMPONENT ==============
export default function HomeVariant3() {
  const [womensProducts, setWomensProducts] = useState([]);
  const [mensProducts, setMensProducts] = useState([]);
  const [accessoriesProducts, setAccessoriesProducts] = useState([]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const [womenRes, menRes, accRes] = await Promise.all([
          api.get('/products?category=Activewear&limit=4&sort=newest'),
          api.get('/products?limit=4&sort=trending'), // Using trending as proxy for men/general
          api.get('/products?category=Bags&limit=4'),
        ]);

        setWomensProducts(womenRes.data.products || []);
        setMensProducts(menRes.data.products || []);
        setAccessoriesProducts(accRes.data.products || []);
      } catch (error) {
        console.error('Failed to fetch variant 3 products', error);
      }
    };
    fetchAllProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />

      <main>
        <HeroBanner
          title="WINTER SEASON ENERGY"
          subtitle="Upgrade your training wardrobe with 40% off"
          buttonText="SHOP WOMENS"
          image="/woman-stretching-fitness-yoga-athletic-wear-outdoo.jpg"
        />

        <ProductSection title="WOMENS NEW IN" products={womensProducts} showShopAll={true} />

        <PromoBanner
          title="BETTER THAN EVER"
          subtitle="Up to 50% off all your favourites"
          buttonText="SHOP MENS"
          image="/muscular-man-in-olive-green-tactical-gym-wear-posi.jpg"
        />

        <ProductSection title="MENS NEW IN" products={mensProducts} showShopAll={true} />

        <CompleteOutfit />

        <ProductSection
          title="BAGS, SOCKS & MORE"
          products={accessoriesProducts}
          showShopAll={true}
        />

        <Newsletter />
      </main>

      <Footer />
    </div>
  );
}
