import React, { useState, useRef, useEffect } from 'react';
import { COUNTRIES, Country } from '../../constants/countries';
import { ChevronDown, Search, X } from 'lucide-react';

interface CountrySelectorProps {
  value: string;
  onChange: (countryName: string) => void;
  placeholder?: string;
  includeAllOption?: boolean;
  className?: string;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  value,
  onChange,
  placeholder = 'Select country',
  includeAllOption = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCountries = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedDisplay = value
    ? value === 'all'
      ? 'All Countries'
      : value
    : placeholder;

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg shadow-xs text-sm text-slate-800 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
      >
        <span className={`truncate ${!value ? 'text-slate-400' : 'text-slate-900 font-medium'}`}>
          {selectedDisplay}
        </span>
        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-slate-200 rounded-lg shadow-xl max-h-72 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100">
          <div className="p-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50/70">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search countries..."
              className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
              autoFocus
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="overflow-y-auto max-h-60 p-1 divide-y divide-slate-50">
            {includeAllOption && (
              <button
                type="button"
                onClick={() => {
                  onChange('all');
                  setIsOpen(false);
                  setSearch('');
                }}
                className={`w-full text-left px-3 py-2 text-xs rounded-md transition ${
                  value === 'all' || !value
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                🌍 All Countries
              </button>
            )}

            {filteredCountries.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  onChange(c.name);
                  setIsOpen(false);
                  setSearch('');
                }}
                className={`w-full text-left px-3 py-2 text-xs rounded-md transition flex items-center justify-between ${
                  value === c.name
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{c.name}</span>
                <span className="text-[10px] text-slate-400 uppercase font-mono">{c.code}</span>
              </button>
            ))}

            {filteredCountries.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-400">No countries found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
