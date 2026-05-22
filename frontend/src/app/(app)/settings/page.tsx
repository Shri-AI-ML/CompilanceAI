import React from "react";
import {
  Building,
  User,
  ShieldAlert,
  Key,
  CreditCard,
  Check
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
          Platform Settings
        </h1>
        <p className="text-zinc-400 text-sm">
          Manage your organization structure, governance controls, API keys, and account parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Navigation Links */}
        <div className="lg:col-span-3 space-y-1">
          <button className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-xs font-semibold rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 transition-colors">
            <Building className="h-4 w-4" /> Organization Details
          </button>
          <button className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-xs font-semibold rounded-lg text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200 transition-colors">
            <User className="h-4 w-4" /> User Profile
          </button>
          <button className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-xs font-semibold rounded-lg text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200 transition-colors">
            <Key className="h-4 w-4" /> API Connections
          </button>
          <button className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-xs font-semibold rounded-lg text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200 transition-colors">
            <ShieldAlert className="h-4 w-4" /> Policy Guardrails
          </button>
          <button className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-xs font-semibold rounded-lg text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200 transition-colors">
            <CreditCard className="h-4 w-4" /> Subscription & Billing
          </button>
        </div>

        {/* Right Side: Detail Panel */}
        <div className="lg:col-span-9 space-y-6">
          {/* Org details pane */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/10 p-6 space-y-6">
            <div>
              <h3 className="font-bold text-zinc-100 text-base">Organization Parameters</h3>
              <p className="text-xs text-zinc-400">Configure public identifier tags and metadata structures.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Company Legal Name</label>
                <input
                  type="text"
                  defaultValue="ComplianceOS AI Inc."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Workspace Subdomain</label>
                <div className="flex rounded-lg overflow-hidden border border-zinc-800">
                  <input
                    type="text"
                    defaultValue="complianceos"
                    className="flex-1 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:outline-none transition-all font-medium border-none"
                  />
                  <span className="bg-zinc-900 border-l border-zinc-800 px-3 py-2 text-[10px] font-bold text-zinc-500 flex items-center">
                    .complianceos.ai
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Active Regulatory Frameworks</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                {["SOC 2 Type II", "ISO 27001:2022", "GDPR (Privacy)", "HIPAA Security Rule"].map((fw) => (
                  <div key={fw} className="flex items-center gap-2.5 p-3 rounded-lg border border-zinc-800 bg-zinc-950/50">
                    <div className="h-4.5 w-4.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Check className="h-3 w-3" />
                    </div>
                    <span className="text-xs font-semibold text-zinc-200">{fw}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-zinc-850">
              <button className="px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-100 text-zinc-950 hover:bg-zinc-200 transition-all shadow-sm">
                Save Parameters
              </button>
            </div>
          </div>

          {/* API Credentials pane */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/10 p-6 space-y-6">
            <div>
              <h3 className="font-bold text-zinc-100 text-base">Security API Credentials</h3>
              <p className="text-xs text-zinc-400">Tokens used for dispatching automations from your backend systems.</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-lg border border-zinc-800 bg-zinc-950/50">
                <div>
                  <h4 className="text-xs font-semibold text-zinc-200">Production Auth Token</h4>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">cop_live_9a7d32...df41</p>
                </div>
                <button className="px-3 py-1.5 text-[10px] font-bold rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-850 hover:text-zinc-100 transition-colors">
                  Reveal
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
