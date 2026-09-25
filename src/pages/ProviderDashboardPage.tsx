import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getProviderListings } from '../services/listingsService';
import { getOffersByProviderId } from '../services/offersService';
import { Listing, Offer } from '../types';
import { ListingCard } from '../components/cards/ListingCard';
import { OfferCard } from '../components/cards/OfferCard';
import {
  Briefcase,
  Tag,
  PlusCircle,
  Search,
  CheckCircle,
  Clock,
  User,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface ProviderDashboardPageProps {
  navigate: (path: string) => void;
}

export const ProviderDashboardPage: React.FC<ProviderDashboardPageProps> = ({ navigate }) => {
  const { currentUser, userProfile, providerProfile } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    async function loadStats() {
      try {
        setLoading(true);
        const [lList, oList] = await Promise.all([
          getProviderListings(currentUser!.uid),
          getOffersByProviderId(currentUser!.uid),
        ]);
        setListings(lList);
        setOffers(oList);
      } catch (err) {
        console.error('Error loading provider stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [currentUser]);

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

  const activeListings = listings.filter((l) => l.active);
  const acceptedOffers = offers.filter((o) => o.status === 'ACCEPTED');
  const pendingOffers = offers.filter((o) => o.status === 'PENDING');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 border border-blue-800/60 px-3 py-1 rounded-full">
            Provider & Seller Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
            {providerProfile?.businessName || userProfile?.displayName || 'Provider Workspace'}
          </h1>
          <p className="mt-1 text-sm text-slate-300 max-w-xl">
            Respond to buyer requirements worldwide, manage your item catalog, and close deals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate('/provider/needs')}
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Browse Customer Needs
          </button>
          <button
            onClick={() => navigate('/provider/listings/new')}
            className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            Add Listing
          </button>
          <button
            onClick={() => navigate('/provider/profile')}
            className="px-3.5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium border border-slate-700 transition"
            title="Profile Settings"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Catalog Listings</span>
            <Tag className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900">{listings.length}</span>
          <p className="text-[11px] text-slate-400 mt-1">{activeListings.length} active in search</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Submitted Offers</span>
            <Briefcase className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900">{offers.length}</span>
          <p className="text-[11px] text-slate-400 mt-1">{pendingOffers.length} pending review</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Accepted Deals</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-emerald-600">{acceptedOffers.length}</span>
          <p className="text-[11px] text-slate-400 mt-1">Ready for fulfillment</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Marketplace Needs</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <button
            onClick={() => navigate('/provider/needs')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-3"
          >
            Find Matching Needs →
          </button>
        </div>
      </div>

      {/* Main Grid: Listings & Sent Offers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Provider Listings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Your Active Listings</h2>
            <button
              onClick={() => navigate('/provider/listings')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Manage Listings ({listings.length}) →
            </button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-40 bg-white rounded-xl border border-slate-200 animate-pulse" />
              ))}
            </div>
          ) : listings.length > 0 ? (
            <div className="space-y-4">
              {listings.slice(0, 3).map((listing) => (
                <ListingCard key={listing.id} listing={listing} onNavigate={navigate} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <Tag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800">No listings posted yet</h4>
              <p className="text-xs text-slate-500 mt-1">
                Showcase your inventory, vehicles, properties, or service packages to prospective buyers.
              </p>
              <button
                onClick={() => navigate('/provider/listings/new')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold"
              >
                Create First Listing
              </button>
            </div>
          )}
        </div>

        {/* Sent Offers */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Your Submitted Quotes</h2>
            <button
              onClick={() => navigate('/provider/offers')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View All ({offers.length}) →
            </button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-40 bg-white rounded-xl border border-slate-200 animate-pulse" />
              ))}
            </div>
          ) : offers.length > 0 ? (
            <div className="space-y-4">
              {offers.slice(0, 3).map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  isCustomer={false}
                  isProvider={true}
                  onViewNeed={(needId) => navigate(`/need/${needId}`)}
                  onOpenChat={() => navigate('/messages')}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800">No quotes submitted yet</h4>
              <p className="text-xs text-slate-500 mt-1">
                Browse customer requirements and submit tailored proposals with your price quote.
              </p>
              <button
                onClick={() => navigate('/provider/needs')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold"
              >
                Browse Customer Requirements
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
