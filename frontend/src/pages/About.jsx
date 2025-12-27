import { TopBar } from '@/components/TopBar';
import { Header } from '@/components/AppHeader';
import { Footer } from '@/components/AppFooter';
import { ArrowRightIcon, GlobeIcon, TruckIcon, ShieldCheckIcon } from '@/components/AppIcons';
import { useState, useEffect } from 'react';
import Preloader from '@/components/ui/Preloader';

export default function About() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Preloader />;

  return (
    <main className="min-h-screen bg-white font-quicksand font-semibold [&_h1]:font-poiret [&_h2]:font-poiret [&_h3]:font-poiret [&_h4]:font-poiret [&_h5]:font-poiret [&_h6]:font-poiret">
      <TopBar />
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 animate-in fade-in duration-700 slide-in-from-bottom-4">
        <div className="text-center">
          <h2 className="text-base font-bold text-[#C41E3A] tracking-wide uppercase">About Us</h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl font-poiret">
            Driven by passion.
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            We are dedicated to providing the best shopping experience for our customers, blending quality with exceptional service.
          </p>
        </div>
        
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
             <div className="pt-6 group">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="-mt-6">
                        <div className="inline-flex items-center justify-center p-3 bg-[#C41E3A] rounded-md shadow-lg group-hover:bg-[#a3182f] transition-colors">
                            <GlobeIcon className="h-6 w-6 text-white" aria-hidden="true" />
                        </div>
                        <h3 className="mt-8 text-lg font-bold text-gray-900 tracking-tight">Our Mission</h3>
                        <p className="mt-5 text-base text-gray-500">
                            To bring high-quality products to customers worldwide with speed, reliability, and a touch of elegance.
                        </p>
                    </div>
                </div>
            </div>
            <div className="pt-6 group">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="-mt-6">
                        <div className="inline-flex items-center justify-center p-3 bg-[#C41E3A] rounded-md shadow-lg group-hover:bg-[#a3182f] transition-colors">
                            <ShieldCheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                        </div>
                        <h3 className="mt-8 text-lg font-bold text-gray-900 tracking-tight">Our Values</h3>
                        <p className="mt-5 text-base text-gray-500">
                            Customer satisfaction, integrity, and innovation are at the core of everything we do. We build trust.
                        </p>
                    </div>
                </div>
            </div>
            <div className="pt-6 group">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="-mt-6">
                        <div className="inline-flex items-center justify-center p-3 bg-[#C41E3A] rounded-md shadow-lg group-hover:bg-[#a3182f] transition-colors">
                            <TruckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                        </div>
                        <h3 className="mt-8 text-lg font-bold text-gray-900 tracking-tight">Our Story</h3>
                        <p className="mt-5 text-base text-gray-500">
                            Started in 2025, we have grown from a small local shop to a global marketplace through dedication.
                        </p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
