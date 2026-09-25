import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CATEGORIES } from '../constants/categories';
import { CountrySelector } from '../components/common/CountrySelector';
import { ArrowLeft, Check, ShieldCheck, AlertCircle } from 'lucide-react';

interface ProviderProfilePageProps {
  navigate: (path: string) => void;
}

export const ProviderProfilePage: React.FC<ProviderProfilePageProps> = ({ navigate }) => {
  const { currentUser, userProfile, providerProfile, updateProviderProfile } = useAuth();

  const [businessName, setBusinessName] = useState('');
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState('United States');
  const [city, setCity] = useState('');
  const [serviceAreas, setServiceAreas] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['services']);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [showEmail, setShowEmail] = useState(true);
  const [showPhone, setShowPhone] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (providerProfile) {
      setBusinessName(providerProfile.businessName || '');
      setBio(providerProfile.bio || '');
      setCountry(providerProfile.country || 'United States');
      setCity(providerProfile.city || '');
      setServiceAreas(providerProfile.serviceAreas?.join(', ') || '');
      setSelectedCategories(providerProfile.categories || ['services']);
      setPhone(providerProfile.phone || '');
      setEmail(providerProfile.email || currentUser?.email || '');
      setWebsite(providerProfile.website || '');
      setShowEmail(providerProfile.showEmail !== false);
      setShowPhone(providerProfile.showPhone === true);
    } else if (userProfile) {
      setBusinessName(userProfile.displayName || '');
      setCountry(userProfile.country || 'United States');
      setCity(userProfile.city || '');
      setEmail(userProfile.email || '');
    }
  }, [providerProfile, userProfile, currentUser]);

  const handleToggleCategory = (slug: string) => {
    if (selectedCategories.includes(slug)) {
      if (selectedCategories.length === 1) return; // Keep at least one
      setSelectedCategories(selectedCategories.filter((s) => s !== slug));
    } else {
      setSelectedCategories([...selectedCategories, slug]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || businessName.trim().length < 2) {
      setErrorMsg('Business name must be at least 2 characters.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const parsedAreas = serviceAreas
        .split(',')
        .map((a) => a.trim())
        .filter((a) => a.length > 0);

      await updateProviderProfile({
        businessName: businessName.trim(),
        bio: bio.trim(),
        country,
        city: city.trim(),
        serviceAreas: parsedAreas.length > 0 ? parsedAreas : [city || country],
        categories: selectedCategories,
        phone: phone.trim() || undefined,
        email: email.trim() || currentUser?.email || '',
        website: website.trim() || undefined,
        showEmail,
        showPhone,
      });

      setSuccessMsg('Provider profile successfully updated!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to update provider profile.');
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate('/provider/dashboard')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Provider Dashboard
      </button>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-10">
        <div className="border-b border-slate-100 pb-6 mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Provider Business Profile
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Manage your business identity, service categories, and contact visibility
            </p>
          </div>
          {providerProfile?.isVerified && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Status
            </span>
          )}
        </div>

        {successMsg && (
          <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Business / Trade Name *
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Apex Global Solutions, Khan Motors, Horizon Studios"
              required
              className="w-full text-sm border border-slate-300 rounded-xl p-3 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Primary Country *
              </label>
              <CountrySelector value={country} onChange={setCountry} />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Headquarters City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. London, Dubai, Islamabad"
                className="w-full text-sm border border-slate-300 rounded-xl p-2.5 bg-white text-slate-900"
              />
            </div>
          </div>

          {/* Service Areas */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Service Areas (Comma-separated)
            </label>
            <input
              type="text"
              value={serviceAreas}
              onChange={(e) => setServiceAreas(e.target.value)}
              placeholder="e.g. Nationwide, Global / Remote, North America, Greater London"
              className="w-full text-sm border border-slate-300 rounded-xl p-2.5 bg-white text-slate-900"
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Offering Categories (Select all that apply) *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((c) => {
                const selected = selectedCategories.includes(c.slug);
                return (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => handleToggleCategory(c.slug)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border text-left transition flex items-center justify-between ${
                      selected
                        ? 'bg-blue-50 border-blue-600 text-blue-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{c.name}</span>
                    {selected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Company Overview & Experience
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe your capabilities, certifications, warranties, and team credentials..."
              className="w-full text-sm border border-slate-300 rounded-xl p-3 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          {/* Contact Details & Privacy */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Contact Channels & Privacy Preferences
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Public Contact Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900"
                />
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showEmail}
                    onChange={(e) => setShowEmail(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-[11px] text-slate-600">Show email on public profile</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Public Phone / WhatsApp
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 234 567 8900"
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900"
                />
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPhone}
                    onChange={(e) => setShowPhone(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-[11px] text-slate-600">Show phone on public profile</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Website URL</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourcompany.com"
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Save Provider Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
