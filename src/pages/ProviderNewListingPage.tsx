import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ListingForm } from '../components/forms/ListingForm';
import { createListing } from '../services/listingsService';
import { Tag, ArrowLeft } from 'lucide-react';

interface ProviderNewListingPageProps {
  navigate: (path: string) => void;
}

export const ProviderNewListingPage: React.FC<ProviderNewListingPageProps> = ({ navigate }) => {
  const { currentUser, userProfile, providerProfile } = useAuth();

  const handleCreate = async (formData: any) => {
    if (!currentUser) return;

    const providerName =
      providerProfile?.businessName ||
      userProfile?.displayName ||
      currentUser.email?.split('@')[0] ||
      'Provider';

    const newId = await createListing({
      ...formData,
      providerId: currentUser.uid,
      providerName,
    });

    navigate(`/listing/${newId}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate('/provider/listings')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Listings
      </button>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-10">
        <div className="border-b border-slate-100 pb-6 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-3">
            <Tag className="w-3.5 h-3.5" />
            <span>New Offering Listing</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            List a Product or Service
          </h1>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            Create an entry in the NeedFinderGlobal directory. Customers searching for matching items
            will find your listing and contact you directly.
          </p>
        </div>

        {!currentUser ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl">
            <p className="text-xs text-slate-500">Please sign in as a provider to list items.</p>
            <button
              onClick={() => navigate('/login')}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold"
            >
              Sign In
            </button>
          </div>
        ) : (
          <ListingForm onSubmit={handleCreate} />
        )}
      </div>
    </div>
  );
};
