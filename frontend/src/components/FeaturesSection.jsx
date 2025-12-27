import { ArrowRightIcon, GlobeIcon, TruckIcon, ShieldCheckIcon } from './AppIcons';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: GlobeIcon,
    title: 'Worldwide Shipping',
    description: 'Boost sales quickly with our worldwide shipping.',
  },
  {
    icon: TruckIcon,
    title: 'Free Delivery',
    description: 'We have delivery options for everyone, safe and fast.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Secure Transaction',
    description: 'We use verified gateways to ensure safe transactions.',
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-[#1f1f1f] text-white pt-20 pb-24 relative overflow-visible">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div className="flex items-center gap-6">
            <div className="w-1.5 h-24 bg-[#C41E3A] rounded-full hidden lg:block"></div>
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold leading-none tracking-tight font-poiret">
                WE ARE
                <br />
                <span className="text-gray-500">DIFFERENT</span>
              </h2>
            </div>
          </div>
          
          <div className="flex flex-col items-start lg:items-end gap-4">
            <p className="text-gray-400 text-sm max-w-sm lg:text-right leading-relaxed">
              Discover our qualities that makes us different from other marketplace.
            </p>
            <Link
              to="/about"
              className="group flex items-center gap-2 text-sm font-bold text-[#C41E3A] hover:text-white transition-colors"
            >
              More About Us 
              <span className="bg-[#C41E3A] text-white rounded-full p-1 group-hover:bg-white group-hover:text-[#C41E3A] transition-colors">
                <ArrowRightIcon className="w-3 h-3" />
              </span>
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden shadow-2xl">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-10 flex flex-col items-start gap-4 hover:bg-gray-50 transition-all duration-300 group"
            >
              <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-[#C41E3A] transition-colors duration-300">
                <feature.icon className="w-6 h-6 text-gray-900 group-hover:text-white transition-colors duration-300" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
