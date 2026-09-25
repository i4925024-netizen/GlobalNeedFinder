import React, { useState, useEffect } from 'react';
import { Need, Offer } from '../types';
import { getNeedById, deleteNeed, updateNeedStatus } from '../services/needsService';
import { getOffersByNeedId, acceptOffer, rejectOffer } from '../services/offersService';
import { isNeedSaved, saveNeed, unsaveNeed } from '../services/savedService';
import { getOrCreateConversation } from '../services/conversationsService';
import { useAuth } from '../contexts/AuthContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { ReportModal } from '../components/common/ReportModal';
import { OfferFormModal } from '../components/forms/OfferFormModal';
import { OfferCard } from '../components/cards/OfferCard';
import { CATEGORY_MAP } from '../constants/categories';
import {
  MapPin,
  Clock,
  DollarSign,
  Layers,
  Send,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Flag,
  Bookmark,
  MessageSquare,
  ArrowLeft,
  User,
  ShieldCheck,
  Share2,
} from 'lucide-react';

interface NeedDetailPageProps {
  id: string;
  navigate: (path: string) => void;
}

export const NeedDetailPage: React.FC<NeedDetailPageProps> = ({ id, navigate }) => {
  const { currentUser, userProfile, isAdmin } = useAuth();

  const [need, setNeed] = useState<Need | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [saved, setSaved] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [actionProcessing, setActionProcessing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getNeedById(id);
      if (!data) {
        setError('This requirement was not found or has been removed.');
        return;
      }
      setNeed(data);

      // Load offers if owner or admin
      if (currentUser && (currentUser.uid === data.ownerId || isAdmin)) {
        const offList = await getOffersByNeedId(id);
        setOffers(offList);
      }
    } catch (err: any) {
      setError(err?.message || 'Error loading requirement details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id, currentUser]);

  useEffect(() => {
    if (currentUser && need) {
      isNeedSaved(currentUser.uid, need.id).then(setSaved);
    }
  }, [currentUser, need]);

  const isOwner = currentUser && need && currentUser.uid === need.ownerId;
  const canRespond = currentUser && need && !isOwner && need.status === 'OPEN';

  const handleToggleSave = async () => {
    if (!currentUser || !need) {
      navigate('/login');
      return;
    }
    try {
      if (saved) {
        await unsaveNeed(currentUser.uid, need.id);
        setSaved(false);
      } else {
        await saveNeed(currentUser.uid, need);
        setSaved(true);
      }
    } catch (err) {
      console.error('Error saving need:', err);
    }
  };

  const handleDeleteNeed = async () => {
    if (!need) return;
    try {
      setActionProcessing(true);
      await deleteNeed(need.id);
      navigate('/my-needs');
    } catch (err) {
      console.error('Error deleting need:', err);
    } finally {
      setActionProcessing(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleStatusChange = async (newStatus: any) => {
    if (!need) return;
    try {
      setActionProcessing(true);
      await updateNeedStatus(need.id, newStatus);
      setNeed((prev) => (prev ? { ...prev, status: newStatus } : null));
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setActionProcessing(false);
    }
  };

  const handleAcceptOffer = async (offer: Offer) => {
    try {
      setActionProcessing(true);
      await acceptOffer(offer);
      await loadData();
    } catch (err) {
      console.error('Error accepting offer:', err);
    } finally {
      setActionProcessing(false);
    }
  };

  const handleRejectOffer = async (offer: Offer) => {
    try {
      setActionProcessing(true);
      await rejectOffer(offer);
      await loadData();
    } catch (err) {
      console.error('Error rejecting offer:', err);
    } finally {
      setActionProcessing(false);
    }
  };

  const handleStartChatWithCustomer = async () => {
    if (!currentUser || !need) {
      navigate('/login');
      return;
    }
    try {
      const convId = await getOrCreateConversation(
        currentUser.uid,
        need.ownerId,
        {
          [currentUser.uid]: userProfile?.displayName || 'User',
          [need.ownerId]: need.ownerName,
        },
        need.id,
        need.title
      );
      navigate(`/messages?id=${convId}`);
    } catch (err) {
      console.error('Error starting conversation:', err);
    }
  };

  const handleStartChatWithProvider = async (offer: Offer) => {
    if (!currentUser || !need) return;
    try {
      const convId = await getOrCreateConversation(
        currentUser.uid,
        offer.providerId,
        {
          [currentUser.uid]: userProfile?.displayName || 'Customer',
          [offer.providerId]: offer.providerName,
        },
        need.id,
        need.title,
        offer.id
      );
      navigate(`/messages?id=${convId}`);
    } catch (err) {
      console.error('Error starting conversation:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="h-64 bg-white rounded-2xl border border-slate-200 animate-pulse p-8" />
      </div>
    );
  }

  if (error || !need) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-lg font-bold text-slate-900">Requirement Not Available</h2>
        <p className="text-xs text-slate-500 mt-2">{error || 'This item could not be found.'}</p>
        <button
          onClick={() => navigate('/needs')}
          className="mt-6 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Browse All Requirements
        </button>
      </div>
    );
  }

  const cat = CATEGORY_MAP.get(need.category);
  const formattedDate = need.createdAt?.seconds
    ? new Date(need.createdAt.seconds * 1000).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <button
        onClick={() => navigate('/needs')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Requirements
      </button>

      {/* Main Requirement Detail Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8">
        {/* Top Badges & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
              <Layers className="w-3.5 h-3.5" />
              {cat?.name || need.category}
            </span>
            <StatusBadge status={need.status} />
            {need.urgency && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wider">
                Urgency: {need.urgency}
              </span>
            )}
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
              title="Report content"
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title & Metadata */}
        <div className="mt-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {need.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1 text-slate-700 font-medium">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>
                {need.city ? `${need.city}, ` : ''}
                {need.country}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Posted {formattedDate}</span>
            </div>

            <div className="flex items-center gap-1 text-slate-700">
              <User className="w-4 h-4 text-slate-400" />
              <span>Posted by {need.ownerName}</span>
            </div>

            {need.expiryDate && (
              <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">
                Expires on {need.expiryDate}
              </span>
            )}
          </div>
        </div>

        {/* Financial Budget Highlight */}
        <div className="mt-6 p-4 rounded-xl bg-blue-50/70 border border-blue-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs text-blue-800 font-semibold uppercase tracking-wider block">
              Customer Target Budget
            </span>
            <span className="text-xl sm:text-2xl font-black text-slate-900">
              {need.budgetMax ? (
                <>
                  {need.currency} {need.budgetMin ? `${need.budgetMin.toLocaleString()} - ` : ''}
                  {need.budgetMax.toLocaleString()}
                </>
              ) : (
                'Budget Open / Flexible to Quotes'
              )}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {canRespond && (
              <button
                onClick={() => setIsOfferModalOpen(true)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-600/20 transition flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Offer / Quote
              </button>
            )}

            {!currentUser && need.status === 'OPEN' && (
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition"
              >
                Sign In to Respond
              </button>
            )}

            {currentUser && !isOwner && (
              <button
                onClick={handleStartChatWithCustomer}
                className="px-4 py-2.5 bg-white border border-slate-300 hover:border-blue-400 text-slate-700 hover:text-blue-600 rounded-xl font-semibold text-xs transition flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Message Customer
              </button>
            )}
          </div>
        </div>

        {/* Detailed Description */}
        <div className="mt-8">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
            Requirement Specifications
          </h3>
          <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            {need.description}
          </p>
        </div>

        {/* Additional Specifications */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {need.preferredCondition && (
            <div className="p-3 rounded-lg border border-slate-200">
              <span className="text-slate-400 block mb-0.5">Condition Preference</span>
              <span className="font-semibold text-slate-800">{need.preferredCondition}</span>
            </div>
          )}
          {need.contactPreference && (
            <div className="p-3 rounded-lg border border-slate-200">
              <span className="text-slate-400 block mb-0.5">Preferred Contact Mode</span>
              <span className="font-semibold text-slate-800">{need.contactPreference}</span>
            </div>
          )}
        </div>

        {/* Owner Controls */}
        {isOwner && (
          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Owner Actions:</span>
              {need.status === 'OPEN' && (
                <>
                  <button
                    onClick={() => navigate(`/edit-need/${need.id}`)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleStatusChange('CLOSED')}
                    disabled={actionProcessing}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 transition disabled:opacity-50"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Close Need
                  </button>
                </>
              )}

              {need.status !== 'FULFILLED' && (
                <button
                  onClick={() => handleStatusChange('FULFILLED')}
                  disabled={actionProcessing}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition disabled:opacity-50"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Mark Fulfilled
                </button>
              )}

              {need.status === 'CLOSED' && (
                <button
                  onClick={() => handleStatusChange('OPEN')}
                  disabled={actionProcessing}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition disabled:opacity-50"
                >
                  Re-open Need
                </button>
              )}
            </div>

            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg text-rose-600 hover:bg-rose-50 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Requirement
            </button>
          </div>
        )}
      </div>

      {/* Received Offers Section (Visible to Owner & Admin) */}
      {(isOwner || isAdmin) && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Received Provider Offers ({offers.length})
            </h2>
            <span className="text-xs text-slate-500">
              Only visible to you as the requirement owner
            </span>
          </div>

          {offers.length > 0 ? (
            <div className="space-y-4">
              {offers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  isCustomer={true}
                  isProvider={false}
                  onAccept={handleAcceptOffer}
                  onReject={handleRejectOffer}
                  onOpenChat={() => handleStartChatWithProvider(offer)}
                  processing={actionProcessing}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No offers received yet</p>
              <p className="text-xs text-slate-500 mt-1">
                Verified providers can browse and submit quotes to your requirement.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Offer Form Modal */}
      {isOfferModalOpen && (
        <OfferFormModal
          isOpen={isOfferModalOpen}
          need={need}
          onClose={() => setIsOfferModalOpen(false)}
          onSuccess={() => {
            loadData();
          }}
        />
      )}

      {/* Report Modal */}
      {isReportModalOpen && (
        <ReportModal
          isOpen={isReportModalOpen}
          targetType="need"
          targetId={need.id}
          targetTitle={need.title}
          onClose={() => setIsReportModalOpen(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Requirement?"
        message="Are you sure you want to permanently delete this requirement? Deleted requirements cannot be restored."
        confirmLabel="Delete"
        isDestructive={true}
        isLoading={actionProcessing}
        onConfirm={handleDeleteNeed}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};
