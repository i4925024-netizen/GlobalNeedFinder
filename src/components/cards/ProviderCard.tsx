import React from 'react';
import { ProviderProfile } from '../../types';
import { MapPin, Star, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { CATEGORY_MAP } from '../../constants/categories';

interface ProviderCardProps {
  provider: ProviderProfile;
  onNavigate: (path: string) => void;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider, onNavigate }) => {
  return (
    <div
      onClick={() => onNavigate(`/provider/${provider.id}`)}
      className="group bg-white rounded-xl border border-slate-200/90 hover:border-blue-400 p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 font-bold text-base flex items-center justify-center shrink-0 border border-blue-200">
            {provider.businessName.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition truncate">
                {provider.businessName}
              </h3>
              {provider.isVerified && (
                <span title="Verified Provider">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">
                {provider.city ? `${provider.city}, ` : ''}
                {provider.country}
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="mt-3 text-xs text-slate-600 line-clamp-3 leading-relaxed">
          {provider.bio || 'Professional verified marketplace provider ready for custom requests and offers.'}
        </p>

        {/* Categories tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {provider.categories?.slice(0, 3).map((slug) => {
            const cat = CATEGORY_MAP.get(slug);
            return (
              <span
                key={slug}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
              >
                {cat?.name || slug}
              </span>
            );
          })}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{provider.rating ? provider.rating.toFixed(1) : '5.0'}</span>
          <span className="text-slate-400 font-normal">
            ({provider.reviewCount || 1} {provider.reviewCount === 1 ? 'review' : 'reviews'})
          </span>
        </div>

        <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 group-hover:translate-x-0.5 transition">
          View Profile <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
