import { useState } from "react"
import { HeartIcon, ShoppingCartIcon, ShareIcon, EyeIcon } from "./icons"
import { useCart } from "@/lib/cart"
import { toast } from "sonner"

export function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault() // Prevent navigation if inside a Link
    e.stopPropagation()
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: "M", // Default size
      color: "Default", // Default color
      category: product.category,
    })
    toast.success("Added to cart")
  }

  return (
    <div className="group relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {/* Product Image Container */}
      <div className="relative bg-gray-100 rounded-lg aspect-square mb-3 overflow-hidden">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover object-center"
        />

        {/* Discount Badge */}
        {product.discount && (
          <span className="absolute top-3 right-3 bg-[#C41E3A] text-white text-xs font-medium px-2 py-1 rounded">
            -{product.discount}%
          </span>
        )}

        {/* Hover Action Icons */}
        <div
          className={`absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 transition-all duration-300 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#C41E3A] hover:text-white transition-colors">
            <HeartIcon className="w-4 h-4" />
          </button>
          <button 
            onClick={handleAddToCart}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#C41E3A] hover:text-white transition-colors"
          >
            <ShoppingCartIcon className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#C41E3A] hover:text-white transition-colors">
            <ShareIcon className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#C41E3A] hover:text-white transition-colors">
            <EyeIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div>
        <span className="text-[#C41E3A] text-xs font-semibold uppercase tracking-wide">{product.category}</span>
        <h3 className="text-sm font-medium mt-1 mb-1 group-hover:text-[#C41E3A] transition-colors">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">${typeof product.originalPrice === 'number' ? product.originalPrice.toFixed(2) : product.originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  )
}
