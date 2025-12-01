import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { ProductCard } from "@/components/product-card"
import { ProductsFilterBar } from "@/components/products-filter-bar"
import { ProductsPagination } from "@/components/products-pagination"
import { PromoBanner } from "@/components/promo-banner"
import { BrandLogos } from "@/components/brand-logos"
import { Footer } from "@/components/footer"
import { HomeIcon, ChevronRightIcon } from "@/components/icons"
import { api } from "@/lib/api"
import { toast } from "sonner"

export default function Products() {
  const [currentPage, setCurrentPage] = useState(1)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalResults, setTotalResults] = useState(0)
  const pageSize = 16

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        // Assuming the API endpoint supports pagination
        // const response = await api.get(`/products?page=${currentPage}&limit=${pageSize}`)
        // For now, we'll just fetch all and slice or assuming the endpoint returns an array
        // Adjust the endpoint as per actual backend API
        const response = await api.get('/products') 
        
        // If backend returns { data: [], total: ... }
        if (response.data && Array.isArray(response.data)) {
             setProducts(response.data)
             setTotalResults(response.data.length)
        } else if (response.data && response.data.products) {
             setProducts(response.data.products)
             setTotalResults(response.data.total || response.data.products.length)
        } else {
            setProducts([])
        }

      } catch (error) {
        console.error("Failed to fetch products:", error)
        toast.error("Failed to load products. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [currentPage])

  const totalPages = Math.ceil(totalResults / pageSize)

  return (
    <main className="min-h-screen bg-white">
      <TopBar />
      <Header />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
            <Link to="/" className="flex items-center gap-1 text-gray-500 hover:text-[#C41E3A] transition-colors">
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
        <ProductsFilterBar totalResults={totalResults} currentPage={currentPage} pageSize={pageSize} />

        {/* Product Grid */}
        {loading ? (
            <div className="py-20 text-center">Loading products...</div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
            {products.map((product) => (
                <Link key={product.id} to={`/products/${product.id}`}>
                <ProductCard product={product} />
                </Link>
            ))}
            </div>
        )}

        {/* Pagination */}
        {!loading && products.length > 0 && (
            <ProductsPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        )}
      </div>

      <PromoBanner />
      <BrandLogos />
      <Footer />
    </main>
  )
}
