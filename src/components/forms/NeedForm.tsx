import React, { useState } from 'react';
import { CATEGORIES } from '../../constants/categories';
import { CURRENCIES } from '../../constants/countries';
import { CountrySelector } from '../common/CountrySelector';
import { Need, UrgencyLevel } from '../../types';
import { AlertCircle, PlusCircle, Check } from 'lucide-react';

interface NeedFormProps {
  initialValues?: Partial<Need>;
  onSubmit: (formData: any) => Promise<void>;
  isEditing?: boolean;
}

export const NeedForm: React.FC<NeedFormProps> = ({
  initialValues,
  onSubmit,
  isEditing = false,
}) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [category, setCategory] = useState(initialValues?.category || 'products');
  const [country, setCountry] = useState(initialValues?.country || 'United States');
  const [city, setCity] = useState(initialValues?.city || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [budgetMin, setBudgetMin] = useState<string>(
    initialValues?.budgetMin ? String(initialValues.budgetMin) : ''
  );
  const [budgetMax, setBudgetMax] = useState<string>(
    initialValues?.budgetMax ? String(initialValues.budgetMax) : ''
  );
  const [currency, setCurrency] = useState(initialValues?.currency || 'USD');
  const [preferredCondition, setPreferredCondition] = useState(
    initialValues?.preferredCondition || 'Any / Not Applicable'
  );
  const [urgency, setUrgency] = useState<UrgencyLevel>(initialValues?.urgency || 'medium');
  const [expiryDate, setExpiryDate] = useState(initialValues?.expiryDate || '');
  const [contactPreference, setContactPreference] = useState(
    initialValues?.contactPreference || 'NeedFinder In-App Messaging'
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!title.trim()) {
      errs.title = 'Title is required';
    } else if (title.trim().length < 5) {
      errs.title = 'Title must be at least 5 characters';
    } else if (title.trim().length > 120) {
      errs.title = 'Title cannot exceed 120 characters';
    }

    if (!category) {
      errs.category = 'Please select a category';
    }

    if (!country || country === 'all') {
      errs.country = 'Country is required';
    }

    if (!city.trim()) {
      errs.city = 'City is required';
    }

    if (!description.trim()) {
      errs.description = 'Description is required';
    } else if (description.trim().length < 20) {
      errs.description = 'Description must be at least 20 characters';
    } else if (description.trim().length > 3000) {
      errs.description = 'Description cannot exceed 3000 characters';
    }

    const minNum = budgetMin ? parseFloat(budgetMin) : undefined;
    const maxNum = budgetMax ? parseFloat(budgetMax) : undefined;

    if (minNum !== undefined && (isNaN(minNum) || minNum < 0)) {
      errs.budgetMin = 'Minimum budget must be a positive number';
    }

    if (maxNum !== undefined && (isNaN(maxNum) || maxNum < 0)) {
      errs.budgetMax = 'Maximum budget must be a positive number';
    }

    if (minNum !== undefined && maxNum !== undefined && minNum > maxNum) {
      errs.budgetMax = 'Maximum budget cannot be less than minimum budget';
    }

    if (expiryDate) {
      const selected = new Date(expiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        errs.expiryDate = 'Expiry date must be in the future';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        title: title.trim(),
        category,
        country,
        city: city.trim(),
        description: description.trim(),
        budgetMin: budgetMin ? parseFloat(budgetMin) : undefined,
        budgetMax: budgetMax ? parseFloat(budgetMax) : undefined,
        currency,
        preferredCondition,
        urgency,
        expiryDate: expiryDate || undefined,
        contactPreference,
      });
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        form: err?.message || 'Failed to submit requirement. Please try again.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.form && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errors.form}</span>
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
          Requirement Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Used Toyota Corolla 2018-2022, React Native Developer, 2BHK Dubai Marina"
          className={`w-full text-sm border rounded-xl p-3 text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
            errors.title
              ? 'border-rose-300 focus:ring-rose-500/20'
              : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-600'
          }`}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.title ? (
            <span className="text-xs text-rose-600">{errors.title}</span>
          ) : (
            <span className="text-[11px] text-slate-400">
              Clear titles attract accurate provider quotes (5-120 chars)
            </span>
          )}
          <span className="text-[11px] text-slate-400">{title.length}/120</span>
        </div>
      </div>

      {/* Category & Location */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full text-sm border border-slate-300 rounded-xl p-2.5 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          >
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-xs text-rose-600 mt-1">{errors.category}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
            Country *
          </label>
          <CountrySelector
            value={country}
            onChange={(c) => setCountry(c)}
            placeholder="Select country"
          />
          {errors.country && <p className="text-xs text-rose-600 mt-1">{errors.country}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
            City *
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Islamabad, London, New York"
            className={`w-full text-sm border rounded-xl p-2.5 bg-white text-slate-900 focus:ring-2 ${
              errors.city
                ? 'border-rose-300 focus:ring-rose-500/20'
                : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-600'
            }`}
          />
          {errors.city && <p className="text-xs text-rose-600 mt-1">{errors.city}</p>}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
          Detailed Description *
        </label>
        <textarea
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your requirement in detail: dimensions, brand preference, quantity, timelines, specifications, conditions, and any other relevant requirements..."
          className={`w-full text-sm border rounded-xl p-3 text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
            errors.description
              ? 'border-rose-300 focus:ring-rose-500/20'
              : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-600'
          }`}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.description ? (
            <span className="text-xs text-rose-600">{errors.description}</span>
          ) : (
            <span className="text-[11px] text-slate-400">Min 20 characters, up to 3000</span>
          )}
          <span className="text-[11px] text-slate-400">{description.length}/3000</span>
        </div>
      </div>

      {/* Budget Fields */}
      <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Budget & Financials (Optional)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Minimum Budget
            </label>
            <input
              type="number"
              min="0"
              value={budgetMin}
              onChange={(e) => setBudgetMin(e.target.value)}
              placeholder="e.g. 1000"
              className="w-full text-sm border border-slate-300 rounded-lg p-2 bg-white text-slate-900"
            />
            {errors.budgetMin && <p className="text-xs text-rose-600 mt-1">{errors.budgetMin}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Maximum Budget
            </label>
            <input
              type="number"
              min="0"
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value)}
              placeholder="e.g. 5000"
              className="w-full text-sm border border-slate-300 rounded-lg p-2 bg-white text-slate-900"
            />
            {errors.budgetMax && <p className="text-xs text-rose-600 mt-1">{errors.budgetMax}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-lg p-2 bg-white text-slate-900"
            >
              {CURRENCIES.map((cur) => (
                <option key={cur} value={cur}>
                  {cur}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Condition Preference
          </label>
          <select
            value={preferredCondition}
            onChange={(e) => setPreferredCondition(e.target.value)}
            className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900"
          >
            <option value="Any / Not Applicable">Any / Not Applicable</option>
            <option value="Brand New Only">Brand New Only</option>
            <option value="Used - Excellent / Like New">Used - Excellent / Like New</option>
            <option value="Used - Good Condition">Used - Good Condition</option>
            <option value="Refurbished">Refurbished</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Urgency</label>
          <select
            value={urgency}
            onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
            className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900"
          >
            <option value="low">Low (Flexible timeline)</option>
            <option value="medium">Medium (Within a couple of weeks)</option>
            <option value="high">High (Urgent within days)</option>
            <option value="urgent">Urgent (Immediate response needed)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Expiry Date</label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900"
          />
          {errors.expiryDate && <p className="text-xs text-rose-600 mt-1">{errors.expiryDate}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
          Contact Preference
        </label>
        <select
          value={contactPreference}
          onChange={(e) => setContactPreference(e.target.value)}
          className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900"
        >
          <option value="NeedFinder In-App Messaging">
            NeedFinder In-App Messaging (Recommended & Secure)
          </option>
          <option value="Direct Phone & In-App">Direct Phone & In-App</option>
          <option value="Email & In-App">Email & In-App</option>
        </select>
      </div>

      {/* Submit Button */}
      <div className="pt-4 flex items-center justify-end gap-4 border-t border-slate-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition flex items-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : isEditing ? (
            <Check className="w-4 h-4" />
          ) : (
            <PlusCircle className="w-4 h-4" />
          )}
          {isEditing ? 'Save Changes' : 'Publish Requirement'}
        </button>
      </div>
    </form>
  );
};
