import { useState } from "react"

export function ProductGallery({ images, productName }) {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="flex gap-4">
      {/* Thumbnail column */}
      <div className="flex flex-col gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
              selectedImage === index ? "border-[#C41E3A]" : "border-transparent"
            }`}
          >
            <img
              src={image || "/placeholder.svg"}
              alt={`${productName} view ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden aspect-square">
        <img
          src={images[selectedImage] || "/placeholder.svg"}
          alt={productName}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}
