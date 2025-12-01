import { ArrowRightIcon, GlobeIcon, TruckIcon, ShieldCheckIcon } from "./icons"

const features = [
  {
    icon: GlobeIcon,
    title: "Worldwide Shipping",
    description: "Doesn't matter wherever you are, we will always get your orders",
  },
  {
    icon: TruckIcon,
    title: "Free Delivery",
    description: "No more additional fees when you pay for what you want.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Secure Transaction",
    description: "We are perfect marketplace with 100% Safety guarantee",
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-[#1a1a1a] text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-12">
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              WE ARE
              <br />
              DIFFERENT
            </h2>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
            <p className="text-gray-400 text-sm max-w-xs">
              Discover our qualities that makes us different than other marketplace.
            </p>
            <a
              href="#"
              className="flex items-center gap-2 text-sm font-medium hover:text-[#C41E3A] transition-colors whitespace-nowrap"
            >
              More About Us <ArrowRightIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white text-black rounded-lg p-6">
              <feature.icon className="w-10 h-10 mb-4" />
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
