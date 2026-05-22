import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="relative min-h-screen grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-zinc-950">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-[120px] pointer-events-none" />

      {/* Left panel - Branding & Showpiece (only on large screens) */}
      <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-12 border-r border-zinc-900 bg-zinc-950/40 relative z-10">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-50 hover:text-zinc-200 transition-colors">
            <ShieldCheck className="h-6 w-6 text-zinc-100" />
            <span className="font-bold text-lg tracking-tight">ComplianceOS <span className="text-zinc-400 font-normal">AI</span></span>
          </Link>
        </div>

        <div className="space-y-6 my-auto max-w-md">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs text-zinc-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse" />
            Join the platform
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-100 leading-tight">
            Create Your <br />
            Compliance Suite.
          </h1>
          <p className="text-zinc-400 leading-relaxed text-sm">
            Set up your organization, configure audit channels, establish roles, and activate automated policies in minutes. Experience continuous verification with zero friction.
          </p>
        </div>

        <div className="text-xs text-zinc-500">
          &copy; {new Date().getFullYear()} ComplianceOS AI Inc. All rights reserved.
        </div>
      </div>

      {/* Right panel - Auth form */}
      <div className="col-span-1 lg:col-span-7 flex flex-col justify-center items-center p-8 relative z-10">
        {/* Back link for mobile */}
        <div className="absolute top-8 left-8 lg:hidden">
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-200 text-xs transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>

        <div className="w-full max-w-md flex flex-col items-center">
          {/* Logo for mobile */}
          <div className="lg:hidden flex items-center gap-2 mb-8 text-zinc-50">
            <ShieldCheck className="h-8 w-8 text-zinc-200" />
            <span className="font-bold text-xl tracking-tight">ComplianceOS <span className="text-zinc-400 font-normal">AI</span></span>
          </div>

          <SignUp
            appearance={{
              baseTheme: dark,
              elements: {
                rootBox: "w-full",
                card: "bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 shadow-2xl rounded-2xl w-full",
                headerTitle: "text-zinc-100 font-bold text-2xl tracking-tight",
                headerSubtitle: "text-zinc-400 text-sm mt-1.5",
                socialButtonsBlockButton: "bg-zinc-850 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 transition-all font-medium py-2 rounded-lg",
                formButtonPrimary: "bg-zinc-10 hover:bg-zinc-20 text-zinc-950 border-none font-semibold shadow-sm transition-all py-2.5 rounded-lg text-sm",
                formFieldLabel: "text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-1",
                formFieldInput: "bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-zinc-600 focus:ring-zinc-650 rounded-lg py-2.5 transition-all text-sm",
                footerActionText: "text-zinc-400 text-xs",
                footerActionLink: "text-zinc-20 hover:text-zinc-10 font-semibold transition-all text-xs",
                dividerLine: "bg-zinc-800",
                dividerText: "text-zinc-500 text-xs uppercase tracking-wider",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
