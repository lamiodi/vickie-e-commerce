import { ArrowRightIcon } from "./icons"

const categories = [
  {
    name: "MEN",
    image: "/athletic-man-running-outdoor-sports-photography-dr.jpg",
  },
  {
    name: "KIDS",
    image: "/happy-child-playing-sports-outdoors-kid-running-su.jpg",
  },
  {
    name: "WOMEN",
    image: "/woman-stretching-fitness-yoga-athletic-wear-outdoo.jpg",
  },
]

export function CategorySection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((category, index) => (
          <div key={index} className="relative rounded-lg overflow-hidden h-[400px] group">
            <img
              src={category.image || "/placeholder.svg"}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6">
              <a
                href="#"
                className="flex items-center gap-2 text-white font-bold text-lg hover:text-[#C41E3A] transition-colors"
              >
                {category.name} <ArrowRightIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
