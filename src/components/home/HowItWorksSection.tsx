import React from 'react';
import { FileText, MapPin, Handshake, CheckCircle } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Describe your need',
      description:
        'Tell us what product, service, property, job or other requirement you are looking for with your preferred budget and conditions.',
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      tag: 'Step 1',
    },
    {
      number: '02',
      title: 'Choose your location',
      description:
        'Select your country and city so relevant providers can be found near your requirement, or open it up for global remote fulfillment.',
      icon: <MapPin className="w-6 h-6 text-blue-600" />,
      tag: 'Step 2',
    },
    {
      number: '03',
      title: 'Connect with providers',
      description:
        'Review suitable offers, chat directly with verified providers, accept the best proposal, and fulfill your requirement seamlessly.',
      icon: <Handshake className="w-6 h-6 text-blue-600" />,
      tag: 'Step 3',
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200/60 px-3 py-1 rounded-full">
            Transparent Workflow
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            How NeedFinder Works
          </h2>
          <p className="mt-2 text-base text-slate-600">
            Simple for customers. Useful for providers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-xs relative flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="text-3xl font-black text-slate-200 font-mono">
                    {step.number}
                  </span>
                </div>

                <div className="inline-block text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded mb-2">
                  {step.tag}
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-medium text-emerald-600">
                <CheckCircle className="w-4 h-4" />
                <span>Zero hidden platform fees</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
