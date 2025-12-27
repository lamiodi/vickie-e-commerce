import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/lib/cart';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export function OrderSummary({ subtotal, shipping, tax, total, showCheckoutButton = true }) {
  const { coupon, applyCoupon, removeCoupon } = useCart();
  const [couponCode, setCouponCode] = useState(coupon ? coupon.code : '');
  const [loading, setLoading] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post('/coupons/validate', { code: couponCode, orderAmount: subtotal });
      applyCoupon(data);
      toast.success('Coupon applied successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Invalid coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponCode('');
    toast.success('Coupon removed');
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-lg font-bold mb-4">Order Summary</h2>

      <div className="space-y-3 pb-4 border-b border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>
        {coupon && (
            <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span className="font-medium">-${coupon.discountAmount?.toFixed(2)}</span>
            </div>
        )}
      </div>

      <div className="flex justify-between py-4 border-b border-gray-200">
        <span className="font-bold">Total</span>
        <span className="font-bold text-lg">${total.toFixed(2)}</span>
      </div>

      {/* Coupon Code */}
      <div className="py-4 border-b border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            disabled={!!coupon}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#C41E3A] disabled:bg-gray-100 disabled:text-gray-500"
          />
          {coupon ? (
            <button 
                onClick={handleRemoveCoupon}
                className="px-4 py-2 bg-red-100 text-red-600 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors"
            >
              Remove
            </button>
          ) : (
            <button 
                onClick={handleApplyCoupon}
                disabled={loading || !couponCode.trim()}
                className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? '...' : 'Apply'}
            </button>
          )}
        </div>
        {coupon && (
            <div className="mt-2 text-sm text-green-600 font-medium">
                Coupon applied: {coupon.code} (-${coupon.discountAmount?.toFixed(2)})
            </div>
        )}
      </div>

      {showCheckoutButton && (
        <Link
          to="/checkout"
          className="w-full bg-[#C41E3A] hover:bg-[#a3182f] text-white font-medium py-3 px-6 rounded-lg mt-6 flex items-center justify-center transition-colors"
        >
          Proceed to Checkout
        </Link>
      )}

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
        <span>Secure SSL Encryption</span>
      </div>
    </div>
  );
}
