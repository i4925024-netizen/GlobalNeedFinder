import React, { useState, useEffect } from 'react';
import { ProviderProfile } from '../types';
import { getProviders } from '../services/providersService';
import { ProviderCard } from '../components/cards/ProviderCard';
import { CountrySelector } from '../components/common/CountrySelector';
import { CATEGORIES } from '../constants/categories';
import { Users, Search, RefreshCw, Briefcase } from 'lucide-react';

interface ProvidersPageProps {
  navigate: (path: string) => void;
}

export const ProvidersPage: React.FC<ProvidersPageProps> = ({ navigate }) => {
  const [providers, setProviders] = useState<ProviderProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [country, setCountry] = useState('all');
  const [search, setSearch] = useState('');

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const data = await getProviders({
        category,
        country,
        searchQuery: search,
      });
      setProviders(data);
    } catch (err) {
      console.error('Error fetching providers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [category, country]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProviders();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Verified Providers & Sellers
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Connect with companies, agencies, and individual providers around the world
          </p>
        </div>

        <button
          onClick={() => navigate('/provider/dashboard')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-sm transition"
        >
          <Briefcase className="w-4 h-4" />
          Provider Portal
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-8 shadow-xs">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Search Providers
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Business name, expertise..."
              className="w-full text-xs border border-slate-300 rounded-lg p-2.5 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-800"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Country
            </label>
            <CountrySelector
              value={country}
              onChange={setCountry}
              includeAllOption={true}
              placeholder="All Countries"
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition"
            >
              Search Providers
            </button>
            <button
              type="button"
              onClick={() => {
                setCategory('all');
                setCountry('all');
                setSearch('');
              }}
              className="p-2.5 border border-slate-300 text-slate-500 hover:text-slate-800 rounded-lg"
              title="Reset"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-60 rounded-xl bg-white border border-slate-200 animate-pulse p-6" />
          ))}
        </div>
      ) : providers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((p) => (
            <ProviderCard key={p.id} provider={p} onNavigate={navigate} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 max-w-md mx-auto">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No providers found</h3>
          <p className="text-xs text-slate-500 mt-1">Try expanding your search parameters.</p>
        </div>
      )}
    </div>
  );
};
