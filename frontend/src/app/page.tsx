import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Activity, Cpu, Database, ArrowRight, CheckCircle2, Terminal } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 font-sans text-zinc-50 selection:bg-zinc-800 selection:text-zinc-100">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 sm:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight text-white">
              <Shield className="h-5 w-5 text-zinc-400" />
              <span>ComplianceOS <span className="text-zinc-400 font-normal">AI</span></span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
              <Link href="#features" className="transition-colors hover:text-white">Features</Link>
              <Link href="#architecture" className="transition-colors hover:text-white">Architecture</Link>
              <Link href="http://localhost:8000/docs" target="_blank" className="transition-colors hover:text-white">API Docs</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white" asChild>
              <Link href="http://localhost:8000/docs" target="_blank">View API Docs</Link>
            </Button>
            <Button size="sm" className="bg-white text-zinc-950 hover:bg-zinc-200">
              Contact Sales
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 sm:py-32">
          {/* Subtle background glow */}
          <div className="absolute top-1/4 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-900/40 blur-[120px]" />
          
          <div className="mx-auto max-w-7xl px-6 text-center sm:px-8">
            <div className="mx-auto flex max-w-fit items-center justify-center">
              <Badge variant="outline" className="border-zinc-800 bg-zinc-900/50 px-3 py-1 text-zinc-400">
                <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-zinc-400 animate-pulse" />
                V1.0 Starter Foundation Initialized
              </Badge>
            </div>
            
            <h1 className="mt-8 text-4xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
              AI-Native Compliance <br />
              <span className="bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-600 bg-clip-text text-transparent">
                for Modern Enterprise
              </span>
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
              Automate policy enforcement, monitor real-time audit logs, and scale your global operations with mathematically verified compliance guardrails.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" className="bg-white text-zinc-950 hover:bg-zinc-200 group">
                Request Pilot
                <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
              <Button variant="outline" size="lg" className="border-zinc-800 bg-zinc-900/20 text-zinc-300 hover:bg-zinc-900 hover:text-white" asChild>
                <Link href="http://localhost:8000/docs" target="_blank">
                  <Terminal className="mr-2 h-4 w-4" />
                  Explore Swagger API
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="border-t border-zinc-900 bg-zinc-950 py-24">
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <div className="max-w-2xl">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Platform Core</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Built for Scalability, Privacy, and Control
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:max-w-none lg:grid-cols-4">
              <Card className="border-zinc-900 bg-zinc-900/25">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
                    <Shield className="h-5 w-5" />
                  </div>
                  <CardTitle className="mt-4 text-white">Continuous Auditing</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Verify operations in real-time against standard frameworks (SOC2, ISO27001, HIPAA).
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-zinc-900 bg-zinc-900/25">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <CardTitle className="mt-4 text-white">AI Policy Engine</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Parse complex regulative texts into system-level rules automatically via OpenRouter.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-zinc-900 bg-zinc-900/25">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
                    <Activity className="h-5 w-5" />
                  </div>
                  <CardTitle className="mt-4 text-white">Async Execution</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Event-driven background workflow engine built using PostgreSQL & asyncpg.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-zinc-900 bg-zinc-900/25">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
                    <Database className="h-5 w-5" />
                  </div>
                  <CardTitle className="mt-4 text-white">Vector Storage</CardTitle>
                  <CardDescription className="text-zinc-400">
                    High-performance semantic query and knowledge base retrieval backed by Qdrant.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Architecture Section */}
        <section id="architecture" className="border-t border-zinc-900 bg-zinc-950/50 py-24">
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">FastAPI Architecture</h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Enterprise-grade REST API Design
                </p>
                <p className="mt-4 text-zinc-400">
                  The ComplianceOS AI backend is designed with a strict clean-architecture directory structure, separating models, database logic, schemas, endpoint route routers, and long-running services.
                </p>
                <ul className="mt-8 space-y-3">
                  {[
                    "Asynchronous database pools using SQLAlchemy & asyncpg",
                    "Alembic auto-migration environment configuration",
                    "Pydantic v2 settings validation for key third-party APIs",
                    "Full unit tests with pytest-asyncio and mock providers"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3 text-sm text-zinc-300">
                      <CheckCircle2 className="h-4 w-4 text-zinc-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="overflow-hidden rounded-xl border border-zinc-900 bg-zinc-900/30 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-zinc-800" />
                    <span className="h-3 w-3 rounded-full bg-zinc-800" />
                    <span className="h-3 w-3 rounded-full bg-zinc-800" />
                  </div>
                  <span className="text-xs text-zinc-500">GET /api/v1/health</span>
                </div>
                <pre className="mt-4 overflow-x-auto text-xs text-zinc-400 font-mono leading-relaxed">
                  <code>{`// API response payload
{
  "status": "healthy",
  "version": "0.1.0",
  "environment": "development",
  "database": "healthy",
  "redis": "healthy (configured)"
}`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-zinc-500 sm:flex-row sm:px-8">
          <div>
            &copy; {new Date().getFullYear()} ComplianceOS AI Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="http://localhost:8000/docs" target="_blank" className="transition-colors hover:text-white">API</Link>
            <span className="text-zinc-800">|</span>
            <span className="text-zinc-400">SOC2 Certified Placeholder</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
