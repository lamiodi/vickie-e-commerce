import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TopBar } from '@/components/TopBar';
import { Header } from '@/components/AppHeader';
import { Footer } from '@/components/AppFooter';
import { BrandLogos } from '@/components/BrandLogos';
import { CartItem } from '@/components/CartItem';
import { OrderSummary } from '@/components/OrderSummary';
import { ProductCard } from '@/components/ProductCard';
import { HomeIcon, ChevronRightIcon, ShoppingCartIcon } from '@/components/AppIcons';
import { useCart } from '@/lib/cart';
import { api } from '@/lib/api';
import Preloader from '@/components/ui/Preloader';

export default function Cart() {
  const { items: cartItems, updateQty, removeItem, clearCart, coupon } = useCart();
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        setLoading(true);
        const response = await api.get('/products/recommended');
        if (response.data) {
          setRecommendedProducts(response.data);
        }
      } catch {
        // Fallback or empty
      } finally {
        setLoading(false);
      }
    };
    fetchRecommended();
  }, []);

  const handleQuantityChange = (id, quantity) => {
    updateQty(id, quantity);
  };

  const handleRemove = (id) => {
    removeItem(id);
  };

  // In useCart, price might be string or number, ensure safe math
  const subtotal = cartItems.reduce((sum, item) => {
    const price =
      typeof item.price === 'string'
        ? parseFloat(item.price.replace(/[^\d.-]/g, ''))
        : item.price;
    return sum + price * item.qty;
  }, 0);

  const shipping = subtotal > 100 ? 0 : 9.99;
  const discount = coupon ? coupon.discountAmount : 0;
  const tax = (subtotal - discount) * 0.08;
  const total = Math.max(0, subtotal + shipping + tax - discount);

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
            <Link
              to="/"
              className="flex items-center gap-1 text-gray-500 hover:text-[#C41E3A] transition-colors"
            >
              <HomeIcon className="w-4 h-4" />
              Home
            </Link>
            <ChevronRightIcon className="w-3 h-3 text-gray-400" />
            <span className="font-medium">Shopping Cart</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <ShoppingCartIcon className="w-6 h-6" />
          Shopping Cart
          <span className="text-gray-500 text-lg font-normal">({cartItems.length} items)</span>
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCartIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">
              Looks like you haven&apos;t added anything to your cart yet.
            </p>
            <Link
              to="/products"
              className="inline-block bg-[#C41E3A] hover:bg-[#a3182f] text-white font-medium py-3 px-8 rounded-lg transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50 text-sm font-medium text-gray-500">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-3 text-center">Quantity</div>
                  <div className="col-span-3 text-right">Price</div>
                </div>
                <div className="divide-y divide-gray-200 px-4">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={{ ...item, quantity: item.qty }} // mapping qty to quantity for CartItem component
                      onQuantityChange={handleQuantityChange}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>
                <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                  <Link
                    to="/products"
                    className="text-sm font-medium text-[#C41E3A] hover:underline"
                  >
                    ← Continue Shopping
                  </Link>
                  <button
                    onClick={() => clearCart()}
                    className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <OrderSummary subtotal={subtotal} shipping={shipping} tax={tax} total={total} />
            </div>
          </div>
        )}

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((product) => (
                <Link key={product.id} to={`/products/${product.id}`}>
                  <ProductCard product={product} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <BrandLogos />
      <Footer />
    </div>
  );
}
