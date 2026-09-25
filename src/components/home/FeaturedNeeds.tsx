import React, { useState, useEffect } from 'react';
import { Need, Listing } from '../../types';
import { getNeeds } from '../../services/needsService';
import { getListings } from '../../services/listingsService';
import { NeedCard } from '../cards/NeedCard';
import { ListingCard } from '../cards/ListingCard';
import { ArrowRight, Layers, Tag } from 'lucide-react';

interface FeaturedNeedsProps {
  navigate: (path: string) => void;
}

export const FeaturedNeeds: React.FC<FeaturedNeedsProps> = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState<'needs' | 'listings'>('needs');
  const [needs, setNeeds] = useState<Need[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [needsData, listingsData] = await Promise.all([
          getNeeds({ limitCount: 6, status: 'OPEN' }),
          getListings({ limitCount: 6, activeOnly: true }),
        ]);
        if (isMounted) {
          setNeeds(needsData);
          setListings(listingsData);
        }
      } catch (err) {
        console.error('Failed to load featured items:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Latest Marketplace Activity
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Real requirements posted by buyers & verified items offered by providers
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('needs')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'needs'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Customer Needs ({needs.length})
            </button>
            <button
              onClick={() => setActiveTab('listings')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'listings'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              Provider Listings ({listings.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-64 rounded-xl bg-white border border-slate-200 animate-pulse p-6"
              >
                <div className="h-4 bg-slate-100 rounded w-1/3 mb-4" />
                <div className="h-6 bg-slate-100 rounded w-4/5 mb-3" />
                <div className="h-3 bg-slate-100 rounded w-full mb-2" />
                <div className="h-3 bg-slate-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : activeTab === 'needs' ? (
          <div>
            {needs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {needs.map((need) => (
                  <NeedCard key={need.id} need={need} onNavigate={navigate} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8">
                <p className="text-sm text-slate-500">No active customer needs found.</p>
                <button
                  onClick={() => navigate('/post-need')}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold"
                >
                  Be the first to post a need
                </button>
              </div>
            )}

            <div className="mt-8 text-center">
              <button
                onClick={() => navigate('/needs')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:text-blue-600 hover:border-blue-400 text-xs font-bold shadow-xs transition"
              >
                Browse All Customer Needs <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div>
            {listings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} onNavigate={navigate} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8">
                <p className="text-sm text-slate-500">No active provider listings yet.</p>
              </div>
            )}

            <div className="mt-8 text-center">
              <button
                onClick={() => navigate('/providers')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:text-blue-600 hover:border-blue-400 text-xs font-bold shadow-xs transition"
              >
                Browse All Provider Listings <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
