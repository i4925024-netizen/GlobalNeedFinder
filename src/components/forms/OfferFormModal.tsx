import React, { useState } from 'react';
import { Need } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { createOffer } from '../../services/offersService';
import { X, Send, AlertCircle, DollarSign, Clock } from 'lucide-react';
import { CURRENCIES } from '../../constants/countries';

interface OfferFormModalProps {
  isOpen: boolean;
  need: Need;
  onClose: () => void;
  onSuccess: () => void;
}

export const OfferFormModal: React.FC<OfferFormModalProps> = ({
  isOpen,
  need,
  onClose,
  onSuccess,
}) => {
  const { currentUser, userProfile, providerProfile } = useAuth();

  const [proposedPrice, setProposedPrice] = useState<string>(
    need.budgetMax ? String(need.budgetMax) : ''
  );
  const [currency, setCurrency] = useState(need.currency || 'USD');
  const [estimatedDelivery, setEstimatedDelivery] = useState('3-5 business days');
  const [availability, setAvailability] = useState('Immediate');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('You must be signed in to submit an offer.');
      return;
    }

    const priceNum = parseFloat(proposedPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Please enter a valid positive offer price.');
      return;
    }

    if (message.trim().length < 10) {
      setError('Your offer message must be at least 10 characters detailing what you provide.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const providerName =
        providerProfile?.businessName ||
        userProfile?.displayName ||
        currentUser.email?.split('@')[0] ||
        'Provider';

      await createOffer({
        needId: need.id,
        needTitle: need.title,
        customerId: need.ownerId,
        providerId: currentUser.uid,
        providerName,
        message: message.trim(),
        proposedPrice: priceNum,
        currency,
        estimatedDelivery: estimatedDelivery.trim() || undefined,
        availability: availability.trim() || undefined,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to submit offer. Please check connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Submit Offer to Customer</h3>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
              For: <span className="font-semibold text-slate-700">{need.title}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Price & Currency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Price Quote *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={proposedPrice}
                  onChange={(e) => setProposedPrice(e.target.value)}
                  placeholder="e.g. 500"
                  required
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 pl-3 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Currency *</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              >
                {CURRENCIES.map((cur) => (
                  <option key={cur} value={cur}>
                    {cur}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Delivery & Availability */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estimated Delivery / Timeframe
              </label>
              <input
                type="text"
                value={estimatedDelivery}
                onChange={(e) => setEstimatedDelivery(e.target.value)}
                placeholder="e.g. 2 days, 1 week, immediate"
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Availability
              </label>
              <input
                type="text"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                placeholder="e.g. In Stock, Ready to start"
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>

          {/* Proposal Message */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Proposal Details * (Min 10 characters)
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe exactly what product, service, condition, specifications, or warranty you are offering to satisfy this requirement..."
              required
              className="w-full text-xs border border-slate-300 rounded-lg p-2.5 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Clear, transparent proposals receive faster responses and acceptance.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              Submit Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
