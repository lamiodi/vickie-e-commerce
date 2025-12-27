import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import Preloader from '@/components/ui/Preloader';
import { Search, ShoppingBag, HelpCircle, Globe } from 'lucide-react';

// ============== HEADER COMPONENT ==============
function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-100">
      {/* Top Banner */}
      <div className="bg-gray-100 text-black text-center py-2 text-[10px] md:text-xs font-bold uppercase tracking-widest">
        GET YOUR GIFTS IN TIME FOR CHRISTMAS
      </div>

      {/* Main Navigation */}
      <nav className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/products?category=Women"
              className="text-sm font-bold text-gray-900 hover:text-gray-600 uppercase tracking-wide"
            >
              Women
            </Link>
            <Link
              to="/products?category=Men"
              className="text-sm font-bold text-gray-900 hover:text-gray-600 uppercase tracking-wide"
            >
              Men
            </Link>
            <Link
              to="/products?category=Accessories"
              className="text-sm font-bold text-gray-900 hover:text-gray-600 uppercase tracking-wide"
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
          <div className="flex-1 flex justify-center md:flex-none md:absolute md:left-1/2 md:-translate-x-1/2">
            <Link to="/" className="text-2xl font-bold">
              <img src="/vickielogoblack.png" alt="Vickie Ecom" className="h-10 w-auto" />
            </Link>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Search className="w-5 h-5 text-gray-900" />
            </button>
            <Link to="/help" className="p-2 hover:bg-gray-100 rounded-full hidden md:block">
              <HelpCircle className="w-5 h-5 text-gray-900" />
            </Link>
            <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full relative">
              <ShoppingBag className="w-5 h-5 text-gray-900" />
              <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
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
              className="block py-3 text-sm font-bold text-gray-900 border-b border-gray-100 uppercase"
            >
              Women
            </Link>
            <Link
              to="/products?category=Men"
              className="block py-3 text-sm font-bold text-gray-900 border-b border-gray-100 uppercase"
            >
              Men
            </Link>
            <Link
              to="/products?category=Accessories"
              className="block py-3 text-sm font-bold text-gray-900 uppercase"
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
function HeroBanner({ title, subtitle, buttonText, image, link }) {
  return (
    <section className="relative h-[600px] md:h-[800px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${getImageUrl(image)})`,
        }}
      />
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
        <div className="text-white max-w-xl">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-none uppercase tracking-tighter">
            {title}
          </h1>
          <p className="text-lg md:text-xl mb-8 font-medium tracking-wide">{subtitle}</p>
          <Link
            to={link || '/products'}
            className="inline-block bg-white text-black px-10 py-3 text-sm font-bold hover:bg-gray-200 transition-colors uppercase tracking-widest rounded-full"
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
  const displayImage = getImageUrl(image || video_thumbnail_url || product.images?.[0]);

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
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-sm">
            +{uniqueColors}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide leading-tight">
          {name}
        </h3>
        <div className="flex items-center space-x-2">
          {originalPrice ? (
            <>
              <span className="text-xs text-red-600 font-medium">£{Number(price).toFixed(2)}</span>
              <span className="text-xs text-gray-400 line-through">
                £{Number(originalPrice).toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-xs text-gray-900 font-normal">£{Number(price).toFixed(2)}</span>
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
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 uppercase tracking-tighter">
          {title}
        </h2>
        {showShopAll && (
          <Link
            to="/products"
            className="text-sm font-bold text-gray-900 hover:text-gray-600 uppercase tracking-wide underline underline-offset-4"
          >
            Shop All
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-x-4 md:gap-y-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

// ============== PROMO BANNER COMPONENT ==============
function PromoBanner({ title, subtitle, buttonText, image, dark = true, link }) {
  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${getImageUrl(image)})`,
          backgroundColor: '#1a1a1a',
        }}
      >
        <div className={`absolute inset-0 ${dark ? 'bg-black/40' : 'bg-black/20'}`} />
      </div>

      <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
        <div className="text-white max-w-lg">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-4 uppercase tracking-tighter leading-none">
            {title}
          </h2>
          <p className="text-base md:text-lg mb-8 font-medium tracking-wide">{subtitle}</p>
          <Link
            to={link || '/products'}
            className="inline-block bg-white text-black px-10 py-3 text-sm font-bold hover:bg-gray-200 transition-all duration-300 uppercase tracking-widest rounded-full"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============== COMPLETE OUTFIT COMPONENT ==============
function CompleteOutfit({ image }) {
  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden bg-gray-100">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${getImageUrl(image || '/alexandra-set-cta.jpg')})`,
        }}
      />

      <div className="relative h-full max-w-7xl mx-auto px-4 flex items-end pb-16 md:pb-24">
        <div className="text-gray-900 max-w-md bg-white/90 backdrop-blur-sm p-8 rounded-sm">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3 uppercase tracking-tighter">
            COMPLETE YOUR OUTFIT
          </h2>
          <p className="text-base mb-6 text-gray-700 font-medium">Head to toe. Everything for you.</p>
          <Link
            to="/products"
            className="inline-block bg-black text-white px-10 py-3 text-sm font-bold hover:bg-gray-800 transition-all duration-300 uppercase tracking-widest rounded-full"
          >
            SHOP ACCESSORIES
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
    <section className="bg-gray-100 text-black border-t border-gray-200">
      {/* Newsletter Bar */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          <span className="text-sm font-bold uppercase tracking-widest">
            JOIN EMAILS & SAVE AN EXTRA 15%
          </span>
          <form onSubmit={handleSubmit} className="flex w-full md:w-auto max-w-md gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 md:w-80 px-4 py-3 text-sm bg-white border border-gray-300 focus:outline-none focus:border-black transition-colors placeholder-gray-500"
            />
            <button
              type="submit"
              className="bg-black text-white px-8 py-3 text-sm font-bold hover:bg-gray-800 transition-colors uppercase tracking-widest rounded-full whitespace-nowrap"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>

      {/* Brand Story */}
      <div className="bg-black text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-4xl md:text-6xl font-extrabold mb-8 uppercase tracking-tighter italic">
            NEVER GIVE UP
          </h3>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-6 max-w-2xl mx-auto">
            Since 2024, we have been dedicated to creating premium activewear built for intense
            training and everyday wear. Our mission is simple: create high-quality products that
            inspire confidence and help you perform at your best.
          </p>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed max-w-2xl mx-auto">
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

import { siteConfig } from '@/site-config';

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
              Copyright © {siteConfig.copyrightYear || new Date().getFullYear()} {siteConfig.name}.
              All rights reserved.
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
  const [loading, setLoading] = useState(true);
  const [womensProducts, setWomensProducts] = useState([]);
  const [mensProducts, setMensProducts] = useState([]);
  const [accessoriesProducts, setAccessoriesProducts] = useState([]);
  const [heroProduct, setHeroProduct] = useState(null);
  const [aliciaProduct, setAliciaProduct] = useState(null);
  const [outfitImage, setOutfitImage] = useState(null);

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

        // Find Hero Product (Activewear)
        const allWomen = womenRes.data.products || [];
        const hero =
          allWomen.find((p) => p.image || (p.images && p.images.length > 0)) || allWomen[0];
        setHeroProduct(hero);

        // Find Alicia Product (or secondary hero)
        const allMen = menRes.data.products || [];
        const alicia =
          allMen.find((p) => (p.image || (p.images && p.images.length > 0)) && p.id !== hero?.id) ||
          allMen[0];
        setAliciaProduct(alicia);

        // Find Outfit Image (from Accessories)
        const allAcc = accRes.data.products || [];
        const outfit =
          allAcc.find((p) => p.image || (p.images && p.images.length > 0)) || allAcc[0];
        setOutfitImage(outfit?.image || outfit?.images?.[0]);
      } catch (error) {
        console.error('Failed to fetch variant 3 products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="min-h-screen bg-white v3-root">
      <style>{`
        .v3-root {
          font-family: "Open Sans", sans-serif !important;
          font-optical-sizing: auto;
          font-style: normal;
          font-variation-settings: "wdth" 100;
        }
        .v3-root h1, 
        .v3-root h2, 
        .v3-root h3, 
        .v3-root h4, 
        .v3-root h5, 
        .v3-root h6, 
        .v3-root .font-heading {
          font-family: "Manrope", sans-serif !important;
          font-optical-sizing: auto;
          font-style: normal;
        }
      `}</style>
      <Header />

      <main>
        <HeroBanner
          title="WINTER SEASON ENERGY"
          subtitle="Upgrade your collection with up to 50% off."
          buttonText="SHOP WOMENS"
          image={heroProduct?.image || heroProduct?.images?.[0] || '/alexandra-set-cta.jpg'}
          link="/products?category=Women"
        />

        <ProductSection title="WOMENS NEW IN" products={womensProducts} showShopAll={true} />

        <PromoBanner
          title="BETTER THAN EVER"
          subtitle="Upgrade your activewear wardrobe"
          buttonText="SHOP MENS"
          image={
            aliciaProduct?.image ||
            aliciaProduct?.images?.[0] ||
            '/woman-wearing-gray-seamless-leggings-gym.jpg'
          }
          link="/products?category=Men"
        />

        <ProductSection title="MENS NEW IN" products={mensProducts} showShopAll={true} />

        <CompleteOutfit image={outfitImage} />

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
