import React, { useState, useEffect } from 'react';
import { CATEGORY_MAP } from '../constants/categories';
import { Need, Listing } from '../types';
import { getNeeds } from '../services/needsService';
import { getListings } from '../services/listingsService';
import { NeedCard } from '../components/cards/NeedCard';
import { ListingCard } from '../components/cards/ListingCard';
import { ArrowLeft, PlusCircle, Layers, Tag } from 'lucide-react';

interface CategoryPageProps {
  slug: string;
  navigate: (path: string) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ slug, navigate }) => {
  const category = CATEGORY_MAP.get(slug);
  const [activeTab, setActiveTab] = useState<'needs' | 'listings'>('needs');
  const [needs, setNeeds] = useState<Need[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [nData, lData] = await Promise.all([
          getNeeds({ category: slug, status: 'OPEN' }),
          getListings({ category: slug, activeOnly: true }),
        ]);
        setNeeds(nData);
        setListings(lData);
      } catch (err) {
        console.error('Error loading category data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  if (!category) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h2 className="text-lg font-bold">Category not found</h2>
        <button
          onClick={() => navigate('/categories')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs"
        >
          View All Categories
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate('/categories')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        All Categories
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md">
            Marketplace Category
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            {category.name}
          </h1>
          <p className="mt-1 text-sm text-slate-500 max-w-xl">{category.description}</p>
        </div>

        <button
          onClick={() => navigate(`/post-need?category=${slug}`)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Post in {category.name}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 mb-6 pb-2">
        <button
          onClick={() => setActiveTab('needs')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition ${
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
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition ${
            activeTab === 'listings'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          Provider Listings ({listings.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-60 rounded-xl bg-white border border-slate-200 animate-pulse p-6" />
          ))}
        </div>
      ) : activeTab === 'needs' ? (
        needs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {needs.map((n) => (
              <NeedCard key={n.id} need={n} onNavigate={navigate} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-8">
            <p className="text-sm font-semibold text-slate-700">No active requirements in {category.name}</p>
            <button
              onClick={() => navigate('/post-need')}
              className="mt-3 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg"
            >
              Post a Need
            </button>
          </div>
        )
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} onNavigate={navigate} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-8">
          <p className="text-sm font-semibold text-slate-700">No provider listings currently in {category.name}</p>
        </div>
      )}
    </div>
  );
};
