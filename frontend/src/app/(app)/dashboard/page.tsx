import React from "react";
import {
  Shield,
  AlertTriangle,
  Zap,
  Activity,
  ArrowUpRight,
  TrendingUp,
  FileCheck,
  Clock,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    name: "Verification Score",
    value: "98.4%",
    change: "+0.6% from last week",
    icon: Shield,
    color: "text-emerald-500 bg-emerald-500/10",
  },
  {
    name: "Policy Incidents",
    value: "3",
    change: "-12% from last week",
    icon: AlertTriangle,
    color: "text-amber-500 bg-amber-500/10",
  },
  {
    name: "Automated Rules",
    value: "142",
    change: "+8 new rules active",
    icon: Zap,
    color: "text-indigo-500 bg-indigo-500/10",
  },
  {
    name: "Audit Coverage",
    value: "99.9%",
    change: "System fully covered",
    icon: Activity,
    color: "text-blue-500 bg-blue-500/10",
  },
];

const activityTimeline = [
  {
    id: 1,
    title: "AI policy evaluation completed",
    description: "Evaluated 12 documents against SOC2 CC6.1 protocol",
    time: "4 minutes ago",
    status: "success",
  },
  {
    id: 2,
    title: "Anomalous file access detected",
    description: "Multi-factor verification bypass attempt on document DOC-2026-X",
    time: "2 hours ago",
    status: "warning",
  },
  {
    id: 3,
    title: "Automated workflow triggered",
    description: "GDPR compliance audit dispatched for user access review",
    time: "4 hours ago",
    status: "info",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Upper header block with gradient text */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            Control Room
          </h1>
          <p className="text-zinc-400 text-sm">
            Overview of the compliance status and activity across your organization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/documents"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 hover:bg-zinc-850 hover:text-zinc-50 transition-all shadow-sm"
          >
            Review Documents
          </Link>
          <Link
            href="/workflows"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-100 text-zinc-950 hover:bg-zinc-200 transition-all shadow-sm"
          >
            Run Audit Pipeline <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Grid Stats Block */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/20 p-5 shadow-sm transition-all hover:border-zinc-700/80"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400 tracking-wide uppercase">
                  {stat.name}
                </span>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-bold tracking-tight text-zinc-100">
                  {stat.value}
                </span>
                <span className="block mt-1 text-[10px] font-medium text-zinc-500">
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Side: Compliance Heatmap & Policy Monitor */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-zinc-100 text-base">System Coverage Heatmap</h3>
                <p className="text-xs text-zinc-400">Weekly audit compliance check intervals.</p>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                All Systems Nominal
              </span>
            </div>

            {/* Premium Mock Grid representing check coverage */}
            <div className="grid grid-cols-7 gap-2.5">
              {Array.from({ length: 28 }).map((_, i) => {
                let opacity = "bg-zinc-850";
                if (i % 7 === 0) opacity = "bg-emerald-950 border border-emerald-900/50";
                else if (i % 5 === 0) opacity = "bg-emerald-600/20 border border-emerald-500/30";
                else if (i % 3 === 0) opacity = "bg-emerald-700/40 border border-emerald-600/40";
                else if (i === 22) opacity = "bg-amber-600/20 border border-amber-500/30";
                else opacity = "bg-emerald-500/50 border border-emerald-400/30";

                return (
                  <div
                    key={i}
                    className={`h-12 rounded-lg transition-all hover:scale-105 duration-200 cursor-pointer ${opacity}`}
                    title={`Day ${i + 1}: Fully verified`}
                  />
                );
              })}
            </div>

            <div className="flex justify-between items-center mt-4 text-[10px] text-zinc-500 font-medium">
              <span>28 Days Ago</span>
              <div className="flex items-center gap-1.5">
                <span>Critical</span>
                <span className="w-2.5 h-2.5 rounded bg-amber-600/20 border border-amber-500/30" />
                <span className="w-2.5 h-2.5 rounded bg-emerald-950 border border-emerald-900/50" />
                <span className="w-2.5 h-2.5 rounded bg-emerald-600/20 border border-emerald-500/30" />
                <span className="w-2.5 h-2.5 rounded bg-emerald-500/50 border border-emerald-400/30" />
                <span>Verified</span>
              </div>
              <span>Today</span>
            </div>
          </div>

          {/* Active Policies Table */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-6">
            <h3 className="font-bold text-zinc-100 text-base mb-4">Core Governance Protocols</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 font-semibold">
                    <th className="pb-3 w-[40%]">Protocol</th>
                    <th className="pb-3 w-[20%]">Standard</th>
                    <th className="pb-3 w-[20%]">Status</th>
                    <th className="pb-3 w-[20%] text-right">Audit Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850 text-zinc-300">
                  <tr className="group">
                    <td className="py-3.5 font-medium text-zinc-100 flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-emerald-500" /> SOC 2 Type II Security
                    </td>
                    <td className="py-3.5 text-zinc-400">AICPA TSC 2017</td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-400/5 border border-emerald-500/10 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="h-3 w-3" /> Compliant
                      </span>
                    </td>
                    <td className="py-3.5 text-right text-zinc-500 font-medium">May 21, 2026</td>
                  </tr>
                  <tr className="group">
                    <td className="py-3.5 font-medium text-zinc-100 flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-emerald-500" /> ISO/IEC 27001:2022
                      <span className="text-[9px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.2 rounded">AI-Scoped</span>
                    </td>
                    <td className="py-3.5 text-zinc-400">ISO Annex A</td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-400/5 border border-emerald-500/10 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="h-3 w-3" /> Compliant
                      </span>
                    </td>
                    <td className="py-3.5 text-right text-zinc-500 font-medium">May 19, 2026</td>
                  </tr>
                  <tr className="group">
                    <td className="py-3.5 font-medium text-zinc-100 flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-amber-500" /> GDPR Data Protection
                    </td>
                    <td className="py-3.5 text-zinc-400">Regulation 2016/679</td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-400/5 border border-amber-500/10 px-2.5 py-0.5 rounded-full">
                        <Clock className="h-3 w-3 animate-pulse" /> Evaluating
                      </span>
                    </td>
                    <td className="py-3.5 text-right text-zinc-500 font-medium">May 22, 2026</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Activity Ledger Timeline */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-6 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-zinc-100 text-base">Real-time Signals</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>

              <div className="relative border-l border-zinc-850 pl-4 ml-2 space-y-6">
                {activityTimeline.map((item) => {
                  let statusGlow = "bg-indigo-500";
                  if (item.status === "warning") statusGlow = "bg-amber-500";
                  if (item.status === "success") statusGlow = "bg-emerald-500";

                  return (
                    <div key={item.id} className="relative group">
                      {/* Timeline dot */}
                      <span
                        className={`absolute -left-[21px] top-1.5 flex h-2 w-2 rounded-full ring-4 ring-zinc-950 ${statusGlow}`}
                      />
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-zinc-200 group-hover:text-zinc-50 transition-colors">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          {item.description}
                        </p>
                        <span className="block text-[9px] text-zinc-500 font-semibold tracking-wide uppercase">
                          {item.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Link
              href="/audit-logs"
              className="mt-6 inline-flex items-center justify-center gap-1.5 w-full py-2.5 text-xs font-semibold rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 hover:bg-zinc-850 hover:text-zinc-50 transition-all text-center"
            >
              Open Audit Ledger <TrendingUp className="h-3 w-3 ml-1 text-zinc-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
