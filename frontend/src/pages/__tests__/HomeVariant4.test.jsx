import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import HomeVariant4 from '../HomeVariant4';
import { api } from '@/lib/api';

// Mock the API module
vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

// Mock the child components that we don't want to fully render or that fetch their own data
// For this integration test, we want to verify HomeVariant4's data fetching, so we'll mock the complex children
// to avoid cascading API calls from children like PopularSection.
vi.mock('@/components/v4/popular-section', () => ({
  PopularSection: () => <div data-testid="popular-section">Popular Section</div>,
}));

// Mock other simple components to keep the DOM clean
vi.mock('@/components/v4/promo-banner', () => ({
  PromoBanner: () => <div data-testid="promo-banner">Promo Banner</div>,
}));
vi.mock('@/components/v4/header', () => ({
  Header: () => <div data-testid="header">Header</div>,
}));
vi.mock('@/components/v4/footer', () => ({
  Footer: () => <div data-testid="footer">Footer</div>,
}));

// We will test that these components receive the correct props
vi.mock('@/components/v4/hero-section', () => ({
  HeroSection: ({ title }) => <div data-testid="hero-section">{title}</div>,
}));
vi.mock('@/components/v4/tactical-section', () => ({
  TacticalSection: ({ title }) => <div data-testid="tactical-section">{title}</div>,
}));
vi.mock('@/components/v4/product-carousel', () => ({
  ProductCarousel: ({ title, products }) => (
    <div data-testid="product-carousel">
      <h2>{title}</h2>
      <ul>
        {products.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  ),
}));

describe('HomeVariant4', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockWomenProducts = {
    data: {
      products: [
        {
          id: '1',
          name: 'Hero Leggings',
          price: 50,
          image: '/hero.jpg',
          variants: [{ color: 'Black' }],
        },
        {
          id: '2',
          name: 'Women Short',
          price: 30,
          variants: [{ color: 'Blue' }],
        },
      ],
    },
  };

  const mockMenProducts = {
    data: {
      products: [
        {
          id: '3',
          name: 'Tactical Shirt',
          price: 40,
          image: '/tactical.jpg',
          variants: [{ color: 'Green' }],
        },
        {
          id: '4',
          name: 'Men Short',
          price: 35,
          variants: [{ color: 'Grey' }],
        },
      ],
    },
  };

  it('renders loading state initially', () => {
    // Return a promise that doesn't resolve immediately
    api.get.mockReturnValue(new Promise(() => {}));

    const { container } = render(
      <MemoryRouter>
        <HomeVariant4 />
      </MemoryRouter>
    );

    // Look for the spinner or loading indicator
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('fetches and displays products successfully', async () => {
    api.get.mockImplementation((url) => {
      if (url.includes('Activewear')) return Promise.resolve(mockWomenProducts);
      return Promise.resolve(mockMenProducts);
    });

    render(
      <MemoryRouter>
        <HomeVariant4 />
      </MemoryRouter>
    );

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Hero Leggings')).toBeInTheDocument(); // Hero title from mock
    });

    // Check Hero Section (Should pick the first product with image from women products)
    expect(screen.getByTestId('hero-section')).toHaveTextContent('HERO LEGGINGS');

    // Check Tactical Section (Should pick the first product with image from men products)
    expect(screen.getByTestId('tactical-section')).toHaveTextContent('TACTICAL SHIRT');

    // Check Carousels
    const carousels = screen.getAllByTestId('product-carousel');
    expect(carousels).toHaveLength(2);
    expect(carousels[0]).toHaveTextContent('NEW IN: ACTIVEWEAR');
    expect(carousels[1]).toHaveTextContent('NEW IN');
  });

  it('handles error state gracefully', async () => {
    api.get.mockRejectedValue(new Error('Network error'));

    render(
      <MemoryRouter>
        <HomeVariant4 />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load products. Please try again later.')).toBeInTheDocument();
    });

    // Check Retry button
    const retryButton = screen.getByText('Retry');
    expect(retryButton).toBeInTheDocument();

    // Test Retry Logic
    api.get.mockImplementation((url) => {
      if (url.includes('Activewear')) return Promise.resolve(mockWomenProducts);
      return Promise.resolve(mockMenProducts);
    });

    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    });
  });
});
