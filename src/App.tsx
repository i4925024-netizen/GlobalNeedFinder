import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { testConnection } from './firebase/config';
import { seedInitialDataIfEmpty } from './services/seedService';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { NeedsPage } from './pages/NeedsPage';
import { NeedDetailPage } from './pages/NeedDetailPage';
import { PostNeedPage } from './pages/PostNeedPage';
import { EditNeedPage } from './pages/EditNeedPage';
import { ProvidersPage } from './pages/ProvidersPage';
import { ProviderDetailPage } from './pages/ProviderDetailPage';
import { ListingDetailPage } from './pages/ListingDetailPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryPage } from './pages/CategoryPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { MyNeedsPage } from './pages/MyNeedsPage';
import { CustomerOffersPage } from './pages/CustomerOffersPage';
import { ProviderDashboardPage } from './pages/ProviderDashboardPage';
import { ProviderProfilePage } from './pages/ProviderProfilePage';
import { ProviderListingsPage } from './pages/ProviderListingsPage';
import { ProviderNewListingPage } from './pages/ProviderNewListingPage';
import { ProviderBrowseNeedsPage } from './pages/ProviderBrowseNeedsPage';
import { ProviderOffersPage } from './pages/ProviderOffersPage';
import { MessagesPage } from './pages/MessagesPage';
import { SavedPage } from './pages/SavedPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';

function getAppPath(pathname: string = window.location.pathname): string {
  let path = pathname || '/';
  
  // Case-insensitive match & remove base path
  if (path.toLowerCase().startsWith('/globalneedfinder')) {
    path = path.replace(/^\/GlobalNeedFinder/i, '');
  }

  // Ensure trailing slash removal unless it's just '/'
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1);
  }

  return path || '/';
}

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(getAppPath());
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    new URLSearchParams(window.location.search)
  );

  useEffect(() => {
    // 1. Test connection to Firestore on boot
    testConnection();

    // 2. Seed realistic initial data if database is empty
    seedInitialDataIfEmpty().catch((e) => console.warn('Seed attempt:', e));

    // 3. Listen to popstate for browser back/forward buttons
    const handlePopState = () => {
      setCurrentPath(getAppPath());
      setSearchParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path === (-1 as any)) {
      window.history.back();
      return;
    }

    const [pathname, search] = path.split('?');
    const isGhPages = window.location.pathname.toLowerCase().startsWith('/globalneedfinder');
    
    // Normalize target route
    let targetPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
    if (targetPath.length > 1 && targetPath.endsWith('/')) {
      targetPath = targetPath.slice(0, -1);
    }

    const fullPath = isGhPages ? `/GlobalNeedFinder${targetPath}` : targetPath;
    const finalUrl = `${fullPath}${search ? '?' + search : ''}`;

    window.history.pushState({}, '', finalUrl);
    setCurrentPath(targetPath || '/');
    setSearchParams(new URLSearchParams(search || ''));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    // Dynamic routes
    if (currentPath.startsWith('/need/')) {
      const id = currentPath.replace('/need/', '');
      return <NeedDetailPage id={id} navigate={navigate} />;
    }

    if (currentPath.startsWith('/edit-need/')) {
      const id = currentPath.replace('/edit-need/', '');
      return <EditNeedPage id={id} navigate={navigate} />;
    }

    if (
      currentPath.startsWith('/provider/') &&
      !currentPath.includes('/dashboard') &&
      !currentPath.includes('/needs') &&
      !currentPath.includes('/profile') &&
      !currentPath.includes('/listings') &&
      !currentPath.includes('/offers')
    ) {
      const id = currentPath.replace('/provider/', '');
      return <ProviderDetailPage id={id} navigate={navigate} />;
    }

    if (currentPath.startsWith('/listing/')) {
      const id = currentPath.replace('/listing/', '');
      return <ListingDetailPage id={id} navigate={navigate} />;
    }

    if (currentPath.startsWith('/category/')) {
      const slug = currentPath.replace('/category/', '');
      return <CategoryPage slug={slug} navigate={navigate} />;
    }

    // Static routes
    switch (currentPath) {
      case '/':
        return <HomePage navigate={navigate} />;
      case '/search':
        return <SearchPage navigate={navigate} urlParams={searchParams} />;
      case '/needs':
        return <NeedsPage navigate={navigate} />;
      case '/post-need':
        return <PostNeedPage navigate={navigate} />;
      case '/providers':
        return <ProvidersPage navigate={navigate} />;
      case '/categories':
        return <CategoriesPage navigate={navigate} />;
      case '/how-it-works':
        return <HowItWorksPage navigate={navigate} />;
      case '/dashboard':
        return <CustomerDashboardPage navigate={navigate} />;
      case '/my-needs':
        return <MyNeedsPage navigate={navigate} />;
      case '/offers':
        return <CustomerOffersPage navigate={navigate} />;
      case '/provider':
      case '/provider/dashboard':
        return <ProviderDashboardPage navigate={navigate} />;
      case '/provider/profile':
        return <ProviderProfilePage navigate={navigate} />;
      case '/provider/listings':
        return <ProviderListingsPage navigate={navigate} />;
      case '/provider/listings/new':
        return <ProviderNewListingPage navigate={navigate} />;
      case '/provider/needs':
        return <ProviderBrowseNeedsPage navigate={navigate} />;
      case '/provider/offers':
        return <ProviderOffersPage navigate={navigate} />;
      case '/messages':
        return <MessagesPage navigate={navigate} urlParams={searchParams} />;
      case '/saved':
        return <SavedPage navigate={navigate} />;
      case '/notifications':
        return <NotificationsPage navigate={navigate} />;
      case '/profile':
        return <ProfilePage navigate={navigate} />;
      case '/admin':
        return <AdminPage navigate={navigate} />;
      case '/login':
        return <LoginPage navigate={navigate} />;
      case '/signup':
        return <SignupPage navigate={navigate} />;
      case '/forgot-password':
        return <ForgotPasswordPage navigate={navigate} />;
      case '/privacy':
        return <PrivacyPage navigate={navigate} />;
      case '/terms':
        return <TermsPage navigate={navigate} />;
      default:
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
        <Navbar currentPath={currentPath} navigate={navigate} />
        <main className="flex-1">{renderContent()}</main>
        <Footer navigate={navigate} />
      </div>
    </AuthProvider>
  );
}
