'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '@/lib/api-client';
import { Database, Server, RefreshCw, CheckCircle2, AlertCircle, Cpu, Clock } from 'lucide-react';

export function ApiStatusCard() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['api-health'],
    queryFn: () => ApiClient.getHealth(),
    refetchInterval: 15000,
  });

  const health = data?.data;

  return (
    <div className="w-full glass-card rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  health?.database.connected ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${
                  health?.database.connected ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Phase 1 System Verification
            </h3>
          </div>
          <p className="text-sm text-slate-400 mt-0.5">
            Live communication between Next.js frontend, Express backend, and PostgreSQL
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-xs font-semibold text-slate-200 border border-white/5 transition-all self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isFetching ? 'animate-spin' : ''}`} />
          <span>{isFetching ? 'Checking...' : 'Refresh Status'}</span>
        </button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="py-8 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-sm text-slate-400">Pinging ExploreBD Backend and PostgreSQL...</p>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="py-6 flex items-start gap-3 bg-red-950/40 border border-red-500/20 rounded-xl p-4 my-4">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-red-300">Backend Communication Issue</p>
            <p className="text-red-400/80 mt-1">
              {error instanceof Error ? error.message : 'Unable to reach backend API.'}
            </p>
          </div>
        </div>
      )}

      {/* Success data state */}
      {health && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* Express API Service */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="flex items-center gap-1.5 font-medium">
                <Server className="w-3.5 h-3.5 text-emerald-400" />
                Backend API
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-lg font-bold text-white capitalize">{health.status}</div>
            <div className="text-[11px] text-emerald-400/90 font-mono">
              {health.app.name} v{health.app.version}
            </div>
          </div>

          {/* PostgreSQL Database */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="flex items-center gap-1.5 font-medium">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                Database
              </span>
              {health.database.connected ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-red-400" />
              )}
            </div>
            <div className="text-lg font-bold text-white uppercase">
              {health.database.provider}
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Latency: <span className="text-emerald-400 font-semibold">{health.database.responseTimeMs}ms</span>
            </div>
          </div>

          {/* Environment */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="flex items-center gap-1.5 font-medium">
                <Cpu className="w-3.5 h-3.5 text-teal-400" />
                Environment
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-teal-950 text-teal-300 font-medium">
                Active
              </span>
            </div>
            <div className="text-lg font-bold text-white capitalize">{health.environment}</div>
            <div className="text-[11px] text-slate-400 font-mono">Node.js ES2022</div>
          </div>

          {/* Server Uptime */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Server Uptime
              </span>
            </div>
            <div className="text-lg font-bold text-white font-mono">
              {Math.floor(health.uptime)}s
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              {new Date(health.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApiStatusCard;
