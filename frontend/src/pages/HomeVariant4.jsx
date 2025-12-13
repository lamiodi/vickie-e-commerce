import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Header } from '@/components/v4/header';
import { PromoBanner } from '@/components/v4/promo-banner';
import { HeroSection } from '@/components/v4/hero-section';
import { ProductCarousel } from '@/components/v4/product-carousel';
import { TacticalSection } from '@/components/v4/tactical-section';
import { PopularSection } from '@/components/v4/popular-section';
import { CategoryCards } from '@/components/v4/category-cards';
import { TrainSection } from '@/components/v4/train-section';
import { ShopCategories } from '@/components/v4/shop-categories';
import { MoreSection } from '@/components/v4/more-section';
import { Footer } from '@/components/v4/footer';

export default function HomeVariant4() {
  const [womenProducts, setWomenProducts] = useState([]);
  const [menProducts, setMenProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
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
            image: p.image || p.video_thumbnail_url || '/placeholder.svg',
            colors: p.variants
              ? [...new Set(p.variants.map((v) => v.color).filter((c) => c && c !== 'Default'))]
              : [],
          }));

        setWomenProducts(process(womenRes.data.products || []));
        setMenProducts(process(menRes.data.products || []));
      } catch (error) {
        console.error('Failed to fetch products for variant 4', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <PromoBanner />
      <Header />
      <HeroSection />
      <ProductCarousel
        title="NEW IN: STORM"
        category="WOMENS"
        viewAllLink="/products?category=Activewear"
        products={womenProducts}
      />
      <TacticalSection />
      <ProductCarousel
        title="NEW IN"
        category="MENS"
        viewAllLink="/products"
        products={menProducts}
      />
      <PopularSection />
      <CategoryCards />
      <TrainSection />
      <ShopCategories />
      <MoreSection />
      <Footer />
    </main>
  );
}
