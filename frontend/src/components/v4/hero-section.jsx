import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <section className="relative bg-[#1a1a1a] text-white overflow-hidden">
      <div className="flex flex-col md:flex-row min-h-[500px]">
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">NEW IN: STORM</h1>
          <p className="text-gray-300 mb-6 max-w-md text-sm leading-relaxed">
            Seamless, ultrasoft engineering, this designed to make you look and feel like a Thunder.
            It&apos;s time to make your entrance.
          </p>
          <Link
            to="/products?category=storm"
            className="text-white underline underline-offset-4 text-sm font-medium hover:no-underline"
          >
            Shop Womens
          </Link>
        </div>
        <div className="flex-1 relative min-h-[300px] md:min-h-auto">
          <img
            src="/athletic-woman-in-dark-seamless-workout-outfit-pos.jpg"
            alt="Storm Collection"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        </div>
      </div>
    </section>
  );
}
