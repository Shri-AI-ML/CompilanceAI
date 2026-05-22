import React from "react";
import {
  GitBranch,
  Play,
  Settings2,
  CheckCircle2,
  XCircle,
  Plus
} from "lucide-react";

const workflows = [
  {
    id: "WF-001",
    name: "SOC2 Compliance Verification Gathering",
    trigger: "Schedule (Every 24h)",
    actions: "12 nodes",
    status: "Active",
    lastRun: "Success",
    lastRunTime: "2 hours ago",
    reliability: "100%",
  },
  {
    id: "WF-002",
    name: "GDPR Right to be Forgotten Evaluation",
    trigger: "Webhook Trigger",
    actions: "8 nodes",
    status: "Active",
    lastRun: "Success",
    lastRunTime: "1 day ago",
    reliability: "98.4%",
  },
  {
    id: "WF-003",
    name: "ISO 27001 Annex A.9 Access Control Audit",
    trigger: "Manual Run",
    actions: "15 nodes",
    status: "Paused",
    lastRun: "Failed",
    lastRunTime: "3 days ago",
    reliability: "92.1%",
  },
];

export default function WorkflowsPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            Automated Workflows
          </h1>
          <p className="text-zinc-400 text-sm">
            Build and monitor compliance evaluation pipelines triggered by system events or schedules.
          </p>
        </div>

        <button className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-100 text-zinc-950 hover:bg-zinc-200 transition-all shadow-sm">
          <Plus className="h-4 w-4" /> Create Workflow
        </button>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-zinc-800 rounded-xl p-5 bg-zinc-900/10">
          <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Active Pipelines</span>
          <h3 className="text-2xl font-bold mt-2 text-zinc-100">8</h3>
        </div>
        <div className="border border-zinc-800 rounded-xl p-5 bg-zinc-900/10">
          <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Success Rate</span>
          <h3 className="text-2xl font-bold mt-2 text-emerald-400">99.8%</h3>
        </div>
        <div className="border border-zinc-800 rounded-xl p-5 bg-zinc-900/10">
          <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Executions (24h)</span>
          <h3 className="text-2xl font-bold mt-2 text-zinc-100">1,480</h3>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {workflows.map((wf) => {
          const isActive = wf.status === "Active";
          const isSuccess = wf.lastRun === "Success";

          return (
            <div
              key={wf.id}
              className="border border-zinc-800 rounded-xl bg-zinc-900/20 hover:border-zinc-700/80 transition-all p-5 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-zinc-900 border border-zinc-850 rounded-lg text-zinc-400 mt-1">
                  <GitBranch className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-zinc-100 flex items-center gap-2">
                    {wf.name}
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-zinc-850 text-zinc-400 border border-zinc-800"
                      }`}
                    >
                      {wf.status}
                    </span>
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                    <span className="font-medium">{wf.id}</span>
                    <span>•</span>
                    <span>Trigger: {wf.trigger}</span>
                    <span>•</span>
                    <span>{wf.actions}</span>
                  </div>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-zinc-855">
                <div className="text-left md:text-right">
                  <div className="flex items-center md:justify-end gap-1.5 text-xs">
                    <span className="text-zinc-500 font-medium">Last Run:</span>
                    {isSuccess ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Success
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-semibold text-rose-455">
                        <XCircle className="h-3.5 w-3.5" /> Failed
                      </span>
                    )}
                  </div>
                  <span className="block text-[10px] text-zinc-500 font-medium mt-1">
                    Executed {wf.lastRunTime} (Reliability {wf.reliability})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-zinc-850 border border-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-200 transition-colors">
                    <Settings2 className="h-4 w-4" />
                  </button>
                  <button className="p-2 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-zinc-950 transition-colors">
                    <Play className="h-4 w-4 fill-current" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
