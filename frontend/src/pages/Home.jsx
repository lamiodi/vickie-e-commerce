import { TopBar } from '@/components/TopBar';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { NewProductsSection } from '@/components/NewProductsSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { CategorySection } from '@/components/CategorySection';
import { TrendingProducts } from '@/components/TrendingProducts';
import { FAQSection } from '@/components/FaqSection';
import { BlogSection } from '@/components/BlogSection';
import { BrandLogos } from '@/components/BrandLogos';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <TopBar />
      <Header />
      <HeroSection />
      <NewProductsSection />
      <FeaturesSection />
      <CategorySection />
      <TrendingProducts />
      <FAQSection />
      <BlogSection />
      <BrandLogos />
      <Footer />
    </main>
  );
}
