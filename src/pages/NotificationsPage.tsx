import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  subscribeToUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../services/notificationsService';
import { AppNotification } from '../types';
import { Bell, CheckCheck, Briefcase, MessageSquare, Layers, Clock, ArrowRight } from 'lucide-react';

interface NotificationsPageProps {
  navigate: (path: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ navigate }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    const unsub = subscribeToUserNotifications(currentUser.uid, (list) => {
      setNotifications(list);
      setLoading(false);
    });
    return () => unsub?.();
  }, [currentUser]);

  const handleMarkAllRead = async () => {
    if (!currentUser) return;
    await markAllNotificationsRead(currentUser.uid);
  };

  const handleClickNotif = async (notif: AppNotification) => {
    if (!notif.read) {
      await markNotificationRead(notif.id);
    }
    if (notif.relatedType === 'need' && notif.relatedId) {
      navigate(`/need/${notif.relatedId}`);
    } else if (notif.relatedType === 'conversation' && notif.relatedId) {
      navigate(`/messages?id=${notif.relatedId}`);
    } else if (notif.type === 'NEW_OFFER') {
      navigate('/offers');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'NEW_OFFER':
      case 'OFFER_ACCEPTED':
      case 'OFFER_REJECTED':
        return <Briefcase className="w-5 h-5 text-blue-600" />;
      case 'NEW_MESSAGE':
        return <MessageSquare className="w-5 h-5 text-indigo-600" />;
      default:
        return <Layers className="w-5 h-5 text-emerald-600" />;
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h2 className="text-lg font-bold">Please sign in to view notifications</h2>
        <button
          onClick={() => navigate('/login')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs"
        >
          Sign In
        </button>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Notifications
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Real-time updates regarding your requirements, offers, and messages
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-white rounded-2xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const timeStr = notif.createdAt?.seconds
              ? new Date(notif.createdAt.seconds * 1000).toLocaleString([], {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Recent';

            return (
              <div
                key={notif.id}
                onClick={() => handleClickNotif(notif)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-4 ${
                  notif.read
                    ? 'bg-white border-slate-200 hover:border-slate-300'
                    : 'bg-blue-50/70 border-blue-200 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    {getIcon(notif.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{notif.title}</h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">{notif.body}</p>
                    <span className="mt-1.5 text-[10px] text-slate-400 block">{timeStr}</span>
                  </div>
                </div>

                <span className="text-xs font-semibold text-blue-600 shrink-0 flex items-center gap-0.5 pt-1">
                  View <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-800">No notifications yet</h4>
          <p className="text-xs text-slate-500 mt-1">
            You're all caught up! Updates regarding quotes and messages will appear here.
          </p>
        </div>
      )}
    </div>
  );
};
