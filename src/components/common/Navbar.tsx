import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { subscribeToUserNotifications } from '../../services/notificationsService';
import { AppNotification } from '../../types';
import {
  Globe,
  PlusCircle,
  Briefcase,
  Bell,
  MessageSquare,
  Bookmark,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  LayoutDashboard,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const { currentUser, userProfile, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      return;
    }
    const unsub = subscribeToUserNotifications(currentUser.uid, (list) => {
      setNotifications(list);
    });
    return () => unsub?.();
  }, [currentUser]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNav = (path: string) => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => handleNav('/')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition transform">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                  NeedFinder
                </span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 tracking-wider">
                  GLOBAL
                </span>
              </div>
              <p className="text-[10px] text-slate-500 -mt-0.5 hidden sm:block">
                Tell us what you need
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-5">
            <button
              onClick={() => handleNav('/products')}
              className={`text-sm font-medium transition flex items-center gap-1.5 ${
                currentPath === '/products' || currentPath.includes('type=listings')
                  ? 'text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              <Tag className="w-4 h-4 text-emerald-600" />
              Products & Services
            </button>
            <button
              onClick={() => handleNav('/needs')}
              className={`text-sm font-medium transition flex items-center gap-1.5 ${
                currentPath === '/needs'
                  ? 'text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              <Layers className="w-4 h-4 text-blue-600" />
              Customer Needs
            </button>
            <button
              onClick={() => handleNav('/categories')}
              className={`text-sm font-medium transition flex items-center gap-1.5 ${
                currentPath.startsWith('/categor')
                  ? 'text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              <Layers className="w-4 h-4" />
              Categories
            </button>
            <button
              onClick={() => handleNav('/how-it-works')}
              className={`text-sm font-medium transition flex items-center gap-1.5 ${
                currentPath === '/how-it-works'
                  ? 'text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              How It Works
            </button>
          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={() => handleNav('/provider/listings/new')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition shadow-xs"
              title="Add a product or service you are selling"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
              + List Product / Service
            </button>

            <button
              onClick={() => handleNav('/post-need')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-blue-600 text-white shadow-xs hover:bg-blue-700 active:scale-98 transition"
              title="Post what you need and get quotes"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Post a Need
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                {/* Notifications Bell */}
                <button
                  type="button"
                  onClick={() => handleNav('/notifications')}
                  className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white ring-2 ring-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Messages */}
                <button
                  type="button"
                  onClick={() => handleNav('/messages')}
                  className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                  title="Messages"
                >
                  <MessageSquare className="w-5 h-5" />
                </button>

                {/* User Menu Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pl-2.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition"
                  >
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center overflow-hidden">
                      {currentUser.photoURL ? (
                        <img
                          src={currentUser.photoURL}
                          alt={userProfile?.displayName || 'User'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        (userProfile?.displayName || currentUser.email || 'U')[0].toUpperCase()
                      )}
                    </div>
                    <span className="text-xs font-semibold text-slate-800 max-w-[100px] truncate">
                      {userProfile?.displayName || currentUser.email?.split('@')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 divide-y divide-slate-100">
                      <div className="px-3 py-2 text-xs">
                        <p className="font-semibold text-slate-800 truncate">
                          {userProfile?.displayName || 'My Account'}
                        </p>
                        <p className="text-slate-400 truncate">{currentUser.email}</p>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => handleNav('/dashboard')}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 text-left transition"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          Customer Dashboard
                        </button>
                        <button
                          onClick={() => handleNav('/my-needs')}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 text-left transition"
                        >
                          <Layers className="w-4 h-4 text-slate-400" />
                          My Needs & Requirements
                        </button>
                        <button
                          onClick={() => handleNav('/offers')}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 text-left transition"
                        >
                          <Briefcase className="w-4 h-4 text-slate-400" />
                          Received Offers
                        </button>
                        <button
                          onClick={() => handleNav('/saved')}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 text-left transition"
                        >
                          <Bookmark className="w-4 h-4 text-slate-400" />
                          Saved Items & Favorites
                        </button>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => handleNav('/provider/dashboard')}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 text-left transition"
                        >
                          <Briefcase className="w-4 h-4 text-slate-400" />
                          Provider Dashboard
                        </button>
                        <button
                          onClick={() => handleNav('/provider/listings')}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 text-left transition"
                        >
                          <Layers className="w-4 h-4 text-slate-400" />
                          My Products & Listings
                        </button>
                        <button
                          onClick={() => handleNav('/provider/listings/new')}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 text-left transition"
                        >
                          <PlusCircle className="w-4 h-4 text-emerald-600" />
                          + List Product / Service
                        </button>
                        <button
                          onClick={() => handleNav('/provider/profile')}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 text-left transition"
                        >
                          <UserIcon className="w-4 h-4 text-slate-400" />
                          Provider Profile Settings
                        </button>
                        <button
                          onClick={() => handleNav('/profile')}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 text-left transition"
                        >
                          <UserIcon className="w-4 h-4 text-slate-400" />
                          Account Settings
                        </button>
                      </div>

                      {isAdmin && (
                        <div className="py-1 bg-amber-50/50">
                          <button
                            onClick={() => handleNav('/admin')}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100/60 text-left transition"
                          >
                            <ShieldCheck className="w-4 h-4 text-amber-600" />
                            Admin Console
                          </button>
                        </div>
                      )}

                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 text-left transition"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <button
                  onClick={() => handleNav('/login')}
                  className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNav('/signup')}
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 md:hidden">
            {currentUser && (
              <button
                type="button"
                onClick={() => handleNav('/notifications')}
                className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNav('/provider/listings/new')}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-lg shadow-xs"
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              + List Product
            </button>
            <button
              onClick={() => handleNav('/post-need')}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-bold text-white bg-blue-600 rounded-lg shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              + Post a Need
            </button>
          </div>

          <div className="space-y-1 pt-2">
            <button
              onClick={() => handleNav('/products')}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 rounded-lg flex items-center gap-2"
            >
              <Tag className="w-4 h-4 text-emerald-600" />
              Browse Products & Services
            </button>
            <button
              onClick={() => handleNav('/needs')}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 rounded-lg flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-blue-600" />
              Browse Customer Needs
            </button>
            <button
              onClick={() => handleNav('/categories')}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Categories
            </button>
            <button
              onClick={() => handleNav('/how-it-works')}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              How It Works
            </button>
          </div>

          {currentUser ? (
            <div className="pt-3 border-t border-slate-100 space-y-1">
              <div className="px-3 py-2 bg-slate-50 rounded-lg text-xs">
                <p className="font-semibold text-slate-900">{userProfile?.displayName}</p>
                <p className="text-slate-500">{currentUser.email}</p>
              </div>
              <button
                onClick={() => handleNav('/dashboard')}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Customer Dashboard
              </button>
              <button
                onClick={() => handleNav('/my-needs')}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                My Needs
              </button>
              <button
                onClick={() => handleNav('/offers')}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Received Offers
              </button>
              <button
                onClick={() => handleNav('/provider/dashboard')}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Provider Dashboard
              </button>
              <button
                onClick={() => handleNav('/provider/listings')}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                My Products & Catalog
              </button>
              <button
                onClick={() => handleNav('/provider/listings/new')}
                className="w-full text-left px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 rounded-lg"
              >
                + List a Product / Service
              </button>
              <button
                onClick={() => handleNav('/messages')}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Messages
              </button>
              <button
                onClick={() => handleNav('/saved')}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Saved Items
              </button>
              <button
                onClick={() => handleNav('/profile')}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Profile Settings
              </button>
              {isAdmin && (
                <button
                  onClick={() => handleNav('/admin')}
                  className="w-full text-left px-3 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50 rounded-lg"
                >
                  Admin Console
                </button>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => handleNav('/login')}
                className="flex-1 py-2 text-center text-sm font-semibold text-slate-700 border border-slate-300 rounded-lg"
              >
                Log In
              </button>
              <button
                onClick={() => handleNav('/signup')}
                className="flex-1 py-2 text-center text-sm font-semibold text-white bg-slate-900 rounded-lg"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
