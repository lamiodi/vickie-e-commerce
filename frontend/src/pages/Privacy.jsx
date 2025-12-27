import { TopBar } from '@/components/TopBar';
import { Header } from '@/components/AppHeader';
import { Footer } from '@/components/AppFooter';

export default function Privacy() {
  return (
    <main className="min-h-screen bg-white font-quicksand font-semibold [&_h1]:font-poiret [&_h2]:font-poiret [&_h3]:font-poiret [&_h4]:font-poiret [&_h5]:font-poiret [&_h6]:font-poiret">
      <TopBar />
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl font-poiret">
                Privacy Policy
            </h1>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
                Your privacy is important to us.
            </p>
        </div>
        
        <div className="prose max-w-none text-gray-600 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-poiret">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create an account, make a purchase, sign up for our newsletter, or contact us for support. This may include your name, email address, shipping address, and payment information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-poiret">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services, such as to process transactions, send you order confirmations, and communicate with you about promotions and updates.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-poiret">3. Sharing of Information</h2>
            <p>
              We do not share your personal information with third parties except as necessary to provide our services (e.g., with shipping carriers and payment processors) or as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-poiret">4. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal information. You can manage your account settings or contact us directly to exercise these rights.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
