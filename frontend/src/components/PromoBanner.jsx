import { ArrowRightIcon } from './AppIcons';

export function PromoBanner() {
  return (
    <section className="relative bg-[#1a1a1a] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative py-16 md:py-24">
          {/* Background Image */}
          <div className="absolute inset-0 opacity-60">
            <img
              src="/snowy-mountain-peak-dramatic-landscape.jpg"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-md">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              UNLOCK YOUR
              <br />
              BEST SELF
            </h2>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Elevate your style on and off the field with our
              <br />
              fashionable sportswear. 40% Off for 15-30 July only.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-[#C41E3A] font-medium hover:gap-3 transition-all"
            >
              Shop Now
              <ArrowRightIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
