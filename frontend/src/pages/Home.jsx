import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { NewProductsSection } from "@/components/new-products-section"
import { FeaturesSection } from "@/components/features-section"
import { CategorySection } from "@/components/category-section"
import { TrendingProducts } from "@/components/trending-products"
import { FAQSection } from "@/components/faq-section"
import { BlogSection } from "@/components/blog-section"
import { BrandLogos } from "@/components/brand-logos"
import { Footer } from "@/components/footer"

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
  )
}
