import React, { useState, useEffect } from 'react';
import { Need } from '../types';
import { getNeeds } from '../services/needsService';
import { NeedCard } from '../components/cards/NeedCard';
import { CountrySelector } from '../components/common/CountrySelector';
import { OfferFormModal } from '../components/forms/OfferFormModal';
import { CATEGORIES } from '../constants/categories';
import { Search, Filter, Layers, Send, RefreshCw, Briefcase } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ProviderBrowseNeedsPageProps {
  navigate: (path: string) => void;
}

export const ProviderBrowseNeedsPage: React.FC<ProviderBrowseNeedsPageProps> = ({ navigate }) => {
  const { currentUser } = useAuth();
  const [needs, setNeeds] = useState<Need[]>([]);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('all');
  const [country, setCountry] = useState('all');
  const [city, setCity] = useState('');

  const [selectedNeedForOffer, setSelectedNeedForOffer] = useState<Need | null>(null);

  const fetchNeeds = async () => {
    setLoading(true);
    try {
      const data = await getNeeds({
        category,
        country,
        city,
        searchQuery: keyword,
        status: 'OPEN',
      });
      setNeeds(data);
    } catch (err) {
      console.error('Error fetching provider needs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNeeds();
  }, [category, country]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNeeds();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Provider Lead Finder</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Browse Customer Requirements
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Real customer requests ready for your bids and proposals
          </p>
        </div>

        <button
          onClick={() => navigate('/provider/dashboard')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition self-start sm:self-auto"
        >
          Provider Dashboard
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-8 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Search Keywords
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. Corolla, React, Apartment..."
              className="w-full text-xs border border-slate-300 rounded-lg p-2.5 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900"
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
              Filter Needs
            </button>
            <button
              type="button"
              onClick={() => {
                setKeyword('');
                setCategory('all');
                setCountry('all');
                setCity('');
              }}
              className="p-2.5 border border-slate-300 text-slate-500 hover:text-slate-800 rounded-lg"
              title="Reset"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Grid of Needs */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 rounded-xl bg-white border border-slate-200 animate-pulse p-6" />
          ))}
        </div>
      ) : needs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {needs.map((need) => (
            <div key={need.id} className="relative group">
              <NeedCard need={need} onNavigate={navigate} />
              {currentUser && currentUser.uid !== need.ownerId && need.status === 'OPEN' && (
                <div className="mt-2 text-right">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNeedForOffer(need);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition"
                  >
                    <Send className="w-3 h-3" />
                    Submit Offer
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 max-w-md mx-auto">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No matching requirements</h3>
          <p className="text-xs text-slate-500 mt-1">Try expanding your category or country filters.</p>
        </div>
      )}

      {selectedNeedForOffer && (
        <OfferFormModal
          isOpen={Boolean(selectedNeedForOffer)}
          need={selectedNeedForOffer}
          onClose={() => setSelectedNeedForOffer(null)}
          onSuccess={() => {
            fetchNeeds();
          }}
        />
      )}
    </div>
  );
};
