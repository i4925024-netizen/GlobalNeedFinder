import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { NeedForm } from '../components/forms/NeedForm';
import { getNeedById, updateNeed } from '../services/needsService';
import { Need } from '../types';
import { ArrowLeft, Edit } from 'lucide-react';

interface EditNeedPageProps {
  id: string;
  navigate: (path: string) => void;
}

export const EditNeedPage: React.FC<EditNeedPageProps> = ({ id, navigate }) => {
  const { currentUser, isAdmin } = useAuth();
  const [need, setNeed] = useState<Need | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNeed() {
      try {
        const data = await getNeedById(id);
        if (!data) {
          setError('Requirement not found.');
          return;
        }
        if (currentUser && data.ownerId !== currentUser.uid && !isAdmin) {
          setError('You do not have permission to edit this requirement.');
          return;
        }
        setNeed(data);
      } catch (err: any) {
        setError(err?.message || 'Error fetching requirement.');
      } finally {
        setLoading(false);
      }
    }
    fetchNeed();
  }, [id, currentUser]);

  const handleUpdate = async (formData: any) => {
    if (!need) return;
    await updateNeed(need.id, formData);
    navigate(`/need/${need.id}`);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="h-64 bg-white rounded-2xl border border-slate-200 animate-pulse p-8" />
      </div>
    );
  }

  if (error || !need) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-lg font-bold text-slate-900">{error || 'Unable to edit'}</h2>
        <button
          onClick={() => navigate('/my-needs')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
        >
          Back to My Needs
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate(`/need/${need.id}`)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Requirement
      </button>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-10">
        <div className="border-b border-slate-100 pb-6 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
            <Edit className="w-3.5 h-3.5" />
            <span>Editing Requirement</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Update Requirement
          </h1>
        </div>

        <NeedForm initialValues={need} onSubmit={handleUpdate} isEditing={true} />
      </div>
    </div>
  );
};
