import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';

interface TermsPageProps {
  navigate: (path: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ navigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </button>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-8 sm:p-12 prose prose-slate max-w-none">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full w-fit mb-4">
          <FileText className="w-3.5 h-3.5" />
          <span>Draft Terms of Service</span>
        </div>

        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Terms of Service</h1>
        <p className="text-xs text-slate-400">Last updated: September 2026 (Draft)</p>

        <div className="mt-8 space-y-6 text-sm text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing and using NeedFinderGlobal, you agree to comply with these terms. Users must
              only submit lawful requirements and accurate provider representations.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">2. Marketplace Conduct</h2>
            <p>
              All published needs, listings, and quotes must adhere to local and international legal
              standards. Abusive content, scam attempts, fraudulent listings, or prohibited goods are
              strictly forbidden and subject to immediate administrative removal and account suspension.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">3. Direct Transactions</h2>
            <p>
              NeedFinderGlobal functions as a connection engine between customers with requirements and
              verified providers. Parties are encouraged to establish clear contractual agreements,
              warranties, and escrow safeguards for high-value fulfillment.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
