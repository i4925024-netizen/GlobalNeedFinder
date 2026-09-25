import React, { useState, useEffect } from 'react';
import { Need } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { CATEGORY_MAP } from '../../constants/categories';
import { MapPin, Clock, DollarSign, Bookmark, ArrowRight, Layers, MessageSquare } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { isNeedSaved, saveNeed, unsaveNeed } from '../../services/savedService';

interface NeedCardProps {
  need: Need;
  onNavigate: (path: string) => void;
  showSaveButton?: boolean;
}

export const NeedCard: React.FC<NeedCardProps> = ({
  need,
  onNavigate,
  showSaveButton = true,
}) => {
  const { currentUser } = useAuth();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const cat = CATEGORY_MAP.get(need.category);

  useEffect(() => {
    if (!currentUser || !showSaveButton) return;
    let isMounted = true;
    isNeedSaved(currentUser.uid, need.id).then((isS) => {
      if (isMounted) setSaved(isS);
    });
    return () => {
      isMounted = false;
    };
  }, [currentUser, need.id, showSaveButton]);

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      onNavigate('/login');
      return;
    }
    setSaving(true);
    try {
      if (saved) {
        await unsaveNeed(currentUser.uid, need.id);
        setSaved(false);
      } else {
        await saveNeed(currentUser.uid, need);
        setSaved(true);
      }
    } catch (err) {
      console.error('Error toggling save:', err);
    } finally {
      setSaving(false);
    }
  };

  const formattedDate = need.createdAt?.seconds
    ? new Date(need.createdAt.seconds * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent';

  return (
    <div
      onClick={() => onNavigate(`/need/${need.id}`)}
      className="group bg-white rounded-xl border border-slate-200/90 hover:border-blue-400 p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top Badges & Actions */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
              <Layers className="w-3 h-3" />
              {cat?.name || need.category}
            </span>
            <StatusBadge status={need.status} size="sm" />
            {need.urgency && need.urgency !== 'low' && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  need.urgency === 'urgent'
                    ? 'bg-rose-100 text-rose-700'
                    : need.urgency === 'high'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {need.urgency}
              </span>
            )}
          </div>

          {showSaveButton && (
            <button
              type="button"
              onClick={handleToggleSave}
              disabled={saving}
              className={`p-1.5 rounded-lg border transition ${
                saved
                  ? 'bg-blue-50 border-blue-200 text-blue-600'
                  : 'bg-white border-slate-200 text-slate-400 hover:text-blue-600 hover:border-slate-300'
              }`}
              title={saved ? 'Remove from saved' : 'Save requirement'}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-blue-600 text-blue-600' : ''}`} />
            </button>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-2 leading-snug">
          {need.title}
        </h3>

        {/* Description snippet */}
        <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {need.description}
        </p>

        {/* Location & Metadata */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-1 truncate text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {need.city ? `${need.city}, ` : ''}
              {need.country}
            </span>
          </div>

          <div className="flex items-center gap-1 text-slate-400 shrink-0">
            <Clock className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Bottom Area: Budget & Action */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          {need.budgetMax ? (
            <div className="flex items-baseline gap-1">
              <span className="text-[11px] text-slate-400 font-medium">Budget:</span>
              <span className="text-sm font-bold text-slate-900">
                {need.currency} {need.budgetMin ? `${need.budgetMin.toLocaleString()} - ` : ''}
                {need.budgetMax.toLocaleString()}
              </span>
            </div>
          ) : (
            <span className="text-xs font-medium text-slate-500 italic">Budget flexible</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>
              {need.offersCount} {need.offersCount === 1 ? 'offer' : 'offers'}
            </span>
          </div>
          <span className="text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition flex items-center gap-0.5">
            View <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
