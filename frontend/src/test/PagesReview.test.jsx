import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Products from '../pages/Products';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Account from '../pages/Account';

// Mock API
vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));
import { api } from '@/lib/api';

// Mock Cart Hook
const mockCart = {
  items: [],
  addItem: vi.fn(),
  updateQty: vi.fn(),
  removeItem: vi.fn(),
  clearCart: vi.fn(),
};
vi.mock('@/lib/cart', () => ({
  useCart: () => mockCart,
}));

// Mock Auth Hook (if needed)
vi.mock('@/lib/auth', () => ({
  getMe: vi.fn(),
  meOrders: vi.fn(),
  login: vi.fn(),
  register: vi.fn(),
}));
import { getMe } from '@/lib/auth';

describe('Page Functionality Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. Products Page
  it('Products Page: loads and displays products', async () => {
    const mockProducts = [
      { id: 1, name: 'Test Product 1', price: 100, images: ['/test1.jpg'] },
      { id: 2, name: 'Test Product 2', price: 200, images: ['/test2.jpg'] },
    ];
    api.get.mockResolvedValue({ data: mockProducts });

    render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading products...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });
  });

  // 2. Product Detail Page
  it('Product Detail Page: loads product and adds to cart', async () => {
    const mockProduct = {
      id: 1,
      name: 'Detailed Product',
      price: 99.99,
      description: 'A great product',
      images: ['/detail.jpg'],
      sizes: ['S', 'M', 'L'],
      colors: [{ name: 'Red', hex: '#FF0000' }],
    };
    api.get.mockResolvedValue({ data: mockProduct });

    render(
      <MemoryRouter initialEntries={['/products/1']}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    );

    const productTexts = await screen.findAllByText(/Detailed Product/i);
    expect(productTexts.length).toBeGreaterThan(0);
    expect(productTexts[0]).toBeInTheDocument();

    // Check if price is displayed (regex for price format)
    expect(screen.getByText(/\$99\.99/)).toBeInTheDocument();

    // Check if Add to Cart button works
    const addToCartBtn = screen.getByText(/Add to Cart/i); // Adjust selector if text is different, usually icon + text
    fireEvent.click(addToCartBtn);

    expect(mockCart.addItem).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        name: 'Detailed Product',
      })
    );
  });

  // 3. Cart Page
  it('Cart Page: displays items and summary', async () => {
    mockCart.items = [{ id: 1, name: 'Cart Item 1', price: 50, qty: 2, image: '/img1.jpg' }];
    api.get.mockResolvedValue({ data: [] }); // Mock recommended products

    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    expect(screen.getByText('Cart Item 1')).toBeInTheDocument();
    // Use regex for price to handle potential formatting differences or split elements
    const priceElements = screen.getAllByText(/50\.00/);
    expect(priceElements.length).toBeGreaterThan(0);
    expect(priceElements[0]).toBeInTheDocument();

    // Subtotal: 50 * 2 = 100
    const totalElements = screen.getAllByText(/100\.00/);
    expect(totalElements.length).toBeGreaterThan(0);
    expect(totalElements[0]).toBeInTheDocument();
  });

  // 4. Checkout Page
  it('Checkout Page: renders form', async () => {
    mockCart.items = [{ id: 1, name: 'Item', price: 10, qty: 1 }];
    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    // Should start at step 2 (Shipping/Billing) or similar based on logic
    // Adjust based on initial state of Checkout.jsx (currentStep = 2)
    // Handle multiple "Checkout" texts (breadcrumb, title)
    const checkoutTexts = screen.getAllByText(/Checkout/i);
    expect(checkoutTexts.length).toBeGreaterThan(0);
    expect(checkoutTexts[0]).toBeInTheDocument();

    expect(screen.getByText('Shipping Address')).toBeInTheDocument(); // Validated from CheckoutForm.jsx
  });

  // 5. Account Page (Auth Flow)
  it('Account Page: redirects to login if not authenticated', async () => {
    getMe.mockRejectedValue(new Error('Not authenticated')); // Mock failed auth

    render(
      <MemoryRouter>
        <Account />
      </MemoryRouter>
    );

    // Use findAllByText to handle potential multiple matches and wait for appearance
    const signSignInElements = await screen.findAllByText(/Sign In/i);
    expect(signSignInElements.length).toBeGreaterThan(0);
    expect(signSignInElements[0]).toBeInTheDocument();
  });

  it('Account Page: loads user data if authenticated', async () => {
    getMe.mockResolvedValue({ id: 1, name: 'Test User', email: 'test@example.com' });
    // Mock orders call which happens after user load
    // The component imports meOrders from @/lib/auth, which we mocked
    const { meOrders } = await import('@/lib/auth');
    meOrders.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <Account />
      </MemoryRouter>
    );

    // Wait for user data to appear
    // Use regex to handle potential whitespace issues
    const nameElements = await screen.findAllByText(/Test\s*User/i);
    expect(nameElements.length).toBeGreaterThan(0);
    expect(nameElements[0]).toBeInTheDocument();

    const emailElements = await screen.findAllByText(/test@example\.com/i);
    expect(emailElements.length).toBeGreaterThan(0);
    expect(emailElements[0]).toBeInTheDocument();
  });
});
