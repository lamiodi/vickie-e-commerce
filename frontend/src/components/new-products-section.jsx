import { useState, useEffect } from "react"
import { ArrowRightIcon } from "./icons"
import { api } from "@/lib/api"
import { Link } from "react-router-dom"

export function NewProductsSection() {
  const [newProducts, setNewProducts] = useState([])

  useEffect(() => {
    const fetchNewProducts = async () => {
        try {
            // Adjust endpoint
            const response = await api.get('/products?sort=newest&limit=2')
            // Ensure we map the data correctly if needed
            const products = response.data.products || response.data || []
            setNewProducts(products)
        } catch (error) {
            console.error("Failed to fetch new products", error)
            // Fallback to empty or mock if strictly needed for display but user asked to remove mock
            setNewProducts([]) 
        }
    }
    fetchNewProducts()
  }, [])

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">New Products</h2>
        <Link to="/products" className="flex items-center gap-2 text-sm text-[#C41E3A] hover:underline">
          View All <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Featured Banner */}
        <div className="relative rounded-lg overflow-hidden h-[350px]">
          <img src="/woman-doing-yoga-meditation-pose-on-mountain-top-s.jpg" alt="For Your Mind and Body" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
          <div className="absolute bottom-8 left-8 text-white">
            <p className="text-[#C41E3A] text-xs tracking-wider mb-2">ON TREND</p>
            <h3 className="text-3xl font-bold leading-tight mb-2">
              FOR YOUR MIND
              <br />
              AND BODY
            </h3>
            <p className="text-sm opacity-80 mb-4">
              Get our Premium Anti-Slip
              <br />
              Yoga Mat with 30% off!
            </p>
            <Link to="/products" className="flex items-center gap-2 text-sm font-medium hover:text-[#C41E3A] transition-colors">
              Shop Now <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-2 gap-4">
          {newProducts.length > 0 ? newProducts.slice(0, 2).map((product) => (
            <Link to={`/products/${product.id}`} key={product.id} className="group">
              <div className="bg-[#f5f5f5] rounded-lg p-4 mb-3 relative overflow-hidden aspect-square">
                {product.originalPrice && (
                  <span className="absolute top-3 left-3 bg-[#C41E3A] text-white text-[10px] px-2 py-1 rounded">
                    SALE
                  </span>
                )}
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-3 right-3 flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === 1 ? "bg-black" : "bg-gray-300"}`} />
                  ))}
                </div>
              </div>
              <p className="text-[#C41E3A] text-[10px] font-medium tracking-wider mb-1">{product.category}</p>
              <h4 className="font-medium text-sm mb-1">{product.name}</h4>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</span>
                {product.originalPrice && (
                  <span className="text-gray-400 text-xs line-through">${typeof product.originalPrice === 'number' ? product.originalPrice.toFixed(2) : product.originalPrice}</span>
                )}
              </div>
            </Link>
          )) : (
            <div className="col-span-2 flex items-center justify-center text-gray-500 text-sm">
                Loading new products...
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
