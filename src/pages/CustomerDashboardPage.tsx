import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserNeeds } from '../services/needsService';
import { getOffersByCustomerId } from '../services/offersService';
import { Need, Offer } from '../types';
import { NeedCard } from '../components/cards/NeedCard';
import { OfferCard } from '../components/cards/OfferCard';
import {
  LayoutDashboard,
  Layers,
  Briefcase,
  PlusCircle,
  MessageSquare,
  Clock,
  CheckCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface CustomerDashboardPageProps {
  navigate: (path: string) => void;
}

export const CustomerDashboardPage: React.FC<CustomerDashboardPageProps> = ({ navigate }) => {
  const { currentUser, userProfile } = useAuth();
  const [needs, setNeeds] = useState<Need[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    async function loadStats() {
      try {
        setLoading(true);
        const [nList, oList] = await Promise.all([
          getUserNeeds(currentUser!.uid),
          getOffersByCustomerId(currentUser!.uid),
        ]);
        setNeeds(nList);
        setOffers(oList);
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [currentUser]);

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

  const openNeeds = needs.filter((n) => n.status === 'OPEN');
  const pendingOffers = offers.filter((o) => o.status === 'PENDING');
  const acceptedOffers = offers.filter((o) => o.status === 'ACCEPTED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-blue-900/10 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-200 bg-white/10 px-3 py-1 rounded-full">
            Customer Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
            Hello, {userProfile?.displayName || 'Customer'}!
          </h1>
          <p className="mt-1 text-sm text-blue-100 max-w-xl">
            Track your posted requirements, review quotes from global providers, and manage your deals.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/post-need')}
            className="px-5 py-3 rounded-xl bg-white text-blue-700 font-bold text-xs shadow-md hover:bg-blue-50 transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Post New Need
          </button>
          <button
            onClick={() => navigate('/provider/dashboard')}
            className="px-4 py-3 rounded-xl bg-blue-800/80 hover:bg-blue-800 text-white font-semibold text-xs border border-blue-400/30 transition flex items-center gap-1.5"
          >
            <Briefcase className="w-4 h-4" />
            Provider Hub
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Needs</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900">{needs.length}</span>
          <p className="text-[11px] text-slate-400 mt-1">{openNeeds.length} currently open</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Offers Received</span>
            <Briefcase className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900">{offers.length}</span>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            {pendingOffers.length} awaiting review
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Deals Accepted</span>
            <CheckCircle className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900">{acceptedOffers.length}</span>
          <p className="text-[11px] text-slate-400 mt-1">In progress or fulfilled</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Quick Chat</span>
            <MessageSquare className="w-4 h-4 text-purple-600" />
          </div>
          <button
            onClick={() => navigate('/messages')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-3"
          >
            Open Messages Inbox →
          </button>
        </div>
      </div>

      {/* Main Content Grid: Recent Needs & Received Offers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Needs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Your Recent Requirements</h2>
            <button
              onClick={() => navigate('/my-needs')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View All ({needs.length}) →
            </button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-40 bg-white rounded-xl border border-slate-200 animate-pulse" />
              ))}
            </div>
          ) : needs.length > 0 ? (
            <div className="space-y-4">
              {needs.slice(0, 3).map((need) => (
                <NeedCard key={need.id} need={need} onNavigate={navigate} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800">No requirements posted yet</h4>
              <p className="text-xs text-slate-500 mt-1">
                Tell providers what you are searching for to start receiving offers.
              </p>
              <button
                onClick={() => navigate('/post-need')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold"
              >
                Post Your First Requirement
              </button>
            </div>
          )}
        </div>

        {/* Recent Offers */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Recent Received Offers</h2>
            <button
              onClick={() => navigate('/offers')}
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
                  isCustomer={true}
                  isProvider={false}
                  onViewNeed={(needId) => navigate(`/need/${needId}`)}
                  onOpenChat={() => navigate('/messages')}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800">No offers received yet</h4>
              <p className="text-xs text-slate-500 mt-1">
                When providers respond to your needs, their quotes will appear here for you to accept or decline.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
