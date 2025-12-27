import { MapPinIcon, PhoneIcon } from './AppIcons';
import { siteConfig } from '@/site-config';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      await api.post('/newsletter/subscribe', { email });
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error('This email is already subscribed.');
      } else {
        toast.error('Failed to subscribe. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#1a1a1a] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-gray-800">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="text-2xl font-bold tracking-tight inline-block text-white font-poiret">
              ASWBY<span className="text-[#C41E3A]">VICKIE</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              All content on this website is protected by copyright and may not be used without
              permission from {siteConfig.name}.
            </p>
            <div className="text-sm text-gray-400">
              <p>
                Copyright © {siteConfig.copyrightYear || new Date().getFullYear()} {siteConfig.name}
                .
              </p>
              <p>All Rights Reserved.</p>
            </div>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-bold text-base mb-6 text-white">{t('footer.company')}</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link to="/about" className="hover:text-[#C41E3A] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="hover:text-[#C41E3A] transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link to="/tips" className="hover:text-[#C41E3A] transition-colors">
                  Tips
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#C41E3A] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-[#C41E3A] transition-colors">
                  Latest Update
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="font-bold text-base mb-6 text-white">{t('footer.support')}</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link to="/admin" className="hover:text-[#C41E3A] transition-colors">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#C41E3A] transition-colors">
                  Help & Support
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-[#C41E3A] transition-colors">
                  Return Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Subscribe Column */}
          <div className="space-y-8">
            <div>
              <h4 className="font-bold text-base mb-6 text-white">{t('footer.contact')}</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-sm text-gray-400">
                  <MapPinIcon className="w-5 h-5 mt-0.5 text-[#C41E3A]" />
                  <span>
                    {siteConfig.address.full.split(' ').slice(0, 3).join(' ')}
                    <br />
                    {siteConfig.address.full.split(' ').slice(3).join(' ')}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <PhoneIcon className="w-5 h-5 text-[#C41E3A]" />
                  <span>{siteConfig.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <svg
                    className="w-5 h-5 text-[#C41E3A]"
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
                  <span>{siteConfig.email}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-base mb-4 text-white">{t('footer.subscribe')}</h4>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder={t('footer.email_placeholder')}
                  className="flex-1 px-4 py-2.5 text-sm bg-gray-800 border border-gray-700 text-white rounded focus:outline-none focus:border-[#C41E3A] placeholder-gray-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-[#C41E3A] hover:bg-[#a3182f] text-white px-5 py-2.5 text-sm font-bold tracking-wide transition-colors rounded uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '...' : t('footer.subscribe_btn')}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              {t('footer.terms')}
            </Link>
            <Link to="/links" className="hover:text-white transition-colors">
              {t('footer.sitemap')}
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {/* Payment Icons Placeholder */}
            <div className="flex gap-2 opacity-50">
              <div className="w-8 h-5 bg-gray-700 rounded"></div>
              <div className="w-8 h-5 bg-gray-700 rounded"></div>
              <div className="w-8 h-5 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
