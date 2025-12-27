import { TopBar } from '@/components/TopBar';
import { Header } from '@/components/AppHeader';
import { Footer } from '@/components/AppFooter';
import { PhoneIcon, MapPinIcon } from '@/components/AppIcons';
import { useState, useEffect } from 'react';
import Preloader from '@/components/ui/Preloader';

export default function Contact() {
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
        <div className="max-w-lg mx-auto md:max-w-none md:grid md:grid-cols-2 md:gap-8">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl font-montserrat uppercase tracking-wide">
              Get in touch
            </h2>
            <div className="mt-3">
              <p className="text-lg text-gray-500">
                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>
            <div className="mt-9">
              <div className="flex group">
                <div className="flex-shrink-0">
                  <PhoneIcon className="h-6 w-6 text-gray-400 group-hover:text-[#C41E3A] transition-colors" aria-hidden="true" />
                </div>
                <div className="ml-3 text-base text-gray-500">
                  <p className="font-medium text-gray-900">+234 806 578 8783</p>
                  <p className="mt-1">Mon-Fri 8am to 6pm PST</p>
                </div>
              </div>
              <div className="mt-6 flex group">
                <div className="flex-shrink-0">
                  <MapPinIcon className="h-6 w-6 text-gray-400 group-hover:text-[#C41E3A] transition-colors" aria-hidden="true" />
                </div>
                <div className="ml-3 text-base text-gray-500">
                  <p className="font-medium text-gray-900">123 Main Street</p>
                  <p className="mt-1">Chicago, IL 60614</p> 
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 sm:mt-16 md:mt-0">
            <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl font-poiret uppercase tracking-wide">
              Send us a message
            </h2>
            <form action="#" method="POST" className="mt-6 grid grid-cols-1 gap-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                  Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    autoComplete="name"
                    className="py-3 px-4 block w-full border border-gray-300 shadow-sm focus:ring-[#C41E3A] focus:border-[#C41E3A] rounded-md transition-colors"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="py-3 px-4 block w-full border border-gray-300 shadow-sm focus:ring-[#C41E3A] focus:border-[#C41E3A] rounded-md transition-colors"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-bold text-gray-700">
                  Message
                </label>
                <div className="mt-1">
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="py-3 px-4 block w-full shadow-sm focus:ring-[#C41E3A] focus:border-[#C41E3A] border border-gray-300 rounded-md transition-colors"
                    defaultValue={''}
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-bold rounded-md text-white bg-[#C41E3A] hover:bg-[#a3182f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C41E3A] transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
