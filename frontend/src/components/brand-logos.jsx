export function BrandLogos() {
  const brands = ["Olukai", "Swift", "SPORTS", "Nike", "Puma"]

  return (
    <section className="border-y border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          {brands.map((brand, index) => (
            <div key={index} className="text-gray-400 font-bold text-xl tracking-wider">
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
