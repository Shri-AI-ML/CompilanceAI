import React from "react";
import {
  FileText,
  Search,
  SlidersHorizontal,
  Plus,
  ArrowUpDown,
  MoreVertical,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const documents = [
  {
    id: "DOC-2026-001",
    name: "SOC2 Trust Services Criteria Policy.pdf",
    category: "Security",
    size: "2.4 MB",
    status: "Verified",
    updatedAt: "May 21, 2026",
    visibility: "Internal",
    author: "Elena Rostova",
  },
  {
    id: "DOC-2026-002",
    name: "ISO 27001 ISMS Boundary Blueprint.pdf",
    category: "Infrastructure",
    size: "4.8 MB",
    status: "Verified",
    updatedAt: "May 19, 2026",
    visibility: "Restricted",
    author: "Marc Verney",
  },
  {
    id: "DOC-2026-003",
    name: "GDPR Data Processing Agreement (DPA) 2026.docx",
    category: "Legal & Privacy",
    size: "1.1 MB",
    status: "Pending Evaluation",
    updatedAt: "May 22, 2026",
    visibility: "Internal",
    author: "Sarah Jenkins",
  },
  {
    id: "DOC-2026-004",
    name: "Employee Handbook Access Control Section.pdf",
    category: "HR & Ops",
    size: "820 KB",
    status: "Verified",
    updatedAt: "May 12, 2026",
    visibility: "Public",
    author: "Elena Rostova",
  },
];

export default function DocumentsPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            Documents Workspace
          </h1>
          <p className="text-zinc-400 text-sm">
            Central repository for compliance documentation, credentials, and policies.
          </p>
        </div>

        <button className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-100 text-zinc-950 hover:bg-zinc-200 transition-all shadow-sm">
          <Plus className="h-4 w-4" /> Upload Document
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search documents by name, standard, or author..."
            className="w-full bg-zinc-900/40 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-zinc-900/40 border border-zinc-800 text-zinc-300 hover:bg-zinc-850 hover:text-zinc-200 transition-colors">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-zinc-900/40 border border-zinc-800 text-zinc-300 hover:bg-zinc-850 hover:text-zinc-200 transition-colors">
            <ArrowUpDown className="h-3.5 w-3.5" /> Sort
          </button>
        </div>
      </div>

      {/* Grid of items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => {
          const isVerified = doc.status === "Verified";

          return (
            <div
              key={doc.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900/10 p-5 flex flex-col justify-between hover:border-zinc-700/80 transition-all group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-zinc-200 transition-colors">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">
                      {doc.category}
                    </span>
                    <button className="p-1 hover:bg-zinc-850 rounded-md text-zinc-500 hover:text-zinc-350 transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-1">
                  <h3 className="font-semibold text-sm text-zinc-100 group-hover:text-zinc-50 transition-colors truncate">
                    {doc.name}
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-mono">{doc.id}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-850 flex items-center justify-between text-[11px] text-zinc-400">
                <div className="flex items-center gap-1.5">
                  {isVerified ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-400/5 px-2 py-0.5 rounded-full border border-emerald-500/10">
                      <CheckCircle className="h-3 w-3" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-400/5 px-2 py-0.5 rounded-full border border-amber-500/10">
                      <AlertCircle className="h-3 w-3" /> Pending Evaluation
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-zinc-500">
                  <span className="font-medium">{doc.size}</span>
                  <span>•</span>
                  <span>Updated {doc.updatedAt}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
