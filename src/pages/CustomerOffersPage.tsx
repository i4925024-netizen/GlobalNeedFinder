import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getOffersByCustomerId, acceptOffer, rejectOffer } from '../services/offersService';
import { getOrCreateConversation } from '../services/conversationsService';
import { Offer } from '../types';
import { OfferCard } from '../components/cards/OfferCard';
import { Briefcase, Filter, ArrowLeft } from 'lucide-react';

interface CustomerOffersPageProps {
  navigate: (path: string) => void;
}

export const CustomerOffersPage: React.FC<CustomerOffersPageProps> = ({ navigate }) => {
  const { currentUser, userProfile } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [processing, setProcessing] = useState(false);

  const fetchOffers = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await getOffersByCustomerId(currentUser.uid);
      setOffers(data);
    } catch (err) {
      console.error('Error fetching received offers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [currentUser]);

  const handleAccept = async (offer: Offer) => {
    try {
      setProcessing(true);
      await acceptOffer(offer);
      await fetchOffers();
    } catch (err) {
      console.error('Error accepting offer:', err);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (offer: Offer) => {
    try {
      setProcessing(true);
      await rejectOffer(offer);
      await fetchOffers();
    } catch (err) {
      console.error('Error rejecting offer:', err);
    } finally {
      setProcessing(false);
    }
  };

  const handleStartChat = async (offer: Offer) => {
    if (!currentUser) return;
    try {
      const convId = await getOrCreateConversation(
        currentUser.uid,
        offer.providerId,
        {
          [currentUser.uid]: userProfile?.displayName || 'Customer',
          [offer.providerId]: offer.providerName,
        },
        offer.needId,
        offer.needTitle,
        offer.id
      );
      navigate(`/messages?id=${convId}`);
    } catch (err) {
      console.error('Error starting conversation:', err);
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h2 className="text-lg font-bold">Please sign in</h2>
        <button
          onClick={() => navigate('/login')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs"
        >
          Sign In
        </button>
      </div>
    );
  }

  const filtered = offers.filter((o) => {
    if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Received Offers
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review quotes and proposals submitted by verified providers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-xl p-2.5 bg-white text-slate-800"
          >
            <option value="ALL">All Offers ({offers.length})</option>
            <option value="PENDING">Pending Review</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Declined</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-white rounded-xl border border-slate-200 animate-pulse p-6" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              isCustomer={true}
              isProvider={false}
              onAccept={handleAccept}
              onReject={handleReject}
              onOpenChat={() => handleStartChat(offer)}
              onViewNeed={(needId) => navigate(`/need/${needId}`)}
              processing={processing}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 max-w-md mx-auto">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No offers found</h3>
          <p className="text-xs text-slate-500 mt-1">
            {offers.length === 0
              ? 'You have not received any provider offers yet.'
              : 'No offers match the selected status filter.'}
          </p>
        </div>
      )}
    </div>
  );
};
