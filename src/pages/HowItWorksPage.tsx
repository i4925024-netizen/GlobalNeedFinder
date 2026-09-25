import React from 'react';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { CtaBanners } from '../components/home/CtaBanners';
import { ShieldCheck, CheckCircle2, Globe, HeartHandshake, Zap } from 'lucide-react';

interface HowItWorksPageProps {
  navigate: (path: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ navigate }) => {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          How NeedFinderGlobal Works
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          NeedFinderGlobal flips the traditional marketplace: instead of endless scrolling through
          unrelated products, customers post exactly what they require, and verified providers
          respond with customized proposals.
        </p>
      </div>

      <HowItWorksSection />

      {/* Deep Dive Pillars */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Demand-Driven Commerce</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Save hours searching. Specify your exact budget, conditions, and delivery timeframe. Let
              sellers come to you with competitive quotes.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Verified Providers</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Providers maintain transparent business profiles with confirmed contacts, ratings,
              review histories, and active listings.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Direct Communication</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Use in-app messaging to negotiate terms, inspect photos, agree on milestones, and
              confirm order completion.
            </p>
          </div>
        </div>
      </section>

      <CtaBanners navigate={navigate} />
    </div>
  );
};
