import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TopBar } from '@/components/TopBar';
import { Header } from '@/components/AppHeader';
import { Footer } from '@/components/AppFooter';
import { BrandLogos } from '@/components/BrandLogos';
import { CheckoutSteps } from '@/components/CheckoutSteps';
import { CheckoutForm } from '@/components/CheckoutForm';
import { CheckoutOrderSummary } from '@/components/CheckoutOrderSummary';
import { HomeIcon, ChevronRightIcon } from '@/components/AppIcons';
import { useCart } from '@/lib/cart';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function Checkout() {
  const [currentStep, setCurrentStep] = useState(2);
  const { items: cartItems, clearCart, coupon } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleCheckoutSubmit = async (formData) => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.qty,
          size: item.size,
          color: item.color,
        })),
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          country: formData.country,
          postalCode: formData.postalCode,
          apartment: formData.apartment,
        },
        paymentMethod: formData.paymentMethod,
        totals: {
          subtotal,
          shipping,
          tax,
          discount,
          total,
        },
        couponCode: coupon ? coupon.code : null,
      };

      // Call API to create order
      await api.post('/orders', orderData);

      toast.success('Order placed successfully!');
      clearCart();
      setCurrentStep(3);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentStep === 3) {
    return (
      <div className="min-h-screen bg-white">
        <TopBar />
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your order. We have sent a confirmation email to your inbox.
          </p>
          <Link
            to="/"
            className="inline-block bg-[#C41E3A] hover:bg-[#a3182f] text-white font-medium py-3 px-8 rounded-lg transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

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
            <span className="font-medium">Checkout</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Steps */}
        <div className="mb-12">
          <CheckoutSteps currentStep={currentStep} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {isSubmitting ? (
              <div className="p-8 text-center bg-gray-50 rounded-lg">
                <p className="text-lg font-medium">Processing your order...</p>
              </div>
            ) : (
              <CheckoutForm onSubmit={handleCheckoutSubmit} />
            )}
          </div>

          {/* Order Summary */}
          <div>
            <CheckoutOrderSummary
              items={cartItems}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
            />
          </div>
        </div>
      </div>

      <BrandLogos />
      <Footer />
    </div>
  );
}
