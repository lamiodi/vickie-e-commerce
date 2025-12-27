import { Link } from 'react-router-dom';
import { siteConfig } from '@/site-config';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Info Section */}
          <div className="mb-12">
            <h3 className="text-lg font-bold mb-4">WORKOUT CLOTHES & GYM CLOTHES</h3>
            <p className="text-xs text-gray-600 leading-relaxed max-w-4xl">
              Welcome to {siteConfig.name}. We exist to unite the conditioning community. Designed
              for all levels of condition, we deliver premium, carefully considered products for
              those who aspire to be their best. Every rep counts for results. Being part of the{' '}
              {siteConfig.name}
              conditioning community isn&apos;t just about what clothes you wear. We help you unlock
              your potential.
            </p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div>
              <h4 className="font-bold text-sm mb-4">HELP</h4>
              <ul className="space-y-2 text-xs text-gray-600">
                <li>
                  <Link to="#" className="hover:underline">
                    Help Centre
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:underline">
                    Delivery Information
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:underline">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:underline">
                    Make A Return
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:underline">
                    Orders
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:underline">
                    Submit A Fake
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4">MY ACCOUNT</h4>
              <ul className="space-y-2 text-xs text-gray-600">
                <li>
                  <Link to="/account" className="hover:underline">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/account" className="hover:underline">
                    Register
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4">PAGES</h4>
              <ul className="space-y-2 text-xs text-gray-600">
                <li>
                  <Link to="#" className="hover:underline">
                    {siteConfig.name} Central
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:underline">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:underline">
                    Student Discount
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:underline">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4">MORE ABOUT {siteConfig.name.toUpperCase()}</h4>
              <ul className="space-y-2 text-xs text-gray-600">
                {/* Content truncated in original, leaving placeholder */}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8">
            <p className="text-xs text-gray-500">
              © {siteConfig.copyrightYear || new Date().getFullYear()} {siteConfig.name} Limited |
              All Rights Reserved. Be a visionary.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
