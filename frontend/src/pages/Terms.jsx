import { TopBar } from '@/components/TopBar';
import { Header } from '@/components/AppHeader';
import { Footer } from '@/components/AppFooter';

export default function Terms() {
  return (
    <main className="min-h-screen bg-white font-quicksand font-semibold [&_h1]:font-poiret [&_h2]:font-poiret [&_h3]:font-poiret [&_h4]:font-poiret [&_h5]:font-poiret [&_h6]:font-poiret">
      <TopBar />
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl font-poiret">
                Terms & Conditions
            </h1>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
                Please read these terms carefully before using our services.
            </p>
        </div>

        <div className="prose max-w-none text-gray-600 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-poiret">1. Acceptance of Terms</h2>
            <p>
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this websites particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-poiret">2. Use of the Site</h2>
            <p>
              You agree to use the site for lawful purposes only and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the site. Prohibited behavior includes harassing or causing distress or inconvenience to any other user.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-poiret">3. Intellectual Property</h2>
            <p>
              The content, layout, design, data, databases and graphics on this website are protected by United States and other international intellectual property laws and are owned by the Company or its licensors.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-poiret">4. Limitation of Liability</h2>
            <p>
              In no event shall the Company be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the Company's website.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
