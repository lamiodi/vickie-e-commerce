import { MapPinIcon, PhoneIcon } from './AppIcons';

export function Footer() {
  return (
    <footer className="bg-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">
          {/* Brand Column */}
          <div>
            <a href="/" className="text-2xl font-bold tracking-tight inline-block mb-4">
              SPORT<span className="text-[#C41E3A]">Z</span>Y
            </a>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              All content on this website is protected by copyright and may not be used without
              permission from Sportzy. For more information about our Privacy Policy, please contact
              our Support Center.
            </p>
            <p className="text-xs text-gray-400 mb-6">
              Copyright © 2025 Sportzy. All Rights Reserved.
            </p>

            <div>
              <h4 className="font-bold text-sm mb-3">Get Our Updates</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#C41E3A]"
                />
                <button className="bg-[#C41E3A] hover:bg-[#a3182f] text-white px-4 py-2 text-sm font-medium transition-colors rounded">
                  SUBSCRIBE
                </button>
              </div>
            </div>
          </div>

          {/* Contact Column */}
          <div>
            <div className="flex items-start gap-2 text-sm mb-3">
              <MapPinIcon className="w-4 h-4 mt-0.5 text-gray-400" />
              <span>
                123 Main Street Chicago, IL
                <br />
                60614 United States
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm mb-3">
              <PhoneIcon className="w-4 h-4 text-gray-400" />
              <span>+1 (302) 555-0124</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>hello@sportzy.com</span>
            </div>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-bold text-sm mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-[#C41E3A]">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#C41E3A]">
                  Testimonials
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#C41E3A]">
                  Tips
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#C41E3A]">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#C41E3A]">
                  Latest Update
                </a>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="font-bold text-sm mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-[#C41E3A]">
                  Order Tracking
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
