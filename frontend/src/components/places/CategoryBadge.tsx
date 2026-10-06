import React from 'react';
import { PlaceCategory } from '@/lib/api-client';
import { Waves, Mountain, Trees, Landmark, Sparkles, Building2, Church, Compass } from 'lucide-react';

interface CategoryBadgeProps {
  category: PlaceCategory;
  className?: string;
  size?: 'sm' | 'md';
}

const CATEGORY_CONFIG: Record<
  PlaceCategory,
  { label: string; icon: React.ElementType; color: string; bg: string; border: string }
> = {
  WATERFALL: {
    label: 'Waterfall',
    icon: Waves,
    color: 'text-cyan-400',
    bg: 'bg-cyan-950/60',
    border: 'border-cyan-500/20',
  },
  BEACH: {
    label: 'Beach',
    icon: Waves,
    color: 'text-amber-300',
    bg: 'bg-amber-950/60',
    border: 'border-amber-500/20',
  },
  HILL: {
    label: 'Hill',
    icon: Mountain,
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/60',
    border: 'border-emerald-500/20',
  },
  FOREST: {
    label: 'Forest',
    icon: Trees,
    color: 'text-green-400',
    bg: 'bg-green-950/60',
    border: 'border-green-500/20',
  },
  HISTORICAL: {
    label: 'Historical',
    icon: Landmark,
    color: 'text-amber-400',
    bg: 'bg-amber-950/60',
    border: 'border-amber-500/20',
  },
  MUSEUM: {
    label: 'Museum',
    icon: Building2,
    color: 'text-purple-400',
    bg: 'bg-purple-950/60',
    border: 'border-purple-500/20',
  },
  RELIGIOUS: {
    label: 'Religious',
    icon: Church,
    color: 'text-rose-400',
    bg: 'bg-rose-950/60',
    border: 'border-rose-500/20',
  },
  LAKE: {
    label: 'Lake',
    icon: Waves,
    color: 'text-blue-400',
    bg: 'bg-blue-950/60',
    border: 'border-blue-500/20',
  },
  RIVER: {
    label: 'River',
    icon: Waves,
    color: 'text-teal-400',
    bg: 'bg-teal-950/60',
    border: 'border-teal-500/20',
  },
  PARK: {
    label: 'Park',
    icon: Trees,
    color: 'text-emerald-300',
    bg: 'bg-emerald-950/60',
    border: 'border-emerald-500/20',
  },
  ADVENTURE: {
    label: 'Adventure',
    icon: Compass,
    color: 'text-orange-400',
    bg: 'bg-orange-950/60',
    border: 'border-orange-500/20',
  },
  RESORT: {
    label: 'Resort',
    icon: Sparkles,
    color: 'text-pink-400',
    bg: 'bg-pink-950/60',
    border: 'border-pink-500/20',
  },
  OTHER: {
    label: 'Destination',
    icon: Compass,
    color: 'text-slate-300',
    bg: 'bg-slate-900/60',
    border: 'border-slate-700/30',
  },
};

export function CategoryBadge({ category, className = '', size = 'sm' }: CategoryBadgeProps) {
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.OTHER;
  const Icon = config.icon;

  const sizeClasses =
    size === 'sm' ? 'px-2.5 py-0.5 text-[11px] gap-1.5' : 'px-3 py-1 text-xs gap-2 font-medium';

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${config.color} ${config.border} ${sizeClasses} ${className}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
    </span>
  );
}

export default CategoryBadge;
