import { TopBar } from '@/components/TopBar';
import { Header } from '@/components/AppHeader';
import { Footer } from '@/components/AppFooter';
import { RefreshCcw, TruckIcon, CheckCircle2 } from 'lucide-react';

export default function Returns() {
  return (
    <main className="min-h-screen bg-white font-quicksand font-semibold [&_h1]:font-poiret [&_h2]:font-poiret [&_h3]:font-poiret [&_h4]:font-poiret [&_h5]:font-poiret [&_h6]:font-poiret">
      <TopBar />
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 animate-in fade-in duration-700 slide-in-from-bottom-4">
        <div className="text-center mb-16">
          <h2 className="text-base font-bold text-[#C41E3A] tracking-wide uppercase">Support</h2>
          <h1 className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl font-poiret">
            Return Policy
          </h1>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Simple, hassle-free returns within 30 days.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-[#C41E3A]">
                    <RefreshCcw className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">30-Day Returns</h3>
                <p className="text-gray-500 text-sm">Return any unworn items within 30 days of delivery for a full refund.</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-[#C41E3A]">
                    <TruckIcon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Free Return Shipping</h3>
                <p className="text-gray-500 text-sm">Use our prepaid return label for easy and free return shipping.</p>
            </div>
             <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-[#C41E3A]">
                    <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Fast Refunds</h3>
                <p className="text-gray-500 text-sm">Refunds are processed within 5-7 business days after we receive your return.</p>
            </div>
        </div>

        <div className="prose max-w-none text-gray-600">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-poiret">How to Return</h3>
            <ol className="list-decimal pl-5 space-y-2 mb-8">
                <li>Log in to your account and go to "Order History".</li>
                <li>Select the order containing the item(s) you wish to return.</li>
                <li>Click "Request Return" and follow the instructions to print your prepaid shipping label.</li>
                <li>Pack the item(s) securely in the original packaging if possible.</li>
                <li>Attach the shipping label to the outside of the package.</li>
                <li>Drop off the package at any authorized shipping carrier location.</li>
            </ol>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-poiret">Exceptions</h3>
            <p className="mb-4">
                Some items are non-returnable, including:
            </p>
            <ul className="list-disc pl-5 space-y-2">
                <li>Final sale items</li>
                <li>Underwear and swimwear (for hygiene reasons)</li>
                <li>Gift cards</li>
            </ul>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
