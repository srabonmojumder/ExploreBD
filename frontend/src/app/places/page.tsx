'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApiClient, PlaceCategory } from '@/lib/api-client';
import { PlaceCard } from '@/components/places/PlaceCard';
import { SearchInput } from '@/components/shared/SearchInput';
import { Compass, RefreshCw, AlertCircle, Sparkles, Filter } from 'lucide-react';

const CATEGORIES: Array<{ label: string; value: string }> = [
  { label: 'All Categories', value: '' },
  { label: 'Waterfall', value: 'WATERFALL' },
  { label: 'Beach', value: 'BEACH' },
  { label: 'Hill', value: 'HILL' },
  { label: 'Forest', value: 'FOREST' },
  { label: 'Historical', value: 'HISTORICAL' },
  { label: 'Lake', value: 'LAKE' },
  { label: 'River', value: 'RIVER' },
  { label: 'Museum', value: 'MUSEUM' },
  { label: 'Religious', value: 'RELIGIOUS' },
  { label: 'Park', value: 'PARK' },
];

export default function PlacesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('rating');

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['places', selectedCategory, searchQuery, sortBy],
    queryFn: () =>
      ApiClient.getPlaces({
        category: selectedCategory || undefined,
        search: searchQuery || undefined,
        sortBy: sortBy || undefined,
      }),
  });

  const places = data?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
          <Sparkles className="w-4 h-4" />
          <span>Tourist Places Across Bangladesh</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Explore Tourist Destinations
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
          Discover breathtaking waterfalls, serene hill tracts, ancient heritage, and pristine beaches throughout the 64 districts of Bangladesh.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <SearchInput
            placeholder="Search places by name, keyword..."
            onSearch={setSearchQuery}
            className="w-full sm:w-80"
          />

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-slate-400 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Visited</option>
              <option value="newest">Recently Added</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.value;
            return (
              <button
                key={cat.label}
                type="button"
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/60 ring-1 ring-emerald-400'
                    : 'glass-card text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-sm text-slate-400">Loading tourist places...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="py-12 glass-card rounded-2xl p-8 border border-red-500/20 text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
          <div>
            <h3 className="font-bold text-white text-lg">Failed to load destinations</h3>
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
      {!isLoading && !isError && places.length === 0 && (
        <div className="py-16 glass-card rounded-2xl p-8 text-center space-y-3">
          <Compass className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="font-bold text-white text-lg">No tourist destinations found</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or selecting a different category filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Places Grid */}
      {!isLoading && !isError && places.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}
    </div>
  );
}
