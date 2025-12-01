import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../lib/cart.js";
import { Helmet } from "react-helmet-async";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Section from "../components/ui/Section.jsx";

export default function Cart() {
  const { items, updateQty, removeItem, clearCart, getTotalPrice, getTotalItems } = useCart();
  const navigate = useNavigate();
  
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [notification, setNotification] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const shippingCost = 5.99;
  const freeShippingThreshold = 50;

  // Calculate totals
  const subtotal = items.reduce((total, item) => {
    if (selectedItems.includes(item.id)) {
      return total + (Number(item.price) * item.qty);
    }
    return total;
  }, 0);

  const discount = appliedPromo ? (subtotal * appliedPromo.discount) / 100 : 0;
  const discountedSubtotal = subtotal - discount;
  const finalShipping = discountedSubtotal >= freeShippingThreshold ? 0 : shippingCost;
  const tax = discountedSubtotal * 0.08; // 8% tax
  const total = discountedSubtotal + finalShipping + tax;

  // Load saved cart from localStorage on mount
  useEffect(() => {
    const savedPromo = localStorage.getItem('appliedPromo');
    if (savedPromo) {
      try {
        setAppliedPromo(JSON.parse(savedPromo));
      } catch (e) {
        console.error('Failed to load saved promo:', e);
      }
    }
  }, []);

  // Save promo to localStorage when applied
  useEffect(() => {
    if (appliedPromo) {
      localStorage.setItem('appliedPromo', JSON.stringify(appliedPromo));
    } else {
      localStorage.removeItem('appliedPromo');
    }
  }, [appliedPromo]);

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const handleQuantityChange = useCallback((itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const item = items.find(i => i.id === itemId);
    if (item && newQuantity > item.maxQuantity) {
      showNotification(`Maximum quantity available is ${item.maxQuantity}`, 'error');
      return;
    }
    
    updateQty(itemId, newQuantity);
    showNotification('Quantity updated');
  }, [items, updateQty, showNotification]);

  const handleRemoveItem = useCallback((itemId, itemName) => {
    removeItem(itemId);
    setSelectedItems(prev => prev.filter(id => id !== itemId));
    showNotification(`${itemName} removed from cart`);
  }, [removeItem, showNotification]);

  const handleApplyPromo = useCallback(async () => {
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }

    setIsApplyingPromo(true);
    setPromoError('');

    // Simulate API call to validate promo code
    setTimeout(() => {
      const mockPromos = {
        'SAVE10': { code: 'SAVE10', discount: 10, description: '10% off' },
        'WELCOME20': { code: 'WELCOME20', discount: 20, description: '20% off for new customers' },
        'FREESHIP': { code: 'FREESHIP', discount: 0, description: 'Free shipping', freeShipping: true }
      };

      const promo = mockPromos[promoCode.toUpperCase()];
      
      if (promo) {
        setAppliedPromo(promo);
        setPromoCode('');
        showNotification(`Promo code ${promo.code} applied! ${promo.description}`);
      } else {
        setPromoError('Invalid promo code');
      }
      
      setIsApplyingPromo(false);
    }, 1000);
  }, [promoCode, showNotification]);

  const handleRemovePromo = useCallback(() => {
    setAppliedPromo(null);
    setPromoError('');
    showNotification('Promo code removed');
  }, [showNotification]);

  const handleItemSelect = useCallback((itemId) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (isSelectAll) {
      setSelectedItems([]);
      setIsSelectAll(false);
    } else {
      setSelectedItems(items.map(item => item.id));
      setIsSelectAll(true);
    }
  }, [items, isSelectAll]);

  const handleClearCart = useCallback(() => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      clearCart();
      setSelectedItems([]);
      setAppliedPromo(null);
      showNotification('Cart cleared');
    }
  }, [clearCart, showNotification]);

  const handleSaveForLater = useCallback((itemId, itemName) => {
    // Simulate saving item for later
    showNotification(`${itemName} saved for later`);
  }, [showNotification]);

  const handleMoveToWishlist = useCallback((itemId, itemName) => {
    handleRemoveItem(itemId, itemName);
    showNotification(`${itemName} moved to wishlist`);
  }, [handleRemoveItem, showNotification]);

  const handleCheckout = useCallback(() => {
    if (selectedItems.length === 0) {
      showNotification('Please select at least one item to checkout', 'error');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/checkout', { 
        state: { 
          selectedItems, 
          promo: appliedPromo,
          subtotal: discountedSubtotal,
          shipping: finalShipping,
          tax: tax,
          total: total
        } 
      });
    }, 1000);
  }, [selectedItems, appliedPromo, discountedSubtotal, finalShipping, tax, total, navigate, showNotification]);

  const CartItem = ({ item }) => {
    const isSelected = selectedItems.includes(item.id);
    
    return (
      <Card className={`p-4 transition-all ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
        <div className="flex items-start gap-4">
          {/* Selection Checkbox */}
          <div className="flex-shrink-0">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleItemSelect(item.id)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>

          {/* Product Image */}
          <div className="flex-shrink-0">
            <img
              src={item.image || "https://via.placeholder.com/80x80?text=Product"}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-lg"
              loading="lazy"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                {item.size && <p className="text-sm text-gray-600">Size: {item.size}</p>}
                {item.color && <p className="text-sm text-gray-600">Color: {item.color}</p>}
              </div>
              <button
                onClick={() => handleRemoveItem(item.id, item.name)}
                className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                aria-label={`Remove ${item.name} from cart`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Price and Quantity */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-gray-900">${item.price}</span>
                {item.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">${item.originalPrice}</span>
                )}
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuantityChange(item.id, item.qty - 1)}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={item.qty <= 1}
                  aria-label="Decrease quantity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                
                <span className="w-8 text-center font-medium">{item.qty}</span>
                
                <button
                  onClick={() => handleQuantityChange(item.id, item.qty + 1)}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={item.qty >= item.maxQuantity}
                  aria-label="Increase quantity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Item Total */}
            <div className="mt-2 text-right">
              <span className="font-medium text-gray-900">
                ${(item.price * item.qty).toFixed(2)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="mt-3 flex gap-2 text-sm">
              <button
                onClick={() => handleSaveForLater(item.id, item.name)}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Save for Later
              </button>
              <span className="text-gray-400">|</span>
              <button
                onClick={() => handleMoveToWishlist(item.id, item.name)}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Move to Wishlist
              </button>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <Helmet>
          <title>Shopping Cart | Sporty</title>
          <meta name="description" content="View and manage your shopping cart items" />
        </Helmet>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section title="Shopping Cart">
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
              <Button as={Link} to="/products" variant="primary">
                Continue Shopping
              </Button>
            </div>
          </Section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Helmet>
        <title>Shopping Cart ({getTotalItems()}) | Sporty</title>
        <meta name="description" content="View and manage your shopping cart items with advanced features" />
      </Helmet>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg animate-slide-in ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        } text-white`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {notification.message}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Section title={`Shopping Cart (${getTotalItems()} items)`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Cart Controls */}
              <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSelectAll}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">Select All</span>
                  </label>
                  <span className="text-sm text-gray-600">
                    {selectedItems.length} item(s) selected
                  </span>
                </div>
                <button
                  onClick={handleClearCart}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Clear Cart
                </button>
              </div>

              {/* Cart Items List */}
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>

              {/* Continue Shopping */}
              <div className="mt-6 text-center">
                <Button as={Link} to="/products" variant="secondary">
                  Continue Shopping
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                  
                  {/* Promo Code */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Promo Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter promo code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!!appliedPromo}
                      />
                      {appliedPromo ? (
                        <Button
                          onClick={handleRemovePromo}
                          variant="secondary"
                          size="sm"
                        >
                          Remove
                        </Button>
                      ) : (
                        <Button
                          onClick={handleApplyPromo}
                          variant="secondary"
                          size="sm"
                          disabled={isApplyingPromo}
                        >
                          {isApplyingPromo ? '...' : 'Apply'}
                        </Button>
                      )}
                    </div>
                    {promoError && (
                      <p className="mt-1 text-sm text-red-600">{promoError}</p>
                    )}
                    {appliedPromo && (
                      <p className="mt-1 text-sm text-green-600">
                        {appliedPromo.description} applied!
                      </p>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({selectedItems.length} items)</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount ({appliedPromo?.description})</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span className={finalShipping === 0 ? 'text-green-600' : ''}>
                        {finalShipping === 0 ? 'FREE' : `$${finalShipping.toFixed(2)}`}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Tax (8%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    
                    <hr className="border-gray-200" />
                    
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Free Shipping Progress */}
                  {discountedSubtotal < freeShippingThreshold && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800 mb-2">
                        Add ${(freeShippingThreshold - discountedSubtotal).toFixed(2)} more for free shipping!
                      </p>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${(discountedSubtotal / freeShippingThreshold) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Checkout Button */}
                  <Button
                    onClick={handleCheckout}
                    disabled={selectedItems.length === 0 || isLoading}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </div>
                    ) : (
                      `Checkout (${selectedItems.length} items)`
                    )}
                  </Button>

                  {/* Security Notice */}
                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Secure checkout powered by Stripe</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}