import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { NeedForm } from '../components/forms/NeedForm';
import { createNeed } from '../services/needsService';
import { PlusCircle, ShieldCheck, ArrowLeft } from 'lucide-react';

interface PostNeedPageProps {
  navigate: (path: string) => void;
}

export const PostNeedPage: React.FC<PostNeedPageProps> = ({ navigate }) => {
  const { currentUser, userProfile } = useAuth();

  const handlePostNeed = async (formData: any) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const newId = await createNeed({
      ...formData,
      ownerId: currentUser.uid,
      ownerName: userProfile?.displayName || currentUser.email?.split('@')[0] || 'Customer',
      ownerEmail: currentUser.email || '',
    });

    navigate(`/need/${newId}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate(-1 as any)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-10">
        <div className="border-b border-slate-100 pb-6 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Customer Requirement Post</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tell us what you need
          </h1>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Publish your requirement so verified providers and suppliers can review your
            specifications and respond with matching offers.
          </p>
        </div>

        {!currentUser ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Sign In Required</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Please log in or create an account to post your requirement and securely receive provider offers.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-blue-700 transition"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
              >
                Create Account
              </button>
            </div>
          </div>
        ) : (
          <NeedForm onSubmit={handlePostNeed} />
        )}
      </div>
    </div>
  );
};
