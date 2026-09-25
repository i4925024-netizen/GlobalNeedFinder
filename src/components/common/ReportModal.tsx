import React, { useState } from 'react';
import { Flag, X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { submitReport } from '../../services/reportsService';
import { ReportTargetType } from '../../types';

interface ReportModalProps {
  isOpen: boolean;
  targetType: ReportTargetType;
  targetId: string;
  targetTitle?: string;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  targetType,
  targetId,
  targetTitle,
  onClose,
}) => {
  const { currentUser } = useAuth();
  const [reason, setReason] = useState('Inappropriate or Offensive Content');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('You must be signed in to submit a report.');
      return;
    }
    if (details.trim().length < 10) {
      setError('Please provide at least 10 characters explaining the issue.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await submitReport({
        reporterId: currentUser.uid,
        reporterEmail: currentUser.email || undefined,
        targetType,
        targetId,
        targetTitle,
        reason,
        details: details.trim(),
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-rose-600 font-semibold text-base">
            <Flag className="w-5 h-5" />
            <span>Report Content</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center flex flex-col items-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3 animate-in zoom-in duration-200" />
            <h4 className="text-base font-semibold text-slate-800">Report Submitted</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Thank you for keeping NeedFinderGlobal safe. Our moderation team will review this.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {targetTitle && (
              <div className="p-2.5 bg-slate-50 rounded-lg text-xs text-slate-600">
                Reporting: <strong className="text-slate-800">{targetTitle}</strong>
              </div>
            )}

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason for report
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-800 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              >
                <option value="Spam or Fake Listing">Spam or Fake Listing</option>
                <option value="Inappropriate or Offensive Content">Inappropriate or Offensive Content</option>
                <option value="Prohibited or Illegal Item/Service">Prohibited or Illegal Item/Service</option>
                <option value="Harassment or Impersonation">Harassment or Impersonation</option>
                <option value="Fraud or Scams">Fraud or Scams</option>
                <option value="Other Policy Violation">Other Policy Violation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Details (Minimum 10 characters)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Explain what is misleading, abusive, or violating policies..."
                rows={3}
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition disabled:opacity-50 flex items-center gap-1.5"
              >
                {isSubmitting && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
