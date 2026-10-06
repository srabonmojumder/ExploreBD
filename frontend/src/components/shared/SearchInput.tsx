'use client';

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  debounceMs?: number;
  initialValue?: string;
  className?: string;
}

export function SearchInput({
  placeholder = 'Search destinations, districts...',
  onSearch,
  debounceMs = 350,
  initialValue = '',
  className = '',
}: SearchInputProps) {
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(query);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [query, debounceMs, onSearch]);

  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-white transition-colors"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

export default SearchInput;
