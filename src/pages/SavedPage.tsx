import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getUserSavedNeeds,
  getUserSavedListings,
  unsaveNeed,
  unsaveListing,
} from '../services/savedService';
import { SavedNeed, SavedListing } from '../types';
import { Bookmark, Layers, Tag, Trash2, ArrowRight, MapPin } from 'lucide-react';
import { CATEGORY_MAP } from '../constants/categories';

interface SavedPageProps {
  navigate: (path: string) => void;
}

export const SavedPage: React.FC<SavedPageProps> = ({ navigate }) => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'needs' | 'listings'>('needs');
  const [savedNeeds, setSavedNeeds] = useState<SavedNeed[]>([]);
  const [savedListings, setSavedListings] = useState<SavedListing[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSaved = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const [nList, lList] = await Promise.all([
        getUserSavedNeeds(currentUser.uid),
        getUserSavedListings(currentUser.uid),
      ]);
      setSavedNeeds(nList);
      setSavedListings(lList);
    } catch (err) {
      console.error('Error fetching saved items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSaved();
  }, [currentUser]);

  const handleUnsaveNeed = async (needId: string) => {
    if (!currentUser) return;
    try {
      await unsaveNeed(currentUser.uid, needId);
      setSavedNeeds((prev) => prev.filter((n) => n.needId !== needId));
    } catch (err) {
      console.error('Error unsaving need:', err);
    }
  };

  const handleUnsaveListing = async (listingId: string) => {
    if (!currentUser) return;
    try {
      await unsaveListing(currentUser.uid, listingId);
      setSavedListings((prev) => prev.filter((l) => l.listingId !== listingId));
    } catch (err) {
      console.error('Error unsaving listing:', err);
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h2 className="text-lg font-bold">Please sign in to view saved items</h2>
        <button
          onClick={() => navigate('/login')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Saved Items & Favorites
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Bookmark requirements or provider offerings for quick access
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
            Saved Needs ({savedNeeds.length})
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
            Saved Listings ({savedListings.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-white rounded-xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : activeTab === 'needs' ? (
        savedNeeds.length > 0 ? (
          <div className="space-y-3">
            {savedNeeds.map((item) => {
              const cat = CATEGORY_MAP.get(item.category);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between gap-4 hover:border-slate-300 transition"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                      {cat?.name || item.category}
                    </span>
                    <h3
                      onClick={() => navigate(`/need/${item.needId}`)}
                      className="text-sm font-bold text-slate-900 mt-1 cursor-pointer hover:text-blue-600 transition truncate"
                    >
                      {item.needTitle}
                    </h3>
                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {item.city ? `${item.city}, ` : ''}
                        {item.country}
                      </span>
                      {item.budgetMax && (
                        <span>
                          Budget: {item.currency} {item.budgetMax.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/need/${item.needId}`)}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      View <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleUnsaveNeed(item.needId)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
            <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">No saved requirements</h4>
            <p className="text-xs text-slate-500 mt-1">
              Click the bookmark icon on any customer requirement to save it here.
            </p>
          </div>
        )
      ) : savedListings.length > 0 ? (
        <div className="space-y-3">
          {savedListings.map((item) => {
            const cat = CATEGORY_MAP.get(item.category);
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between gap-4 hover:border-slate-300 transition"
              >
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                    {cat?.name || item.category}
                  </span>
                  <h3
                    onClick={() => navigate(`/listing/${item.listingId}`)}
                    className="text-sm font-bold text-slate-900 mt-1 cursor-pointer hover:text-blue-600 transition truncate"
                  >
                    {item.listingTitle}
                  </h3>
                  <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {item.city ? `${item.city}, ` : ''}
                      {item.country}
                    </span>
                    <span className="font-bold text-slate-900">
                      {item.currency} {item.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/listing/${item.listingId}`)}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    View <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleUnsaveListing(item.listingId)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                    title="Remove bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-800">No saved provider listings</h4>
          <p className="text-xs text-slate-500 mt-1">
            Bookmark items from providers to review later.
          </p>
        </div>
      )}
    </div>
  );
};
