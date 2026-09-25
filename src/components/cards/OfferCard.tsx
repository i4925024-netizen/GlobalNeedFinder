import React from 'react';
import { Offer } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Clock, MessageSquare, Check, X, ShieldAlert, ArrowRight } from 'lucide-react';

interface OfferCardProps {
  offer: Offer;
  isCustomer: boolean;
  isProvider: boolean;
  onAccept?: (offer: Offer) => void;
  onReject?: (offer: Offer) => void;
  onWithdraw?: (offer: Offer) => void;
  onOpenChat?: (offer: Offer) => void;
  onViewNeed?: (needId: string) => void;
  processing?: boolean;
}

export const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  isCustomer,
  isProvider,
  onAccept,
  onReject,
  onWithdraw,
  onOpenChat,
  onViewNeed,
  processing = false,
}) => {
  const formattedDate = offer.createdAt?.seconds
    ? new Date(offer.createdAt.seconds * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs transition hover:border-slate-300">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-slate-900">
              {isCustomer ? offer.providerName : offer.needTitle}
            </h4>
            <StatusBadge status={offer.status} size="sm" />
          </div>

          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <span>Submitted {formattedDate}</span>
            {isCustomer && offer.needTitle && (
              <span>• For need: <strong className="text-slate-700">{offer.needTitle}</strong></span>
            )}
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-lg font-black text-slate-900">
            {offer.currency} {offer.proposedPrice.toLocaleString()}
          </span>
          {offer.estimatedDelivery && (
            <p className="text-[11px] text-slate-500 flex items-center justify-end gap-1 mt-0.5">
              <Clock className="w-3 h-3" />
              <span>{offer.estimatedDelivery}</span>
            </p>
          )}
        </div>
      </div>

      {/* Message content */}
      <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs text-slate-700 leading-relaxed whitespace-pre-line border border-slate-100">
        {offer.message}
      </div>

      {offer.availability && (
        <div className="mt-2 text-[11px] text-slate-500">
          <strong>Availability:</strong> {offer.availability}
        </div>
      )}

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {onOpenChat && (
            <button
              type="button"
              onClick={() => onOpenChat(offer)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Chat
            </button>
          )}

          {onViewNeed && (
            <button
              type="button"
              onClick={() => onViewNeed(offer.needId)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              View Requirement <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Customer Actions for PENDING */}
        {isCustomer && offer.status === 'PENDING' && (
          <div className="flex items-center gap-2">
            {onReject && (
              <button
                type="button"
                onClick={() => onReject(offer)}
                disabled={processing}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 transition disabled:opacity-50"
              >
                <X className="w-3.5 h-3.5" />
                Decline
              </button>
            )}
            {onAccept && (
              <button
                type="button"
                onClick={() => onAccept(offer)}
                disabled={processing}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                Accept Offer
              </button>
            )}
          </div>
        )}

        {/* Provider Actions for PENDING */}
        {isProvider && offer.status === 'PENDING' && onWithdraw && (
          <button
            type="button"
            onClick={() => onWithdraw(offer)}
            disabled={processing}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition"
          >
            Withdraw Offer
          </button>
        )}
      </div>
    </div>
  );
};
