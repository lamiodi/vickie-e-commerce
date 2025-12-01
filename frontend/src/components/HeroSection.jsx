import { Link } from 'react-router-dom';
import { ArrowRightIcon } from './Icons';

export function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Hero */}
        <div className="lg:col-span-2 relative rounded-lg overflow-hidden h-[400px] lg:h-[480px]">
          <img
            src="/basketball-hoop-close-up-with-orange-basketball-go.jpg"
            alt="Basketball"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div className="absolute bottom-8 left-8 text-white max-w-sm">
            <p className="text-xs tracking-widest mb-2 opacity-80">THE ORIGINAL</p>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
              BASKETBALL
              <br />
              MONTH
            </h1>
            <p className="text-sm opacity-80 mb-6">
              Celebrate the basketball season
              <br />
              with our selected items
            </p>
            <Link
              to="/products?category=Basketball"
              className="inline-block bg-[#C41E3A] hover:bg-[#a3182f] text-white px-6 py-3 text-sm font-medium transition-colors"
            >
              SHOP NOW
            </Link>
          </div>
        </div>

        {/* Side Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
          {/* Fitness Watch */}
          <div className="bg-[#f5f5f5] rounded-lg p-4 flex items-center gap-4">
            <img
              src="/smart-fitness-tracker-watch-black-digital-display-.jpg"
              alt="Smart Fitness Tracker Watch"
              className="w-20 h-20 object-contain"
            />
            <div>
              <p className="text-[#C41E3A] text-[10px] font-medium tracking-wider mb-1">PROMO</p>
              <h3 className="font-bold text-sm mb-1">
                SMART FITNESS
                <br />
                TRACKER WATCH
              </h3>
              <Link
                to="/products?q=watch"
                className="text-xs flex items-center gap-1 hover:text-[#C41E3A] transition-colors"
              >
                Shop Now <ArrowRightIcon className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Duffel Bag */}
          <div className="bg-[#f5f5f5] rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-sm">
                  DUFFEL
                  <br />
                  BAG
                </h3>
                <p className="text-xs text-gray-500 mt-1">From $29.00</p>
              </div>
              <img
                src="/black-sports-duffel-bag-gym-bag-modern-design.jpg"
                alt="Duffel Bag"
                className="w-16 h-12 object-contain"
              />
            </div>
          </div>

          {/* Running Shoes */}
          <div className="bg-[#f5f5f5] rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-sm">
                  RUNNING
                  <br />
                  SHOES
                </h3>
                <p className="text-xs text-gray-500 mt-1">From $95.00</p>
              </div>
              <img
                src="/red-black-running-shoes-athletic-sneakers-modern-d.jpg"
                alt="Running Shoes"
                className="w-16 h-12 object-contain"
              />
            </div>
          </div>

          {/* Trucker Hat */}
          <div className="bg-[#f5f5f5] rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-sm">
                  TRUCKER
                  <br />
                  HAT
                </h3>
                <p className="text-xs text-gray-500 mt-1">$44.00 $52</p>
              </div>
              <img
                src="/red-trucker-cap-baseball-hat-sports-accessory.jpg"
                alt="Trucker Hat"
                className="w-16 h-12 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
