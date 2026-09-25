import React, { useState } from 'react';
import { CATEGORIES } from '../../constants/categories';
import { CURRENCIES } from '../../constants/countries';
import { CountrySelector } from '../common/CountrySelector';
import { Listing } from '../../types';
import { Tag, PlusCircle, Check, AlertCircle } from 'lucide-react';

interface ListingFormProps {
  initialValues?: Partial<Listing>;
  onSubmit: (formData: any) => Promise<void>;
  isEditing?: boolean;
}

export const ListingForm: React.FC<ListingFormProps> = ({
  initialValues,
  onSubmit,
  isEditing = false,
}) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [category, setCategory] = useState(initialValues?.category || 'products');
  const [country, setCountry] = useState(initialValues?.country || 'United States');
  const [city, setCity] = useState(initialValues?.city || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [price, setPrice] = useState<string>(initialValues?.price ? String(initialValues.price) : '');
  const [currency, setCurrency] = useState(initialValues?.currency || 'USD');
  const [condition, setCondition] = useState(initialValues?.condition || 'New');
  const [availability, setAvailability] = useState(initialValues?.availability || 'In Stock');
  const [active, setActive] = useState(initialValues?.active !== false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!title.trim() || title.trim().length < 5) {
      errs.title = 'Title must be at least 5 characters';
    }
    if (!description.trim() || description.trim().length < 20) {
      errs.description = 'Description must be at least 20 characters';
    }
    if (!country || country === 'all') {
      errs.country = 'Country is required';
    }
    if (!city.trim()) {
      errs.city = 'City is required';
    }
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      errs.price = 'Please enter a valid positive price';
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
        price: parseFloat(price),
        currency,
        condition,
        availability,
        active,
      });
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        form: err?.message || 'Failed to save listing. Please try again.',
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

      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
          Listing Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. 2021 Toyota Land Cruiser V8, MVP Software Sprint, Luxury Flat"
          className="w-full text-sm border border-slate-300 rounded-xl p-3 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
        />
        {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full text-sm border border-slate-300 rounded-xl p-2.5 bg-white text-slate-900"
          >
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
            Country *
          </label>
          <CountrySelector value={country} onChange={setCountry} />
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
            placeholder="e.g. Dubai, London, New York"
            className="w-full text-sm border border-slate-300 rounded-xl p-2.5 bg-white text-slate-900"
          />
          {errors.city && <p className="text-xs text-rose-600 mt-1">{errors.city}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
          Offering Description *
        </label>
        <textarea
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your product, service, warranty, specifications, condition, terms, and delivery options in full detail..."
          className="w-full text-sm border border-slate-300 rounded-xl p-3 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
        />
        {errors.description && <p className="text-xs text-rose-600 mt-1">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1">Price *</label>
          <input
            type="number"
            min="0"
            step="any"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 1500"
            className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 font-bold"
          />
          {errors.price && <p className="text-xs text-rose-600 mt-1">{errors.price}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Availability</label>
          <input
            type="text"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            placeholder="e.g. In Stock, 2-day turnaround"
            className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900"
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl">
        <div>
          <h4 className="text-xs font-bold text-slate-900">Listing Status</h4>
          <p className="text-xs text-slate-500">
            {active ? 'Visible to all customers in search' : 'Hidden from public searches'}
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm shadow-md transition flex items-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : isEditing ? (
            <Check className="w-4 h-4" />
          ) : (
            <PlusCircle className="w-4 h-4" />
          )}
          {isEditing ? 'Save Changes' : 'Create Listing'}
        </button>
      </div>
    </form>
  );
};
