import React from 'react';
import { NeedStatus, OfferStatus } from '../../types';

interface StatusBadgeProps {
  status: NeedStatus | OfferStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = status.toUpperCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-300';
  let label = status;

  switch (normalized) {
    case 'OPEN':
      styles = 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-1 ring-emerald-400/20';
      label = 'Open';
      break;
    case 'IN_PROGRESS':
      styles = 'bg-blue-50 text-blue-700 border-blue-300 ring-1 ring-blue-400/20';
      label = 'In Progress';
      break;
    case 'FULFILLED':
      styles = 'bg-indigo-50 text-indigo-700 border-indigo-300 ring-1 ring-indigo-400/20';
      label = 'Fulfilled';
      break;
    case 'CLOSED':
      styles = 'bg-gray-100 text-gray-600 border-gray-300';
      label = 'Closed';
      break;
    case 'EXPIRED':
      styles = 'bg-amber-50 text-amber-700 border-amber-300';
      label = 'Expired';
      break;
    case 'PENDING':
      styles = 'bg-amber-50 text-amber-700 border-amber-300 ring-1 ring-amber-400/20';
      label = 'Pending';
      break;
    case 'ACCEPTED':
      styles = 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-1 ring-emerald-400/20';
      label = 'Accepted';
      break;
    case 'REJECTED':
      styles = 'bg-rose-50 text-rose-700 border-rose-300';
      label = 'Rejected';
      break;
    case 'WITHDRAWN':
      styles = 'bg-slate-100 text-slate-500 border-slate-300';
      label = 'Withdrawn';
      break;
    default:
      styles = 'bg-slate-100 text-slate-700 border-slate-200';
      label = status;
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border ${sizeClasses} ${styles}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
      {label}
    </span>
  );
};
