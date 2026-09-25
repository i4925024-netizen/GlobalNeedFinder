import React from 'react';
import { PlusCircle, Briefcase, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface CtaBannersProps {
  navigate: (path: string) => void;
}

export const CtaBanners: React.FC<CtaBannersProps> = ({ navigate }) => {
  const { currentUser, providerProfile } = useAuth();

  const handleProviderCta = () => {
    if (!currentUser) {
      navigate('/signup');
    } else if (providerProfile) {
      navigate('/provider/dashboard');
    } else {
      navigate('/provider/profile');
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer CTA Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 sm:p-10 text-white shadow-xl shadow-blue-900/10 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold text-blue-100 mb-4 border border-white/20">
                <Zap className="w-3.5 h-3.5" />
                <span>For Customers & Buyers</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Can't find what you need?
              </h3>

              <p className="mt-3 text-sm sm:text-base text-blue-100 leading-relaxed max-w-md">
                Post your requirement. Providers can respond with suitable products, services, or custom
                offers matching your specifications and budget.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigate('/post-need')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm shadow-md hover:bg-blue-50 active:scale-98 transition"
              >
                <PlusCircle className="w-4 h-4" />
                Post Requirement
              </button>
            </div>
          </div>

          {/* Provider CTA Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 sm:p-10 text-white shadow-xl shadow-slate-950/20 flex flex-col justify-between border border-slate-800">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-xs font-semibold text-slate-300 mb-4 border border-slate-700">
                <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                <span>For Sellers & Service Providers</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Are you a Provider?
              </h3>

              <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-md">
                List your products or services and connect with customers looking for what you offer.
                Discover real buyer requirements and submit direct offers.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <button
                type="button"
                onClick={handleProviderCta}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md hover:bg-blue-500 active:scale-98 transition"
              >
                <Briefcase className="w-4 h-4" />
                Become a Provider
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
