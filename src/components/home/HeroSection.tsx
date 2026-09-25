import React, { useState } from 'react';
import { Search, Globe, Sparkles } from 'lucide-react';
import { CountrySelector } from '../common/CountrySelector';

interface HeroSectionProps {
  onSearch: (query: string, country: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm.trim(), selectedCountry);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-white pt-16 pb-20 sm:pt-20 sm:pb-24 border-b border-slate-100">
      {/* Subtle background decoration */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-blue-100/40 to-transparent pointer-events-none" />
      <div className="absolute -top-24 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Small badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-semibold shadow-xs mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>🌍 Global marketplace for real-world needs</span>
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
          Search products, services, property, vehicles, jobs, remote work and other legal
          requirements anywhere in the world.
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
                placeholder="What are you looking for? (e.g. Toyota Corolla, React dev, 2BHK flat)"
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
            {['Vehicles', 'React Developer', 'Dubai Apartments', 'Electronics', 'Graphic Design'].map(
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
      </div>
    </section>
  );
};
