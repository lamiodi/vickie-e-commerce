import { TopBar } from '@/components/TopBar';
import { Header } from '@/components/AppHeader';
import { HeroSection } from '@/components/HeroSection';
import { NewProductsSection } from '@/components/NewProductsSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { CategorySection } from '@/components/CategorySection';
import { TrendingProducts } from '@/components/TrendingProducts';
import { FAQSection } from '@/components/FaqSection';
import { Footer } from '@/components/AppFooter';
import Preloader from '@/components/ui/Preloader';
import { useState, useEffect } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Preloader />;

  return (
    <main className="min-h-screen bg-white font-quicksand font-semibold">
      <TopBar />
      <Header />
      <HeroSection />
      <NewProductsSection />
      <FeaturesSection />
      <CategorySection />
      <TrendingProducts />
      <FAQSection />
      <Footer />
    </main>
  );
}
