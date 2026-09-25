import React from 'react';
import { CATEGORIES } from '../../constants/categories';
import {
  Package,
  Wrench,
  Building2,
  Car,
  Briefcase,
  Globe,
  Shirt,
  Smartphone,
  Plane,
  Compass,
  ArrowRight,
} from 'lucide-react';

interface CategoryGridProps {
  onSelectCategory: (slug: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Package':
        return <Package className="w-6 h-6 text-blue-600" />;
      case 'Wrench':
        return <Wrench className="w-6 h-6 text-indigo-600" />;
      case 'Building2':
        return <Building2 className="w-6 h-6 text-emerald-600" />;
      case 'Car':
        return <Car className="w-6 h-6 text-sky-600" />;
      case 'Briefcase':
        return <Briefcase className="w-6 h-6 text-amber-600" />;
      case 'Globe':
        return <Globe className="w-6 h-6 text-teal-600" />;
      case 'Shirt':
        return <Shirt className="w-6 h-6 text-purple-600" />;
      case 'Smartphone':
        return <Smartphone className="w-6 h-6 text-blue-500" />;
      case 'Plane':
        return <Plane className="w-6 h-6 text-rose-500" />;
      case 'Compass':
      default:
        return <Compass className="w-6 h-6 text-violet-600" />;
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore by Category
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Browse requirements and providers across popular global industries
            </p>
          </div>
          <button
            onClick={() => onSelectCategory('all')}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
          >
            All Categories <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.slug}
              onClick={() => onSelectCategory(cat.slug)}
              className="group bg-slate-50/80 hover:bg-white rounded-xl border border-slate-200/80 hover:border-blue-400 p-4 sm:p-5 text-center cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 flex flex-col items-center justify-center select-none"
            >
              <div className="w-12 h-12 rounded-xl bg-white group-hover:bg-blue-50 border border-slate-200 group-hover:border-blue-200 flex items-center justify-center mb-3 shadow-2xs group-hover:scale-110 transition transform">
                {getIcon(cat.iconName)}
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition truncate w-full">
                {cat.name}
              </h3>
              <p className="mt-1 text-[11px] text-slate-500 line-clamp-1">
                {cat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
