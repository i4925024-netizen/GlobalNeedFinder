import React from 'react';
import { CATEGORIES } from '../constants/categories';
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

interface CategoriesPageProps {
  navigate: (path: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ navigate }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Package':
        return <Package className="w-8 h-8 text-blue-600" />;
      case 'Wrench':
        return <Wrench className="w-8 h-8 text-indigo-600" />;
      case 'Building2':
        return <Building2 className="w-8 h-8 text-emerald-600" />;
      case 'Car':
        return <Car className="w-8 h-8 text-sky-600" />;
      case 'Briefcase':
        return <Briefcase className="w-8 h-8 text-amber-600" />;
      case 'Globe':
        return <Globe className="w-8 h-8 text-teal-600" />;
      case 'Shirt':
        return <Shirt className="w-8 h-8 text-purple-600" />;
      case 'Smartphone':
        return <Smartphone className="w-8 h-8 text-blue-500" />;
      case 'Plane':
        return <Plane className="w-8 h-8 text-rose-500" />;
      case 'Compass':
      default:
        return <Compass className="w-8 h-8 text-violet-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Explore All Categories
        </h1>
        <p className="mt-3 text-base text-slate-500">
          Find requirements, suppliers, and skilled professionals across 10 core global verticals
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.slug}
            onClick={() => navigate(`/category/${cat.slug}`)}
            className="group bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 p-6 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-slate-50 group-hover:bg-blue-50 border border-slate-200 group-hover:border-blue-200 flex items-center justify-center mb-5 transition transform group-hover:scale-105">
                {getIcon(cat.iconName)}
              </div>

              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">
                {cat.name}
              </h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                {cat.description}. Discover customer requests and provider offerings in {cat.name.toLowerCase()}.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition flex items-center gap-1">
                Explore {cat.name} <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
