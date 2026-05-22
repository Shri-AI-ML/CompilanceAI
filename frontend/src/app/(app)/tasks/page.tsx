import React from "react";
import {
  User,
  ChevronRight,
  Filter,
  CheckCircle2,
  Calendar
} from "lucide-react";

const tasks = [
  {
    id: "TSK-084",
    title: "Verify Vendor Security Assessment (Auth0 / Okta Integration)",
    priority: "High",
    dueDate: "Today",
    assignedTo: "Elena Rostova",
    status: "Open",
    protocol: "SOC 2 CC6.3",
  },
  {
    id: "TSK-085",
    title: "Review GDPR Data Subject Access Request (DSAR) log",
    priority: "Medium",
    dueDate: "May 25, 2026",
    assignedTo: "Sarah Jenkins",
    status: "In Progress",
    protocol: "GDPR Art 15",
  },
  {
    id: "TSK-086",
    title: "Perform annual Access Review for AWS Production root accounts",
    priority: "Critical",
    dueDate: "Immediate",
    assignedTo: "Marc Verney",
    status: "Open",
    protocol: "ISO 27001 A.9.2.1",
  },
  {
    id: "TSK-087",
    title: "Re-verify Disaster Recovery policy signatures",
    priority: "Low",
    dueDate: "June 2, 2026",
    assignedTo: "Unassigned",
    status: "Open",
    protocol: "SOC 2 CC7.5",
  },
];

export default function TasksPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            Auditor Tasks
          </h1>
          <p className="text-zinc-400 text-sm">
            Review, allocate, and certify manual compliance action items across frameworks.
          </p>
        </div>

        <button className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-100 text-zinc-950 hover:bg-zinc-200 transition-all shadow-sm">
          Add Task
        </button>
      </div>

      {/* Tabs / Filters */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex gap-4 text-xs font-semibold">
          <button className="text-zinc-100 border-b border-zinc-100 pb-3 -mb-3.5 transition-colors">
            All Tasks (4)
          </button>
          <button className="text-zinc-500 hover:text-zinc-300 pb-3 transition-colors">
            Assigned to Me (1)
          </button>
          <button className="text-zinc-500 hover:text-zinc-300 pb-3 transition-colors">
            Pending Review (0)
          </button>
        </div>

        <button className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors">
          <Filter className="h-3.5 w-3.5" /> Filters
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.map((task) => {
          let priorityStyle = "text-zinc-400 bg-zinc-900 border-zinc-800";
          if (task.priority === "Critical") priorityStyle = "text-rose-400 bg-rose-950/20 border-rose-900/35";
          if (task.priority === "High") priorityStyle = "text-amber-400 bg-amber-955/20 border-amber-900/35";

          return (
            <div
              key={task.id}
              className="border border-zinc-800 rounded-xl bg-zinc-900/10 hover:border-zinc-700/80 transition-all p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <button className="p-1 mt-0.5 rounded border border-zinc-800 bg-zinc-950 text-transparent hover:text-zinc-400 hover:border-zinc-600 transition-all flex items-center justify-center h-5 w-5">
                  <CheckCircle2 className="h-4.5 w-4.5" />
                </button>

                <div className="space-y-1.5 flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-zinc-200 group-hover:text-zinc-100 transition-colors leading-snug">
                    {task.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-zinc-500">
                    <span className="font-semibold text-zinc-400 font-mono">{task.id}</span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-zinc-400">
                      {task.protocol}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3 text-zinc-650" /> {task.assignedTo}
                    </span>
                  </div>
                </div>
              </div>

              {/* Badges & Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-850">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${priorityStyle}`}>
                  {task.priority}
                </span>

                <div className="flex items-center gap-4 text-xs text-zinc-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> {task.dueDate}
                  </span>
                  <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-450 transition-colors" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
