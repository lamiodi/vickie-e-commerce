import { TopBar } from '@/components/TopBar';
import { Header } from '@/components/AppHeader';
import { Footer } from '@/components/AppFooter';
import { ChevronRightIcon } from '@/components/AppIcons';

const tips = [
  {
    title: "Care for Your Activewear",
    description: "Wash your activewear in cold water and avoid fabric softeners to maintain elasticity and breathability.",
    category: "Product Care"
  },
  {
    title: "Choosing the Right Size",
    description: "Check our size guide for detailed measurements. When in doubt, size up for comfort or down for a compressive fit.",
    category: "Sizing"
  },
  {
    title: "Layering for Cold Weather",
    description: "Start with a moisture-wicking base layer, add an insulating middle layer, and finish with a windproof outer shell.",
    category: "Style Guide"
  }
];

export default function Tips() {
  return (
    <main className="min-h-screen bg-white font-quicksand font-semibold [&_h1]:font-poiret [&_h2]:font-poiret [&_h3]:font-poiret [&_h4]:font-poiret [&_h5]:font-poiret [&_h6]:font-poiret">
      <TopBar />
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 animate-in fade-in duration-700 slide-in-from-bottom-4">
        <div className="text-center mb-16">
          <h2 className="text-base font-bold text-[#C41E3A] tracking-wide uppercase">Tips & Guides</h2>
          <h1 className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl font-poiret">
            Get the most out of your gear
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tips.map((tip, index) => (
            <div key={index} className="group relative bg-white border border-gray-200 rounded-xl p-6 hover:border-[#C41E3A]/50 transition-colors duration-300">
              <div className="absolute top-0 right-0 -mt-3 -mr-3 w-16 h-16 bg-[#C41E3A]/5 rounded-full blur-2xl group-hover:bg-[#C41E3A]/10 transition-colors" />
              <p className="text-xs font-bold text-[#C41E3A] uppercase tracking-wide mb-3">
                {tip.category}
              </p>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#C41E3A] transition-colors">
                {tip.title}
              </h3>
              <p className="text-gray-500 mb-6">
                {tip.description}
              </p>
              <div className="flex items-center text-sm font-bold text-[#C41E3A] group-hover:translate-x-1 transition-transform cursor-pointer">
                Read more <ChevronRightIcon className="w-4 h-4 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
