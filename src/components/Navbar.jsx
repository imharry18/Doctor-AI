import Link from "next/link";
import { Stethoscope } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-dark-900/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 transition-transform group-hover:scale-105">
              <Stethoscope className="w-5 h-5 text-slate-200" />
            </div>
            <span className="text-xl font-medium text-slate-200 tracking-tight">
              Doctor AI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors">
              Home
            </Link>
            <Link href="#features" className="text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors">
              Features
            </Link>
            <Link href="/bot" className="px-5 py-2 text-sm font-medium text-dark-900 bg-slate-200 hover:bg-white rounded-md transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              Try the Bot
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
