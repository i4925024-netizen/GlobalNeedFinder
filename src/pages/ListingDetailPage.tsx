import React, { useState, useEffect } from 'react';
import { Listing } from '../types';
import { getListingById, deleteListing, updateListing } from '../services/listingsService';
import { isListingSaved, saveListing, unsaveListing } from '../services/savedService';
import { getOrCreateConversation } from '../services/conversationsService';
import { useAuth } from '../contexts/AuthContext';
import { CATEGORY_MAP } from '../constants/categories';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { ReportModal } from '../components/common/ReportModal';
import {
  MapPin,
  Tag,
  Bookmark,
  MessageSquare,
  ArrowLeft,
  Edit,
  Trash2,
  Flag,
  User,
  CheckCircle,
} from 'lucide-react';

interface ListingDetailPageProps {
  id: string;
  navigate: (path: string) => void;
}

export const ListingDetailPage: React.FC<ListingDetailPageProps> = ({ id, navigate }) => {
  const { currentUser, userProfile, isAdmin } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    async function loadListing() {
      try {
        setLoading(true);
        const data = await getListingById(id);
        if (!data) {
          setError('Listing not found or has been removed.');
          return;
        }
        setListing(data);
      } catch (err: any) {
        setError(err?.message || 'Error loading listing.');
      } finally {
        setLoading(false);
      }
    }
    loadListing();
  }, [id]);

  useEffect(() => {
    if (currentUser && listing) {
      isListingSaved(currentUser.uid, listing.id).then(setSaved);
    }
  }, [currentUser, listing]);

  const isOwner = currentUser && listing && currentUser.uid === listing.providerId;

  const handleToggleSave = async () => {
    if (!currentUser || !listing) {
      navigate('/login');
      return;
    }
    try {
      if (saved) {
        await unsaveListing(currentUser.uid, listing.id);
        setSaved(false);
      } else {
        await saveListing(currentUser.uid, listing);
        setSaved(true);
      }
    } catch (err) {
      console.error('Error saving listing:', err);
    }
  };

  const handleStartChat = async () => {
    if (!currentUser || !listing) {
      navigate('/login');
      return;
    }
    try {
      const convId = await getOrCreateConversation(
        currentUser.uid,
        listing.providerId,
        {
          [currentUser.uid]: userProfile?.displayName || 'Customer',
          [listing.providerId]: listing.providerName,
        }
      );
      navigate(`/messages?id=${convId}`);
    } catch (err) {
      console.error('Error starting conversation:', err);
    }
  };

  const handleDeleteListing = async () => {
    if (!listing) return;
    try {
      setProcessing(true);
      await deleteListing(listing.id);
      navigate('/provider/listings');
    } catch (err) {
      console.error('Error deleting listing:', err);
    } finally {
      setProcessing(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleToggleActive = async () => {
    if (!listing) return;
    try {
      setProcessing(true);
      const newActive = !listing.active;
      await updateListing(listing.id, { active: newActive });
      setListing((prev) => (prev ? { ...prev, active: newActive } : null));
    } catch (err) {
      console.error('Error updating listing status:', err);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="h-64 bg-white rounded-2xl border border-slate-200 animate-pulse p-8" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-lg font-bold text-slate-900">{error || 'Listing not available'}</h2>
        <button
          onClick={() => navigate('/providers')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
        >
          Browse Providers
        </button>
      </div>
    );
  }

  const cat = CATEGORY_MAP.get(listing.category);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate(-1 as any)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
              <Tag className="w-3.5 h-3.5" />
              {cat?.name || listing.category}
            </span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                listing.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {listing.active ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSave}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                saved
                  ? 'bg-blue-50 border-blue-200 text-blue-600'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-blue-600' : ''}`} />
              <span>{saved ? 'Saved' : 'Save'}</span>
            </button>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              title="Report listing"
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {listing.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <div
              onClick={() => navigate(`/provider/${listing.providerId}`)}
              className="flex items-center gap-1 text-blue-600 font-semibold cursor-pointer hover:underline"
            >
              <User className="w-4 h-4 text-slate-400" />
              <span>Offered by {listing.providerName}</span>
            </div>

            <div className="flex items-center gap-1 text-slate-700">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>
                {listing.city ? `${listing.city}, ` : ''}
                {listing.country}
              </span>
            </div>

            {listing.condition && (
              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                Condition: {listing.condition}
              </span>
            )}

            {listing.availability && (
              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                Availability: {listing.availability}
              </span>
            )}
          </div>
        </div>

        {/* Price & Action banner */}
        <div className="mt-6 p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Price</span>
            <span className="text-2xl sm:text-3xl font-black">
              {listing.currency} {listing.price.toLocaleString()}
            </span>
          </div>

          {!isOwner && (
            <button
              onClick={handleStartChat}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 active:scale-98 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Contact Provider
            </button>
          )}
        </div>

        {/* Description */}
        <div className="mt-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Offering Description
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100">
            {listing.description}
          </p>
        </div>

        {/* Owner Controls */}
        {(isOwner || isAdmin) && (
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleActive}
                disabled={processing}
                className="px-3.5 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition"
              >
                {listing.active ? 'Deactivate Listing' : 'Activate Listing'}
              </button>
            </div>

            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Listing
            </button>
          </div>
        )}
      </div>

      {isReportModalOpen && (
        <ReportModal
          isOpen={isReportModalOpen}
          targetType="listing"
          targetId={listing.id}
          targetTitle={listing.title}
          onClose={() => setIsReportModalOpen(false)}
        />
      )}

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Listing?"
        message="Are you sure you want to permanently delete this listing?"
        confirmLabel="Delete"
        isDestructive={true}
        isLoading={processing}
        onConfirm={handleDeleteListing}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};
