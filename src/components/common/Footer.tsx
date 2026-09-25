import React, { useState } from 'react';
import { Globe, Mail, Heart, CheckCircle2 } from 'lucide-react';
import { CATEGORIES } from '../../constants/categories';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail.trim() || !contactMessage.trim()) return;
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setShowContactModal(false);
      setContactMessage('');
      setContactEmail('');
    }, 1500);
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Globe className="w-4 h-4" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                NeedFinder<span className="text-blue-500">Global</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Tell us what you need. Find who can provide it. The global marketplace connecting
              customers and verified providers across 190+ countries for products, services,
              property, and custom requirements.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Active Worldwide
              </span>
              <span>Fast • Direct • Transparent</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <button
                    onClick={() => navigate(`/category/${c.slug}`)}
                    className="hover:text-white transition"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => navigate('/categories')}
                  className="text-blue-400 hover:text-blue-300 font-semibold transition"
                >
                  View All 10 Categories →
                </button>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('/how-it-works')}
                  className="hover:text-white transition"
                >
                  How NeedFinder Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/post-need')}
                  className="hover:text-white transition"
                >
                  Post a Requirement
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/provider/needs')}
                  className="hover:text-white transition"
                >
                  For Providers
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/needs')} className="hover:text-white transition">
                  Browse Public Needs
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/providers')}
                  className="hover:text-white transition"
                >
                  Find Providers
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Help */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Company & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setShowContactModal(true)}
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/privacy')} className="hover:text-white transition">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/terms')} className="hover:text-white transition">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/login')} className="hover:text-white transition">
                  Customer Sign In
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/signup')} className="hover:text-white transition">
                  Create Free Account
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} NeedFinderGlobal. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-600">Secure Firestore & Firebase Auth</span>
            <span>•</span>
            <button
              onClick={() => setShowContactModal(true)}
              className="text-slate-400 hover:text-white transition"
            >
              Get Help
            </button>
          </div>
        </div>
      </div>

      {/* Contact Support Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                Contact NeedFinderGlobal Support
              </h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {sentSuccess ? (
              <div className="py-8 text-center flex flex-col items-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-2" />
                <h4 className="font-semibold">Message Received!</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Our support team will get back to you at {contactEmail} within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendContact} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="you@domain.com"
                    required
                    className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    How can we assist you?
                  </label>
                  <textarea
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Tell us what you need help with or report an inquiry..."
                    required
                    className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowContactModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </footer>
  );
};
