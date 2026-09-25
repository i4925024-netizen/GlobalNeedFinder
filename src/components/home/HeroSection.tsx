import React, { useState } from 'react';
import { Search, Globe, Tag, Layers, PlusCircle, ArrowRight } from 'lucide-react';
import { CountrySelector } from '../common/CountrySelector';

interface HeroSectionProps {
  onSearch: (query: string, country: string) => void;
  navigate: (path: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, navigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm.trim(), selectedCountry);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-white pt-14 pb-16 sm:pt-18 sm:pb-20 border-b border-slate-100">
      {/* Subtle background decoration */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-blue-100/40 to-transparent pointer-events-none" />
      <div className="absolute -top-24 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Small badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-semibold shadow-xs mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>🌍 Global marketplace for products, services & real-world needs</span>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
          Tell us what you need.
          <br />
          <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Find who can provide it.
          </span>
        </h1>

        {/* Supporting text */}
        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Connect directly with verified providers. Buy or sell products, hire services, rent property,
          find vehicles, jobs, and custom requirements worldwide.
        </p>

        {/* Global Search Bar */}
        <div className="mt-9 max-w-3xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl shadow-blue-900/5 border border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10"
          >
            {/* Search Query Input */}
            <div className="flex-1 flex items-center gap-3 px-3 py-1 bg-slate-50/60 sm:bg-transparent rounded-xl">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products, services, vehicles, property, or jobs..."
                className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
              />
            </div>

            {/* Country Selector */}
            <div className="sm:w-56 shrink-0">
              <CountrySelector
                value={selectedCountry}
                onChange={setSelectedCountry}
                includeAllOption={true}
                placeholder="Select country"
              />
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-sm font-bold shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-2 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </form>

          {/* Quick search tags */}
          <div className="mt-4 flex items-center justify-center flex-wrap gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-600">Popular:</span>
            {['Products & Goods', 'Vehicles', 'Web Development', 'Apartments', 'Electronics'].map(
              (tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSearchTerm(tag);
                    onSearch(tag, selectedCountry);
                  }}
                  className="px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 transition"
                >
                  {tag}
                </button>
              )
            )}
          </div>
        </div>

        {/* Dual Action Cards for Sellers vs Buyers */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto text-left">
          {/* Option 1: Selling / Providing Products or Services */}
          <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-xs hover:shadow-md transition group">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
                  Offering a Product or Service?
                </h3>
                <p className="text-[11px] text-slate-500">Showcase your goods, catalog, or skills</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/provider/listings/new')}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                List Your Product
              </button>
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition flex items-center gap-1"
              >
                Browse Products <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Option 2: Looking for something / Posting a Need */}
          <div className="bg-white rounded-2xl border border-blue-200 p-5 shadow-xs hover:shadow-md transition group">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition">
                  Looking to Buy or Request Something?
                </h3>
                <p className="text-[11px] text-slate-500">Post what you need and get quotes</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/post-need')}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Post a Need
              </button>
              <button
                type="button"
                onClick={() => navigate('/needs')}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition flex items-center gap-1"
              >
                Browse Needs <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
