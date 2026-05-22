"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useApiClient } from "@/lib/api";
import { useOrganization } from "@clerk/nextjs";
import {
  Search,
  Download,
  RefreshCw,
  AlertCircle,
  FileText,
  Loader2
} from "lucide-react";

interface AuditLog {
  id: string;
  organization_id: string | null;
  actor: string;
  action: string;
  resource: string;
  ip_address: string | null;
  status: string;
  integrity_hash: string;
  created_at: string;
}

export default function AuditLogsPage() {
  const { get } = useApiClient();
  const { organization } = useOrganization();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await get<{ items: AuditLog[]; total: number }>("/audit-logs");
      setLogs(data.items || []);
    } catch (err: unknown) {
      console.error("Failed to fetch audit logs:", err);
      const errMsg = err instanceof Error ? err.message : "Failed to retrieve audit logs from server.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  }, [get]);

  // Re-fetch when organization changes or component mounts
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLogs();
  }, [fetchLogs, organization?.id]);

  const handleExport = () => {
    if (logs.length === 0) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `compliance_audit_logs_${organization?.slug || "system"}_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toISOString().replace('T', ' ').substring(0, 19);
    } catch {
      return dateStr;
    }
  };

  const getInitials = (email: string) => {
    if (!email) return "??";
    return email.split("@")[0].substring(0, 2).toUpperCase();
  };

  // Filter logs locally based on search query and status filter
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || log.status.toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            System Activity Ledger
          </h1>
          <p className="text-zinc-400 text-sm">
            Immutable, cryptographic logs recording all operations within the platform workspace.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="inline-flex items-center justify-center p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 disabled:opacity-50 transition-colors"
            title="Refresh logs"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={handleExport}
            disabled={logs.length === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 hover:bg-zinc-850 hover:text-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <Download className="h-3.5 w-3.5" /> Export Logs
          </button>
        </div>
      </div>

      {/* Filter / Search Panel */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search logs by actor, action, or resource..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/40 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mr-1">Status:</span>
          {["ALL", "VERIFIED", "WARNING", "DENIED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                statusFilter === status
                  ? "bg-zinc-100 border-zinc-100 text-zinc-950 font-bold"
                  : "bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-4 text-red-200 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-semibold text-sm">Failed to load audit logs</h5>
            <p className="text-xs text-red-400/90">{error}</p>
            <button
              onClick={fetchLogs}
              className="mt-2 text-xs font-semibold text-red-300 underline hover:text-red-250 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Audit Log Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/40 text-zinc-400 font-semibold">
                <th className="p-4 w-[20%]">Timestamp</th>
                <th className="p-4 w-[25%]">Actor</th>
                <th className="p-4 w-[15%]">Action</th>
                <th className="p-4 w-[25%]">Resource</th>
                <th className="p-4 w-[15%] text-right">Integrity Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850 text-zinc-300 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
                      <span className="text-zinc-500 font-mono text-xs">Fetching cryptographic ledger...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-500 font-mono">
                    {logs.length === 0 ? (
                      <div className="flex flex-col items-center justify-center gap-2 py-4">
                        <FileText className="h-8 w-8 text-zinc-700" />
                        <span>No audit logs recorded for this organization.</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 py-4">
                        <Search className="h-8 w-8 text-zinc-700" />
                        <span>No logs matches the search and filter criteria.</span>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const statusLower = log.status.toLowerCase();
                  const isWarning = statusLower === "warning";
                  const isDenied = statusLower === "denied";

                  return (
                    <tr key={log.id} className="hover:bg-zinc-900/20 transition-colors group">
                      <td className="p-4 text-zinc-400 font-mono whitespace-nowrap">
                        {formatDate(log.created_at)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-300">
                            {getInitials(log.actor)}
                          </div>
                          <span className="truncate text-zinc-200 max-w-[180px]" title={log.actor}>
                            {log.actor}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded font-mono text-[10px] ${
                          isDenied
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : isWarning
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="p-4 truncate max-w-[200px] text-zinc-250" title={log.resource}>
                        {log.resource}
                      </td>
                      <td className="p-4 text-right text-zinc-500 font-mono text-[9px] select-all cursor-copy" title={log.integrity_hash}>
                        {log.integrity_hash.substring(0, 15)}...
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
