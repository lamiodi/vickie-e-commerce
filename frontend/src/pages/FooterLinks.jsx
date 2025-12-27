import { TopBar } from '@/components/TopBar';
import { Header } from '@/components/AppHeader';
import { Footer } from '@/components/AppFooter';
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '@/components/AppIcons';
import PropTypes from 'prop-types';

const companyLinks = [
  { name: 'About Us', path: '/about', description: 'Learn more about our story and mission.' },
  { name: 'Testimonials', path: '/testimonials', description: 'See what our customers are saying.' },
  { name: 'Tips', path: '/tips', description: 'Helpful guides and tips for our products.' },
  { name: 'Terms & Conditions', path: '/terms', description: 'Our legal terms and conditions.' },
  { name: 'Latest Update', path: '/blog', description: 'News and updates from our team.' },
];

const supportLinks = [
  { name: 'About Us', path: '/about', description: 'Who we are and what we stand for.' },
  { name: 'Testimonials', path: '/testimonials', description: 'Customer success stories.' },
  { name: 'Tips', path: '/tips', description: 'Usage guides and helpful hints.' },
  { name: 'Terms & Conditions', path: '/terms', description: 'Legal information.' },
  { name: 'Latest Update', path: '/blog', description: 'Recent announcements.' },
  { name: 'Support', path: '/contact', description: 'Get in touch with our support team.' },
  { name: 'Order Tracking', path: '/admin', description: 'Track your recent orders.' },
  { name: 'Help & Support', path: '/contact', description: 'FAQ and support resources.' },
  { name: 'Return Policy', path: '/returns', description: 'Information about returns and refunds.' },
];

export default function FooterLinks() {
  return (
    <main 
      className="min-h-screen bg-white font-quicksand font-semibold [&_h1]:font-poiret [&_h2]:font-poiret [&_h3]:font-poiret [&_h4]:font-poiret [&_h5]:font-poiret [&_h6]:font-poiret"
      aria-label="Site directory and navigation links"
    >
      <TopBar />
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 animate-in fade-in duration-700 slide-in-from-bottom-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl font-poiret">
            Site <span className="text-[#C41E3A]">Directory</span>
          </h1>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Find everything you need in one place. Browse our company information and support resources.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Company Section */}
          <section aria-labelledby="company-heading">
            <div className="flex items-center gap-3 mb-8 border-b border-gray-200 pb-4">
              <h2 id="company-heading" className="text-2xl font-bold text-gray-900">Company</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {companyLinks.length} Links
              </span>
            </div>
            <div className="grid gap-4" role="list" aria-label="Company links">
              {companyLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="group flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-transparent hover:border-[#C41E3A]/20 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C41E3A] focus:ring-offset-2"
                  role="listitem"
                  aria-label={`${link.name}: ${link.description}`}
                  tabIndex={0}
                >
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#C41E3A] transition-colors">
                      {link.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{link.description}</p>
                  </div>
                  <ChevronRightIcon 
                    className="w-5 h-5 text-gray-400 group-hover:text-[#C41E3A] transition-colors" 
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </section>

          {/* Support Section */}
          <section aria-labelledby="support-heading">
            <div className="flex items-center gap-3 mb-8 border-b border-gray-200 pb-4">
              <h2 id="support-heading" className="text-2xl font-bold text-gray-900">Support</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#C41E3A]/10 text-[#C41E3A]">
                {supportLinks.length} Links
              </span>
            </div>
            <div className="grid gap-4" role="list" aria-label="Support links">
              {supportLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="group flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-transparent hover:border-[#C41E3A]/20 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C41E3A] focus:ring-offset-2"
                  role="listitem"
                  aria-label={`${link.name}: ${link.description}`}
                  tabIndex={0}
                >
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#C41E3A] transition-colors">
                      {link.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{link.description}</p>
                  </div>
                  <ChevronRightIcon 
                    className="w-5 h-5 text-gray-400 group-hover:text-[#C41E3A] transition-colors" 
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}

FooterLinks.propTypes = {
  // Component does not accept props
};
