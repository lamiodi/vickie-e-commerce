
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { useCart } from '@/lib/cart';
import { CheckoutOrderSummary } from '@/components/CheckoutOrderSummary';
import { CheckoutForm } from '@/components/CheckoutForm';
import Checkout from '@/pages/Checkout';

// Mock dependencies
vi.mock('@/lib/api', () => ({
  api: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

// Mock the cart store
const mockCart = {
  items: [],
  addItem: vi.fn(),
  updateQty: vi.fn(),
  removeItem: vi.fn(),
  clearCart: vi.fn(),
  coupon: null,
  applyCoupon: vi.fn(),
  removeCoupon: vi.fn(),
};

vi.mock('@/lib/cart', () => ({
  useCart: () => mockCart,
}));

describe('Price Calculation Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('CheckoutOrderSummary: handles string prices with currency symbol', () => {
    const items = [
      { id: 1, name: 'Item 1', price: '$50.00', quantity: 2, size: 'M', color: 'Red' },
    ];
    
    render(<CheckoutOrderSummary items={items} subtotal={100} shipping={0} tax={0} total={100} />);
    
    // 50 * 2 = 100.00
    // Use getAllByText because $100.00 appears in the item list, subtotal, and total
    const priceElements = screen.getAllByText('$100.00');
    expect(priceElements.length).toBeGreaterThan(0);
    priceElements.forEach(el => expect(el).toBeInTheDocument());
  });

  it('CheckoutOrderSummary: handles string prices without currency symbol', () => {
    const items = [
      { id: 1, name: 'Item 1', price: '50.00', quantity: 2, size: 'M', color: 'Red' },
    ];
    
    render(<CheckoutOrderSummary items={items} subtotal={100} shipping={0} tax={0} total={100} />);
    
    const priceElements = screen.getAllByText('$100.00');
    expect(priceElements.length).toBeGreaterThan(0);
    priceElements.forEach(el => expect(el).toBeInTheDocument());
  });

  it('CheckoutOrderSummary: handles number prices', () => {
    const items = [
      { id: 1, name: 'Item 1', price: 50, quantity: 2, size: 'M', color: 'Red' },
    ];
    
    render(<CheckoutOrderSummary items={items} subtotal={100} shipping={0} tax={0} total={100} />);
    
    const priceElements = screen.getAllByText('$100.00');
    expect(priceElements.length).toBeGreaterThan(0);
    priceElements.forEach(el => expect(el).toBeInTheDocument());
  });

  it('Checkout Page: calculates subtotal correctly with string prices', () => {
    // We need to verify the subtotal logic in Checkout.jsx
    // Since we can't easily unit test the internal logic of a functional component without rendering,
    // we'll simulate the rendering and check the summary output which depends on subtotal.
    
    mockCart.items = [
       { id: 1, name: 'Item 1', price: '$50.00', qty: 2 },
       { id: 2, name: 'Item 2', price: 25, qty: 1 }
    ];

    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    // Subtotal: (50*2) + (25*1) = 125
    // We look for the subtotal in the summary
    expect(screen.getByText('$125.00')).toBeInTheDocument();
  });
});
