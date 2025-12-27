import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import { Header } from '@/components/v4/header';
import { PromoBanner } from '@/components/v4/promo-banner';
import { HeroSection } from '@/components/v4/hero-section';
import { ProductCarousel } from '@/components/v4/product-carousel';
import { TacticalSection } from '@/components/v4/tactical-section';
import { PopularSection } from '@/components/v4/popular-section';
import { TrainSection } from '@/components/v4/train-section';
import { ShopCategories } from '@/components/v4/shop-categories';
import { MoreSection } from '@/components/v4/more-section';
import { SeoTextSection } from '@/components/v4/seo-text-section';
import { Footer } from '@/components/v4/footer';
import Preloader from '@/components/ui/Preloader';

export default function HomeVariant4() {
  const [womenProducts, setWomenProducts] = useState([]);
  const [menProducts, setMenProducts] = useState([]);
  const [heroProduct, setHeroProduct] = useState(null);
  const [tacticalProduct, setTacticalProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setError(null);
      const [womenRes, menRes] = await Promise.all([
        api.get('/products?category=Activewear&limit=6&sort=newest'),
        api.get('/products?limit=6&sort=trending'),
      ]);

      const process = (products) =>
        products.map((p) => ({
          id: p.id,
          name: p.name,
          price: `£${Number(p.price).toFixed(2)}`,
          originalPrice: p.originalPrice ? `£${Number(p.originalPrice).toFixed(2)}` : null,
          badge: p.badge,
          image: getImageUrl(
            p.image || p.video_thumbnail_url || p.images?.[0] || '/placeholder.svg'
          ),
          colors: p.variants
            ? [...new Set(p.variants.map((v) => v.color).filter((c) => c && c !== 'Default'))]
            : [],
        }));

      setWomenProducts(process(womenRes.data.products || []));
      setMenProducts(process(menRes.data.products || []));

      // Dynamic Hero
      const allProducts = womenRes.data.products || [];
      const hero =
        allProducts.find((p) => p.image || (p.images && p.images.length > 0)) || allProducts[0];
      setHeroProduct(hero);

      // Dynamic Tactical Product (Secondary)
      const allMen = menRes.data.products || [];
      const tactical =
        allMen.find((p) => (p.image || (p.images && p.images.length > 0)) && p.id !== hero?.id) ||
        allMen[0];
      setTacticalProduct(tactical);
    } catch (error) {
      console.error('Failed to fetch products for variant 4', error);
      setError('Failed to load products. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // Real-time synchronization (polling every 60 seconds)
    const intervalId = setInterval(fetchProducts, 60000);
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => {
            setIsLoading(true);
            fetchProducts();
          }}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white v4-root">
      <style>{`
        .v4-root {
          font-family: "Jost", sans-serif !important;
          font-optical-sizing: auto;
          font-style: normal;
        }
        .v4-root h1, 
        .v4-root h2, 
        .v4-root h3, 
        .v4-root h4, 
        .v4-root h5, 
        .v4-root h6, 
        .v4-root .font-heading {
          font-family: "Montserrat", sans-serif !important;
          font-optical-sizing: auto;
          font-style: normal;
        }
      `}</style>
      <PromoBanner />
      <Header />
      <HeroSection
        title={heroProduct?.name?.toUpperCase() || 'NEW ACTIVEWEAR'}
        subtitle={
          heroProduct?.description?.length > 150
            ? `${heroProduct.description.substring(0, 150)}...`
            : heroProduct?.description
        }
        image={getImageUrl(heroProduct?.image || heroProduct?.images?.[0])}
        link={heroProduct ? `/products/${heroProduct.id}` : '/products'}
      />
      <ProductCarousel
        title="NEW IN: ACTIVEWEAR"
        category="WOMENS"
        viewAllLink="/products?category=Activewear"
        products={womenProducts}
      />
      <TacticalSection
        title={tacticalProduct?.name?.toUpperCase() || 'NEW COLLECTION'}
        subtitle={
          tacticalProduct?.description?.length > 150
            ? `${tacticalProduct.description.substring(0, 150)}...`
            : tacticalProduct?.description
        }
        image={tacticalProduct?.image || tacticalProduct?.images?.[0]}
        link={tacticalProduct ? `/products/${tacticalProduct.id}` : '/products'}
      />
      <ProductCarousel
        title="NEW IN"
        category="MENS"
        viewAllLink="/products"
        products={menProducts}
      />
      <PopularSection />
      <TrainSection />
      <ShopCategories />
      <MoreSection />
      <SeoTextSection />
      <Footer />
    </main>
  );
}
