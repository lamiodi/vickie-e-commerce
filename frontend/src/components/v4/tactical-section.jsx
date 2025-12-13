import { Link } from 'react-router-dom';

export function TacticalSection() {
  return (
    <section className="relative bg-[#f5f0e8] overflow-hidden my-8">
      <div className="flex flex-col md:flex-row min-h-[400px]">
        <div className="flex-1 relative min-h-[250px] md:min-h-auto">
          <img
            src="/muscular-man-in-olive-green-tactical-gym-wear-posi.jpg"
            alt="Tactical Collection"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-black">
            NEW TACTICAL NOW
            <br />
            LIVE
          </h2>
          <p className="text-gray-700 mb-6 max-w-md text-sm">
            Performance ready intensity that lifts you, your week, your sessions, year round.
            It&apos;s here.
          </p>
          <Link
            to="/products?category=tactical"
            className="text-black underline underline-offset-4 text-sm font-medium hover:no-underline"
          >
            Shop Mens
          </Link>
        </div>
      </div>
    </section>
  );
}
