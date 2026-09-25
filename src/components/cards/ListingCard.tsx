import React, { useState, useEffect } from 'react';
import { Listing } from '../../types';
import { CATEGORY_MAP } from '../../constants/categories';
import { MapPin, Tag, ArrowRight, Bookmark } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { isListingSaved, saveListing, unsaveListing } from '../../services/savedService';

interface ListingCardProps {
  listing: Listing;
  onNavigate: (path: string) => void;
  showSaveButton?: boolean;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onNavigate,
  showSaveButton = true,
}) => {
  const { currentUser } = useAuth();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const cat = CATEGORY_MAP.get(listing.category);

  useEffect(() => {
    if (!currentUser || !showSaveButton) return;
    let isMounted = true;
    isListingSaved(currentUser.uid, listing.id).then((isS) => {
      if (isMounted) setSaved(isS);
    });
    return () => {
      isMounted = false;
    };
  }, [currentUser, listing.id, showSaveButton]);

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      onNavigate('/login');
      return;
    }
    setSaving(true);
    try {
      if (saved) {
        await unsaveListing(currentUser.uid, listing.id);
        setSaved(false);
      } else {
        await saveListing(currentUser.uid, listing);
        setSaved(true);
      }
    } catch (err) {
      console.error('Error toggling save:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      onClick={() => onNavigate(`/listing/${listing.id}`)}
      className="group bg-white rounded-xl border border-slate-200/90 hover:border-blue-400 p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
            <Tag className="w-3 h-3" />
            {cat?.name || listing.category}
          </span>

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
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-blue-600 text-blue-600' : ''}`} />
            </button>
          )}
        </div>

        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-2 leading-snug">
          {listing.title}
        </h3>

        <p className="mt-1 text-xs font-medium text-slate-500 truncate">
          By {listing.providerName}
        </p>

        <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {listing.description}
        </p>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {listing.city ? `${listing.city}, ` : ''}
              {listing.country}
            </span>
          </div>
          {listing.condition && (
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              {listing.condition}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-base font-black text-slate-900">
            {listing.currency} {listing.price.toLocaleString()}
          </span>
        </div>
        <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 group-hover:translate-x-0.5 transition">
          Details <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
