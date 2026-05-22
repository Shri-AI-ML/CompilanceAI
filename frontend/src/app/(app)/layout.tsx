"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { OrganizationSwitcher, UserButton, useUser, useOrganization } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { useApiClient } from "@/lib/api";
import {
  ShieldCheck,
  LayoutDashboard,
  Files,
  GitBranch,
  CheckSquare,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Menu,
  X,
  RefreshCw,
  Server,
  Database,
  Cpu
} from "lucide-react";

// Sidebar navigation items
const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Documents", href: "/documents", icon: Files },
  { name: "Workflows", href: "/workflows", icon: GitBranch },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Audit Logs", href: "/audit-logs", icon: Activity },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface HealthStatus {
  status: string;
  database: string;
  redis: string;
  qdrant: string;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { get } = useApiClient();
  const { user } = useUser();
  const { organization } = useOrganization();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Health check states
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [checkingHealth, setCheckingHealth] = useState(false);
  const [isBackendOffline, setIsBackendOffline] = useState(false);

  const checkHealth = useCallback(async () => {
    setCheckingHealth(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      const res = await fetch(`${apiBase}/health`);
      if (res.ok || res.status === 503) {
        const data = await res.json();
        setHealthStatus({
          status: data.status,
          database: data.database || "unhealthy",
          redis: data.redis || "unhealthy",
          qdrant: data.qdrant || "unhealthy",
        });
        setIsBackendOffline(data.status !== "healthy");
      } else {
        throw new Error(`HTTP error ${res.status}`);
      }
    } catch (err) {
      console.error("Health check failed:", err);
      setHealthStatus({
        status: "unhealthy",
        database: "unhealthy (connection refused)",
        redis: "unhealthy (connection refused)",
        qdrant: "unhealthy (connection refused)",
      });
      setIsBackendOffline(true);
    } finally {
      setCheckingHealth(false);
    }
  }, []);

  // Poll health endpoint every 15s to react to backend states
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  // Silent Background Database Synchronization
  useEffect(() => {
    if (!user || isBackendOffline) return;

    let isCurrent = true;
    const syncDatabase = async () => {
      setIsSyncing(true);
      setSyncError(null);
      try {
        await get("/users/me");
      } catch (err: unknown) {
        console.error("Database synchronization failed:", err);
        if (isCurrent) {
          const errMsg = err instanceof Error ? err.message : "Sync failed";
          setSyncError(errMsg);
        }
      } finally {
        if (isCurrent) {
          setIsSyncing(false);
        }
      }
    };

    syncDatabase();

    return () => {
      isCurrent = false;
    };
  }, [user, organization?.id, get, isBackendOffline]);

  // Load sidebar collapse preference from local storage
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      const saved = localStorage.getItem("sidebar-collapsed");
      if (saved) {
        setIsCollapsed(saved === "true");
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const toggleSidebar = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem("sidebar-collapsed", String(nextState));
  };

  // Close mobile sidebar on route change
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMobileOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!mounted) {
    return <div className="min-h-screen bg-zinc-950" />;
  }

  // Render premium full-screen "API Unavailable" layout if degraded/offline
  if (isBackendOffline) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-zinc-950 text-zinc-200 p-6 font-sans selection:bg-zinc-800">
        {/* Header */}
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-red-500 shadow-sm shadow-red-500/10">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="font-bold text-sm tracking-tight text-white animate-pulse">
              ComplianceOS <span className="text-zinc-500 font-normal">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900/50 border border-zinc-800/80 rounded-full px-3 py-1 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Service Degraded
          </div>
        </div>

        {/* Content */}
        <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center py-12">
          <div className="border border-zinc-800/80 bg-zinc-900/20 backdrop-blur-md rounded-2xl p-8 relative overflow-hidden shadow-2xl shadow-black/50">
            {/* Top decorative glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[1px] w-3/4 bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
            
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <div className="inline-flex p-3 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 mb-2">
                  <Activity className="h-6 w-6 animate-pulse" />
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-white">
                  Infrastructure Offline
                </h1>
                <p className="text-sm text-zinc-400 max-w-sm mx-auto leading-relaxed">
                  We are experiencing connection issues with core backing services. The platform will automatically resume once healthy.
                </p>
              </div>

              {/* Services Check List */}
              <div className="space-y-3 pt-2">
                <div className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase font-mono">
                  Subsystem Diagnostics
                </div>
                
                <div className="divide-y divide-zinc-800/30 border border-zinc-800/60 rounded-xl bg-zinc-900/40">
                  {/* Database */}
                  <div className="flex items-center justify-between p-3.5 px-4 text-xs">
                    <div className="flex items-center gap-3">
                      <Database className="h-4 w-4 text-zinc-400" />
                      <span className="font-medium text-zinc-300">PostgreSQL Database</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-zinc-500">
                        {healthStatus?.database === "healthy" ? "Connected" : "Disconnected"}
                      </span>
                      <span className={`h-2 w-2 rounded-full ${
                        healthStatus?.database === "healthy" 
                          ? "bg-emerald-500 shadow-sm shadow-emerald-500/50" 
                          : "bg-red-500 shadow-sm shadow-red-500/50 animate-pulse"
                      }`} />
                    </div>
                  </div>

                  {/* Redis */}
                  <div className="flex items-center justify-between p-3.5 px-4 text-xs">
                    <div className="flex items-center gap-3">
                      <Cpu className="h-4 w-4 text-zinc-400" />
                      <span className="font-medium text-zinc-300">Redis Cache</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-zinc-500">
                        {healthStatus?.redis === "healthy" ? "Connected" : "Disconnected"}
                      </span>
                      <span className={`h-2 w-2 rounded-full ${
                        healthStatus?.redis === "healthy" 
                          ? "bg-emerald-500 shadow-sm shadow-emerald-500/50" 
                          : "bg-red-500 shadow-sm shadow-red-500/50 animate-pulse"
                      }`} />
                    </div>
                  </div>

                  {/* Qdrant */}
                  <div className="flex items-center justify-between p-3.5 px-4 text-xs">
                    <div className="flex items-center gap-3">
                      <Server className="h-4 w-4 text-zinc-400" />
                      <span className="font-medium text-zinc-300">Qdrant Vector DB</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-zinc-500">
                        {healthStatus?.qdrant === "healthy" ? "Connected" : "Disconnected"}
                      </span>
                      <span className={`h-2 w-2 rounded-full ${
                        healthStatus?.qdrant === "healthy" 
                          ? "bg-emerald-500 shadow-sm shadow-emerald-500/50" 
                          : "bg-red-500 shadow-sm shadow-red-500/50 animate-pulse"
                      }`} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={checkHealth}
                  disabled={checkingHealth}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 active:bg-zinc-300 disabled:opacity-60 transition-all shadow-md shadow-white/5"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${checkingHealth ? "animate-spin" : ""}`} />
                  {checkingHealth ? "Verifying..." : "Retry Connection"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="max-w-7xl mx-auto w-full text-center py-4 text-[10px] text-zinc-600 font-mono">
          SYSTEM INTEGRITY MONITORING — ComplianceOS AI v0.1.0
        </div>
      </div>
    );
  }


  // Get current page name for breadcrumb
  const currentItem = navItems.find((item) => pathname.startsWith(item.href));
  const pageTitle = currentItem ? currentItem.name : "Overview";

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground transition-colors duration-200">
      {/* 1. Sidebar - Desktop */}
      <aside
        className={`hidden md:flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out select-none relative ${
          isCollapsed ? "w-[72px]" : "w-64"
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 overflow-hidden transition-all duration-300"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <span className="font-bold text-sm tracking-tight whitespace-nowrap">
                ComplianceOS <span className="text-muted-foreground font-normal">AI</span>
              </span>
            )}
          </Link>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative ${
                  isActive
                    ? "bg-secondary text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className={`h-4 w-4 shrink-0 transition-transform ${isActive ? "scale-105" : "group-hover:scale-105"}`} />
                {!isCollapsed && (
                  <span className="transition-all duration-200">{item.name}</span>
                )}
                {isCollapsed && (
                  <div className="absolute left-14 bg-popover text-popover-foreground text-xs py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-border shadow-md whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer & Collapse Button */}
        <div className="p-3 border-t border-border flex items-center justify-between">
          {!isCollapsed && (
            <span className="text-xs text-muted-foreground pl-2">v0.1.0</span>
          )}
          <button
            onClick={toggleSidebar}
            className={`p-1.5 rounded-md border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-all mx-auto ${
              isCollapsed ? "" : "ml-auto"
            }`}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </aside>

      {/* 2. Sidebar - Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-zinc-950/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* 3. Sidebar - Mobile Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 border-r border-border bg-card p-4 flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between pb-6 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            <span className="font-bold text-sm tracking-tight">ComplianceOS AI</span>
          </Link>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-secondary text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-border text-xs text-muted-foreground">
          v0.1.0 — ComplianceOS AI
        </div>
      </aside>

      {/* 4. Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Topbar Header */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md px-4 md:px-6 flex items-center justify-between shrink-0 relative z-30">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 -ml-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground md:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb / Page Title */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="hidden sm:inline-block">ComplianceOS</span>
              <span className="hidden sm:inline-block">/</span>
              <span className="font-semibold text-foreground">{pageTitle}</span>
              {isSyncing && (
                <span className="text-[10px] text-muted-foreground animate-pulse ml-2 bg-muted px-1.5 py-0.5 rounded-full flex items-center gap-1 select-none">
                  <span className="h-1.5 w-1.5 bg-yellow-500 rounded-full animate-ping" />
                  Syncing
                </span>
              )}
              {syncError && (
                <span className="text-[10px] text-destructive ml-2 bg-destructive/10 px-1.5 py-0.5 rounded-full flex items-center gap-1 select-none" title={syncError}>
                  <span className="h-1.5 w-1.5 bg-destructive rounded-full" />
                  Sync Error
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Org Switcher */}
            <div className="flex items-center border border-border rounded-lg px-1 py-0.5 bg-background shadow-sm hover:bg-muted/50 transition-colors">
              <OrganizationSwitcher
                hidePersonal
                afterCreateOrganizationUrl="/dashboard"
                afterLeaveOrganizationUrl="/dashboard"
                afterSelectOrganizationUrl="/dashboard"
                appearance={{
                  baseTheme: theme === "dark" ? dark : undefined,
                  elements: {
                    rootBox: "flex items-center",
                    organizationSwitcherTrigger:
                      "h-7 border-none bg-transparent hover:bg-transparent text-foreground font-medium text-xs px-2 py-0 focus:outline-none focus:ring-0 focus-visible:ring-0",
                    organizationPreview: "text-foreground",
                    organizationPreviewTextContainer: "text-foreground",
                    organizationPreviewTitle: "text-foreground text-xs font-semibold",
                    organizationPreviewSubtitle: "text-muted-foreground text-[10px]",
                  },
                }}
              />
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shadow-sm"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="flex items-center">
              <UserButton
                appearance={{
                  baseTheme: theme === "dark" ? dark : undefined,
                  elements: {
                    userButtonBox: "h-8 w-8 hover:opacity-90 transition-opacity",
                    userButtonTrigger: "focus:outline-none focus:ring-0 focus-visible:ring-0",
                  },
                }}
              />
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 overflow-y-auto bg-background/30 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
