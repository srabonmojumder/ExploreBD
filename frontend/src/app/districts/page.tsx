'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '@/lib/api-client';
import { DistrictCard } from '@/components/districts/DistrictCard';
import { SearchInput } from '@/components/shared/SearchInput';
import { MapPin, RefreshCw, AlertCircle, Layers, Sparkles } from 'lucide-react';

const DIVISIONS = [
  { label: 'All Divisions', slug: '' },
  { label: 'Chattogram', slug: 'chattogram' },
  { label: 'Sylhet', slug: 'sylhet' },
  { label: 'Dhaka', slug: 'dhaka' },
  { label: 'Khulna', slug: 'khulna' },
  { label: 'Rajshahi', slug: 'rajshahi' },
  { label: 'Barishal', slug: 'barishal' },
  { label: 'Rangpur', slug: 'rangpur' },
  { label: 'Mymensingh', slug: 'mymensingh' },
];

function DistrictsContent() {
  const searchParams = useSearchParams();
  const divisionParam = searchParams.get('division') || '';

  const [selectedDivision, setSelectedDivision] = useState(divisionParam);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (divisionParam) {
      setSelectedDivision(divisionParam);
    }
  }, [divisionParam]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['districts', selectedDivision, searchQuery],
    queryFn: () =>
      ApiClient.getDistricts({
        division: selectedDivision || undefined,
        search: searchQuery || undefined,
      }),
  });

  const districts = data?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
          <MapPin className="w-4 h-4" />
          <span>Administrative Map of Bangladesh</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Explore All 64 Districts
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
          From the southern beaches of Cox&apos;s Bazar to the northern teas of Panchagarh. Select any district to view its places and track your journey.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2">
        {/* Division Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {DIVISIONS.map((div) => {
            const isActive = selectedDivision === div.slug;
            return (
              <button
                key={div.label}
                type="button"
                onClick={() => setSelectedDivision(div.slug)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/60 ring-1 ring-emerald-400'
                    : 'glass-card text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {div.label}
              </button>
            );
          })}
        </div>

        {/* Debounced Search Input */}
        <SearchInput
          placeholder="Search district name..."
          onSearch={setSearchQuery}
          className="w-full md:w-72"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-sm text-slate-400">Loading Bangladesh districts...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="py-12 glass-card rounded-2xl p-8 border border-red-500/20 text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
          <div>
            <h3 className="font-bold text-white text-lg">Failed to load districts</h3>
            <p className="text-sm text-red-300/80 mt-1">
              {error instanceof Error ? error.message : 'An error occurred'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && districts.length === 0 && (
        <div className="py-16 glass-card rounded-2xl p-8 text-center space-y-3">
          <Layers className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="font-bold text-white text-lg">No districts match your filter</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            Try clearing your search query or selecting &quot;All Divisions&quot;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedDivision('');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Districts Grid */}
      {!isLoading && !isError && districts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {districts.map((district) => (
            <DistrictCard key={district.id} district={district} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DistrictsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-sm text-slate-400">Loading districts...</p>
        </div>
      }
    >
      <DistrictsContent />
    </Suspense>
  );
}
