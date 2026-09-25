import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserNeeds, deleteNeed, updateNeedStatus } from '../services/needsService';
import { Need, NeedStatus } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { CATEGORY_MAP } from '../constants/categories';
import {
  Layers,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  MapPin,
  Clock,
} from 'lucide-react';

interface MyNeedsPageProps {
  navigate: (path: string) => void;
}

export const MyNeedsPage: React.FC<MyNeedsPageProps> = ({ navigate }) => {
  const { currentUser } = useAuth();
  const [needs, setNeeds] = useState<Need[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const [deleteTarget, setDeleteTarget] = useState<Need | null>(null);
  const [processing, setProcessing] = useState(false);

  const fetchNeeds = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await getUserNeeds(currentUser.uid);
      setNeeds(data);
    } catch (err) {
      console.error('Error fetching my needs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNeeds();
  }, [currentUser]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setProcessing(true);
      await deleteNeed(deleteTarget.id);
      setNeeds((prev) => prev.filter((n) => n.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error('Error deleting need:', err);
    } finally {
      setProcessing(false);
    }
  };

  const handleStatusChange = async (needId: string, newStatus: NeedStatus) => {
    try {
      setProcessing(true);
      await updateNeedStatus(needId, newStatus);
      setNeeds((prev) =>
        prev.map((n) => (n.id === needId ? { ...n, status: newStatus } : n))
      );
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setProcessing(false);
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

  let filtered = needs.filter((n) => {
    if (statusFilter !== 'ALL' && n.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q);
    }
    return true;
  });

  filtered = filtered.sort((a, b) => {
    const timeA = a.createdAt?.seconds || 0;
    const timeB = b.createdAt?.seconds || 0;
    return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Posted Requirements
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your requirements, monitor status, and review offers
          </p>
        </div>

        <button
          onClick={() => navigate('/post-need')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition"
        >
          <PlusCircle className="w-4 h-4" />
          Post New Requirement
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your requirements..."
            className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-xl p-2.5 bg-white text-slate-800"
          >
            <option value="ALL">All Statuses ({needs.length})</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="FULFILLED">Fulfilled</option>
            <option value="CLOSED">Closed</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="text-xs border border-slate-300 rounded-xl p-2.5 bg-white text-slate-800"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Table / List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-white rounded-xl border border-slate-200 animate-pulse p-6" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((need) => {
            const cat = CATEGORY_MAP.get(need.category);
            const dateStr = need.createdAt?.seconds
              ? new Date(need.createdAt.seconds * 1000).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Recent';

            return (
              <div
                key={need.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-50 text-blue-700">
                      {cat?.name || need.category}
                    </span>
                    <StatusBadge status={need.status} size="sm" />
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {dateStr}
                    </span>
                  </div>

                  <h3
                    onClick={() => navigate(`/need/${need.id}`)}
                    className="text-base font-bold text-slate-900 hover:text-blue-600 transition cursor-pointer truncate"
                  >
                    {need.title}
                  </h3>

                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {need.city ? `${need.city}, ` : ''}
                      {need.country}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-slate-800">
                      {need.budgetMax
                        ? `${need.currency} ${need.budgetMax.toLocaleString()}`
                        : 'Flexible Budget'}
                    </span>
                    <span>•</span>
                    <span className="text-blue-600 font-semibold flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {need.offersCount} {need.offersCount === 1 ? 'Offer' : 'Offers'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => navigate(`/need/${need.id}`)}
                    className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                    title="View Requirement"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {need.status === 'OPEN' && (
                    <button
                      onClick={() => navigate(`/edit-need/${need.id}`)}
                      className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                      title="Edit Requirement"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}

                  {need.status === 'OPEN' && (
                    <button
                      onClick={() => handleStatusChange(need.id, 'CLOSED')}
                      className="p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                      title="Close Requirement"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}

                  {need.status !== 'FULFILLED' && (
                    <button
                      onClick={() => handleStatusChange(need.id, 'FULFILLED')}
                      className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                      title="Mark as Fulfilled"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => setDeleteTarget(need)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete Requirement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 max-w-md mx-auto">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No requirements found</h3>
          <p className="text-xs text-slate-500 mt-1">
            {needs.length === 0
              ? 'You have not posted any requirements yet.'
              : 'No requirements match your current search and status filter.'}
          </p>
          <button
            onClick={() => navigate('/post-need')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-blue-700"
          >
            Post a Requirement
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Requirement?"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        isDestructive={true}
        isLoading={processing}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
