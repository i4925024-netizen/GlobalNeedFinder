import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';

interface PrivacyPageProps {
  navigate: (path: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ navigate }) => {
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
          <Shield className="w-3.5 h-3.5" />
          <span>Draft Privacy Notice</span>
        </div>

        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Privacy Policy</h1>
        <p className="text-xs text-slate-400">Last updated: September 2026 (Draft)</p>

        <div className="mt-8 space-y-6 text-sm text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">1. Overview</h2>
            <p>
              NeedFinderGlobal respects your privacy. This policy outlines how information is collected,
              stored, and handled when you use the NeedFinderGlobal platform to post requirements or
              provide services.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">2. Information Collected</h2>
            <p>
              When you create an account, we collect your name, email address, country, city, and account
              type preferences. When you post a requirement or catalog listing, public information such
              as title, description, category, and budget is shared across the marketplace to enable
              provider matching.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">3. Direct Messaging and Privacy</h2>
            <p>
              In-app messages and conversations between customers and providers are private to the
              designated participants. Phone numbers and private emails are only displayed on public
              provider profiles if the provider explicitly toggles public visibility.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">4. Data Security</h2>
            <p>
              User authentication and database records are secured via Google Firebase Authentication
              and Firestore security rules enforcing attribute-based access controls.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
