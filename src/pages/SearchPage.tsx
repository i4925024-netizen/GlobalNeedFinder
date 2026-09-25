import React, { useState, useEffect } from 'react';
import { Need, Listing, ProviderProfile } from '../types';
import { getNeeds } from '../services/needsService';
import { getListings } from '../services/listingsService';
import { getProviders } from '../services/providersService';
import { NeedCard } from '../components/cards/NeedCard';
import { ListingCard } from '../components/cards/ListingCard';
import { ProviderCard } from '../components/cards/ProviderCard';
import { CountrySelector } from '../components/common/CountrySelector';
import { CATEGORIES } from '../constants/categories';
import { Search, Filter, Layers, Tag, Users, PlusCircle, RefreshCw, X } from 'lucide-react';

interface SearchPageProps {
  navigate: (path: string) => void;
  urlParams: URLSearchParams;
}

export const SearchPage: React.FC<SearchPageProps> = ({ navigate, urlParams }) => {
  const [searchQuery, setSearchQuery] = useState(urlParams.get('q') || '');
  const [category, setCategory] = useState(urlParams.get('category') || 'all');
  const [country, setCountry] = useState(urlParams.get('country') || 'all');
  const [city, setCity] = useState(urlParams.get('city') || '');
  const getInitialTab = (): 'needs' | 'listings' | 'providers' => {
    const t = urlParams.get('type') || urlParams.get('tab');
    if (t === 'listings' || t === 'products') return 'listings';
    if (t === 'providers') return 'providers';
    return 'needs';
  };

  const [activeTab, setActiveTab] = useState<'needs' | 'listings' | 'providers'>(getInitialTab());

  const [needs, setNeeds] = useState<Need[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [providers, setProviders] = useState<ProviderProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync state with urlParams when navigation occurs
  useEffect(() => {
    setSearchQuery(urlParams.get('q') || '');
    setCategory(urlParams.get('category') || 'all');
    setCountry(urlParams.get('country') || 'all');
    setCity(urlParams.get('city') || '');
    const t = urlParams.get('type') || urlParams.get('tab');
    if (t === 'listings' || t === 'products') {
      setActiveTab('listings');
    } else if (t === 'providers') {
      setActiveTab('providers');
    } else if (t === 'needs') {
      setActiveTab('needs');
    }
  }, [urlParams]);

  const executeSearch = async () => {
    setLoading(true);
    try {
      const [nData, lData, pData] = await Promise.all([
        getNeeds({
          searchQuery,
          category,
          country,
          city,
          status: 'OPEN',
        }),
        getListings({
          searchQuery,
          category,
          country,
          city,
          activeOnly: true,
        }),
        getProviders({
          searchQuery,
          category,
          country,
          city,
        }),
      ]);
      setNeeds(nData);
      setListings(lData);
      setProviders(pData);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeSearch();
  }, [searchQuery, category, country, city]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (category !== 'all') params.set('category', category);
    if (country !== 'all') params.set('country', country);
    if (city.trim()) params.set('city', city.trim());
    params.set('type', activeTab);
    navigate(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCategory('all');
    setCountry('all');
    setCity('');
    navigate('/search');
  };

  const hasActiveFilters =
    Boolean(searchQuery.trim()) || category !== 'all' || country !== 'all' || Boolean(city.trim());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Search Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs mb-8">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search requirements, products, skills, or providers..."
                className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xs transition flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
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

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Filter by city..."
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-800"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-500">Filtered results</span>
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Reset all filters
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 mb-6 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('needs')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
              activeTab === 'needs'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Customer Needs ({needs.length})
          </button>

          <button
            onClick={() => setActiveTab('listings')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
              activeTab === 'listings'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            Provider Listings ({listings.length})
          </button>

          <button
            onClick={() => setActiveTab('providers')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
              activeTab === 'providers'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Providers ({providers.length})
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => navigate('/provider/listings/new')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
            + List Product / Service
          </button>
          <button
            onClick={() => navigate('/post-need')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded-lg transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            + Post Requirement
          </button>
        </div>
      </div>

      {/* Results Rendering */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-60 rounded-xl bg-white border border-slate-200 animate-pulse p-6">
              <div className="h-4 bg-slate-100 rounded w-1/4 mb-4" />
              <div className="h-6 bg-slate-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-100 rounded w-full mb-1" />
              <div className="h-3 bg-slate-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : activeTab === 'needs' ? (
        needs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {needs.map((need) => (
              <NeedCard key={need.id} need={need} onNavigate={navigate} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 max-w-lg mx-auto">
            <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No matching needs found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search terms, changing the category, or expanding the country filter.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Clear Filters
              </button>
              <button
                onClick={() => navigate('/post-need')}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition"
              >
                Post This Requirement
              </button>
            </div>
          </div>
        )
      ) : activeTab === 'listings' ? (
        listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} onNavigate={navigate} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 max-w-lg mx-auto">
            <Tag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No provider listings found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No sellers have listed items matching these filters. Try another keyword or location.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        )
      ) : providers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((prov) => (
            <ProviderCard key={prov.id} provider={prov} onNavigate={navigate} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 max-w-lg mx-auto">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No providers found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try searching for broader service categories or different countries.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
