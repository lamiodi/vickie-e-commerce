import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { TopBar } from '@/components/TopBar';
import { Header } from '@/components/AppHeader';
import { ProductCard } from '@/components/ProductCard';
import { ProductsFilterBar } from '@/components/ProductsFilterBar';
import { ProductsPagination } from '@/components/ProductsPagination';
import { PromoBanner } from '@/components/PromoBanner';
import { BrandLogos } from '@/components/BrandLogos';
import { Footer } from '@/components/AppFooter';
import { HomeIcon, ChevronRightIcon } from '@/components/AppIcons';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import Preloader from '@/components/ui/Preloader';

export default function Products() {
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const pageSize = 16;

  const [layout, setLayout] = useState('grid');
  const [filters, setFilters] = useState({});

  // Sync URL params to filters
  useEffect(() => {
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const q = searchParams.get('q');
    
    setFilters(prev => {
      const next = { ...prev };
      if (category) next.category = category; else delete next.category;
      if (brand) next.brand = brand; else delete next.brand;
      if (q) next.q = q; else delete next.q;
      return next;
    });
    setCurrentPage(1);
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Build query string from filters
        let query = `/products?page=${currentPage}&limit=${pageSize}`;
        if (filters.category) query += `&category=${filters.category}`;
        if (filters.brand) query += `&brand=${filters.brand}`;
        if (filters.q) query += `&q=${encodeURIComponent(filters.q)}`;
        // if (filters.size) query += `&size=${filters.size}`; // Backend needs support for size/price filtering
        // if (filters.price) query += `&priceRange=${filters.price}`;

        const response = await api.get(query);

        if (response.data && Array.isArray(response.data)) {
          setProducts(response.data);
          setTotalResults(response.data.length);
        } else if (response.data && (response.data.products || Array.isArray(response.data.data))) {
          const newProducts = response.data.products || response.data.data;
          setProducts(newProducts);
          setTotalResults(response.data.total || newProducts.length);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        toast.error('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, pageSize, filters]);

  const handleFilterChange = (type, value) => {
      setFilters(prev => ({ ...prev, [type]: value }));
      setCurrentPage(1); // Reset to page 1 on filter change
  };

  const totalPages = Math.ceil(totalResults / pageSize);

  if (loading) return <Preloader />;

  return (
    <main className="min-h-screen bg-white">
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
            <span className="font-medium">Products</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Filter Bar */}
        <ProductsFilterBar
          totalResults={totalResults}
          currentPage={currentPage}
          pageSize={pageSize}
          onFilterChange={handleFilterChange}
          onLayoutChange={setLayout}
        />

        {/* Product Grid */}
        {loading ? null : ( // Don't show loading text
          <div className={`py-8 gap-6 ${layout === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'flex flex-col space-y-4'}`}>
            {products.map((product) => (
              <div key={product.id} className={layout === 'list' ? 'flex gap-4 border p-4 rounded-lg' : ''}>
                {layout === 'list' ? (
                   // List View Layout (Custom or reused ProductCard with props)
                   // For simplicity, we wrap ProductCard but in list mode we might want different styling.
                   // ProductCard is designed as a card. Let's stick to Grid for now or use a wrapper.
                   // Actually, let's keep ProductCard for grid, and make a simple List row for list view.
                   <div className="flex w-full gap-6 items-center">
                        <Link to={`/products/${product.id}`} className="w-32 h-32 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                            <img src={product.image || '/placeholder.jpg'} alt={product.name} className="w-full h-full object-cover" />
                        </Link>
                        <div className="flex-1">
                            <p className="text-[#C41E3A] text-xs font-bold uppercase mb-1">{product.category}</p>
                            <Link to={`/products/${product.id}`} className="text-lg font-bold hover:text-[#C41E3A] transition-colors block mb-2">{product.name}</Link>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                            <p className="text-lg font-bold">£{Number(product.price).toFixed(2)}</p>
                        </div>
                   </div>
                ) : (
                  <Link to={`/products/${product.id}`}>
                    <ProductCard product={product} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && products.length > 0 && (
          <ProductsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <PromoBanner />
      <BrandLogos />
      <Footer />
    </main>
  );
}
