import React, { useState, useEffect } from 'react';
import { ProviderProfile, Listing } from '../types';
import { getProviderById } from '../services/providersService';
import { getProviderListings } from '../services/listingsService';
import { getOrCreateConversation } from '../services/conversationsService';
import { useAuth } from '../contexts/AuthContext';
import { ListingCard } from '../components/cards/ListingCard';
import { ReportModal } from '../components/common/ReportModal';
import { CATEGORY_MAP } from '../constants/categories';
import {
  MapPin,
  Star,
  ShieldCheck,
  Mail,
  Phone,
  Globe,
  MessageSquare,
  ArrowLeft,
  Tag,
  Flag,
} from 'lucide-react';

interface ProviderDetailPageProps {
  id: string;
  navigate: (path: string) => void;
}

export const ProviderDetailPage: React.FC<ProviderDetailPageProps> = ({ id, navigate }) => {
  const { currentUser, userProfile } = useAuth();
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [pData, lData] = await Promise.all([
          getProviderById(id),
          getProviderListings(id),
        ]);
        if (!pData) {
          setError('Provider not found.');
          return;
        }
        setProvider(pData);
        setListings(lData);
      } catch (err: any) {
        setError(err?.message || 'Error loading provider.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleStartChat = async () => {
    if (!currentUser || !provider) {
      navigate('/login');
      return;
    }
    try {
      const convId = await getOrCreateConversation(
        currentUser.uid,
        provider.userId,
        {
          [currentUser.uid]: userProfile?.displayName || 'Customer',
          [provider.userId]: provider.businessName,
        }
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

  if (error || !provider) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-lg font-bold text-slate-900">{error || 'Provider not found'}</h2>
        <button
          onClick={() => navigate('/providers')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
        >
          Back to Providers
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate('/providers')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Providers
      </button>

      {/* Provider Header Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center shrink-0 shadow-md">
              {provider.businessName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-slate-900">{provider.businessName}</h1>
                {provider.isVerified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Provider
                  </span>
                )}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1 text-slate-700 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {provider.city ? `${provider.city}, ` : ''}
                    {provider.country}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-slate-700 font-bold">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{provider.rating ? provider.rating.toFixed(1) : '5.0'}</span>
                  <span className="font-normal text-slate-400">
                    ({provider.reviewCount || 1} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <button
              onClick={handleStartChat}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
            >
              <MessageSquare className="w-4 h-4" />
              Contact Provider
            </button>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200"
              title="Report provider"
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            About This Provider
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {provider.bio || 'Verified provider on NeedFinderGlobal.'}
          </p>
        </div>

        {/* Categories & Service Areas */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <h4 className="font-bold text-slate-800 mb-2">Categories Covered</h4>
            <div className="flex flex-wrap gap-1.5">
              {provider.categories?.map((c) => {
                const cat = CATEGORY_MAP.get(c);
                return (
                  <span
                    key={c}
                    className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-medium"
                  >
                    {cat?.name || c}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Contact Details (if public) */}
          <div>
            <h4 className="font-bold text-slate-800 mb-2">Verified Contact Information</h4>
            <div className="space-y-1.5 text-slate-600">
              {provider.showEmail && provider.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{provider.email}</span>
                </div>
              )}
              {provider.showPhone && provider.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{provider.phone}</span>
                </div>
              )}
              {provider.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <a
                    href={provider.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {provider.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Provider Listings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">
            Offerings & Listings ({listings.length})
          </h2>
        </div>

        {listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((l) => (
              <ListingCard key={l.id} listing={l} onNavigate={navigate} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
            No active product or service listings currently posted by this provider.
          </div>
        )}
      </div>

      {isReportModalOpen && (
        <ReportModal
          isOpen={isReportModalOpen}
          targetType="provider"
          targetId={provider.id}
          targetTitle={provider.businessName}
          onClose={() => setIsReportModalOpen(false)}
        />
      )}
    </div>
  );
};
