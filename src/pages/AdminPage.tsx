import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAllReports, updateReportStatus } from '../services/reportsService';
import { getNeeds, deleteNeed } from '../services/needsService';
import { getListings, deleteListing } from '../services/listingsService';
import { seedInitialDataIfEmpty } from '../services/seedService';
import { Report, Need, Listing, ReportStatus } from '../types';
import {
  ShieldCheck,
  Flag,
  Layers,
  Tag,
  Users,
  Database,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';

interface AdminPageProps {
  navigate: (path: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ navigate }) => {
  const { currentUser, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'reports' | 'needs' | 'listings' | 'system'>('reports');

  const [reports, setReports] = useState<Report[]>([]);
  const [needs, setNeeds] = useState<Need[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [seedStatus, setSeedStatus] = useState<string | null>(null);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [rList, nList, lList] = await Promise.all([
        getAllReports(),
        getNeeds({ limitCount: 50 }),
        getListings({ limitCount: 50, activeOnly: false }),
      ]);
      setReports(rList);
      setNeeds(nList);
      setListings(lList);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  if (!currentUser || !isAdmin) {
    return (
      <div className="max-w-md mx-auto py-20 text-center px-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
        <p className="text-xs text-slate-500 mt-2">
          This portal requires administrator privileges.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  const handleUpdateReport = async (reportId: string, status: ReportStatus) => {
    try {
      await updateReportStatus(reportId, status);
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status } : r))
      );
    } catch (err) {
      console.error('Error updating report:', err);
    }
  };

  const handleDeleteNeed = async (needId: string) => {
    if (!window.confirm('Admin: Delete this requirement?')) return;
    try {
      await deleteNeed(needId);
      setNeeds((prev) => prev.filter((n) => n.id !== needId));
    } catch (err) {
      console.error('Error deleting need:', err);
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!window.confirm('Admin: Delete this listing?')) return;
    try {
      await deleteListing(listingId);
      setListings((prev) => prev.filter((l) => l.id !== listingId));
    } catch (err) {
      console.error('Error deleting listing:', err);
    }
  };

  const handleSeedData = async () => {
    setSeedStatus('Seeding initial marketplace data...');
    try {
      const seeded = await seedInitialDataIfEmpty();
      if (seeded) {
        setSeedStatus('Database seeded successfully with initial needs, listings, and verified providers!');
        await loadAdminData();
      } else {
        setSeedStatus('Marketplace already contains data. No duplicates created.');
      }
    } catch (err) {
      setSeedStatus('Seeding failed. Check console for details.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold mb-2 border border-amber-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrator Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            NeedFinderGlobal Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">Logged in as {currentUser.email}</p>
        </div>

        <button
          onClick={loadAdminData}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition self-start sm:self-auto"
        >
          Refresh Data
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 mb-8 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap ${
            activeTab === 'reports'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Flag className="w-3.5 h-3.5" />
          Content Reports ({reports.length})
        </button>

        <button
          onClick={() => setActiveTab('needs')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap ${
            activeTab === 'needs'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Needs Moderation ({needs.length})
        </button>

        <button
          onClick={() => setActiveTab('listings')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap ${
            activeTab === 'listings'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          Listings Moderation ({listings.length})
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap ${
            activeTab === 'system'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          System & Seed Tools
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reports.length > 0 ? (
            reports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700">
                      {report.targetType.toUpperCase()}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        report.status === 'OPEN'
                          ? 'bg-amber-100 text-amber-800'
                          : report.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {report.status}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">ID: {report.targetId}</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">
                    Reason: {report.reason}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 whitespace-pre-wrap">{report.details}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleUpdateReport(report.id, 'RESOLVED')}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Resolve
                  </button>
                  <button
                    onClick={() => handleUpdateReport(report.id, 'DISMISSED')}
                    className="px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Dismiss
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
              No content reports currently open.
            </div>
          )}
        </div>
      )}

      {activeTab === 'needs' && (
        <div className="space-y-3">
          {needs.map((n) => (
            <div
              key={n.id}
              className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between gap-4"
            >
              <div className="truncate">
                <h4 className="text-sm font-bold text-slate-900 truncate">{n.title}</h4>
                <p className="text-xs text-slate-500">
                  {n.category} • {n.country} • Status: {n.status}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/need/${n.id}`)}
                  className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"
                >
                  View
                </button>
                <button
                  onClick={() => handleDeleteNeed(n.id)}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'listings' && (
        <div className="space-y-3">
          {listings.map((l) => (
            <div
              key={l.id}
              className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between gap-4"
            >
              <div className="truncate">
                <h4 className="text-sm font-bold text-slate-900 truncate">{l.title}</h4>
                <p className="text-xs text-slate-500">
                  By {l.providerName} • {l.currency} {l.price}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/listing/${l.id}`)}
                  className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"
                >
                  View
                </button>
                <button
                  onClick={() => handleDeleteListing(l.id)}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'system' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Marketplace Seeding Tool</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Populate the database with realistic sample requirements (Toyota Corolla, React Developer,
              Dubai Apartment, Bulk Hoodies) and verified provider profiles if the database is currently empty.
            </p>
          </div>

          {seedStatus && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800">
              {seedStatus}
            </div>
          )}

          <div>
            <button
              onClick={handleSeedData}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-2"
            >
              <Database className="w-4 h-4" />
              Seed Realistic Marketplace Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
