import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getProviderListings,
  deleteListing,
  updateListing,
} from '../services/listingsService';
import { Listing } from '../types';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { CATEGORY_MAP } from '../constants/categories';
import { Tag, PlusCircle, Trash2, Eye, MapPin, ArrowLeft } from 'lucide-react';

interface ProviderListingsPageProps {
  navigate: (path: string) => void;
}

export const ProviderListingsPage: React.FC<ProviderListingsPageProps> = ({ navigate }) => {
  const { currentUser } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Listing | null>(null);
  const [processing, setProcessing] = useState(false);

  const fetchListings = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await getProviderListings(currentUser.uid);
      setListings(data);
    } catch (err) {
      console.error('Error fetching provider listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [currentUser]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setProcessing(true);
      await deleteListing(deleteTarget.id);
      setListings((prev) => prev.filter((l) => l.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error('Error deleting listing:', err);
    } finally {
      setProcessing(false);
    }
  };

  const handleToggleActive = async (listing: Listing) => {
    try {
      setProcessing(true);
      const newActive = !listing.active;
      await updateListing(listing.id, { active: newActive });
      setListings((prev) =>
        prev.map((l) => (l.id === listing.id ? { ...l, active: newActive } : l))
      );
    } catch (err) {
      console.error('Error toggling active state:', err);
    } finally {
      setProcessing(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h2 className="text-lg font-bold">Please sign in as a Provider</h2>
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate('/provider/dashboard')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Catalog Listings
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Products, services, properties, and vehicles you offer to customers
          </p>
        </div>

        <button
          onClick={() => navigate('/provider/listings/new')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Listing
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-white rounded-xl border border-slate-200 animate-pulse p-6" />
          ))}
        </div>
      ) : listings.length > 0 ? (
        <div className="space-y-4">
          {listings.map((l) => {
            const cat = CATEGORY_MAP.get(l.category);
            return (
              <div
                key={l.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
                      {cat?.name || l.category}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        l.active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {l.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <h3
                    onClick={() => navigate(`/listing/${l.id}`)}
                    className="text-base font-bold text-slate-900 hover:text-blue-600 transition cursor-pointer truncate"
                  >
                    {l.title}
                  </h3>

                  <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {l.city ? `${l.city}, ` : ''}
                      {l.country}
                    </span>
                    <span>•</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {l.currency} {l.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <button
                    onClick={() => handleToggleActive(l)}
                    disabled={processing}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                      l.active
                        ? 'border-slate-300 text-slate-700 hover:bg-slate-50'
                        : 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {l.active ? 'Deactivate' : 'Activate'}
                  </button>

                  <button
                    onClick={() => navigate(`/listing/${l.id}`)}
                    className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                    title="View Listing"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeleteTarget(l)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete Listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 max-w-md mx-auto">
          <Tag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No listings yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            Add your offerings so buyers can discover what you have available.
          </p>
          <button
            onClick={() => navigate('/provider/listings/new')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-blue-700"
          >
            Create Your First Listing
          </button>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Listing?"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        confirmLabel="Delete"
        isDestructive={true}
        isLoading={processing}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
