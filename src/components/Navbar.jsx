"use client";
import Link from 'next/link';
import { Activity } from 'lucide-react';
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-dark-900/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-dark-800 border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-colors">
              <Activity className="w-5 h-5 text-slate-300" />
            </div>
            <span className="font-semibold text-lg text-white tracking-tight">Doctor AI</span>
          </Link>
          
          <div className="flex items-center gap-3">
            {session ? (
              <>
                <span className="text-sm font-medium text-slate-400 hidden sm:block mr-2 border-r border-white/10 pr-4">
                  {session.user?.name || session.user?.email}
                </span>
                <Link href="/bot" className="px-4 py-2 text-xs font-medium bg-white hover:bg-slate-200 text-dark-900 rounded transition-colors hidden sm:block shadow-sm">
                  Clinical Chat
                </Link>
                <button onClick={() => signOut()} className="px-4 py-2 text-xs font-medium border border-white/10 hover:bg-white/5 text-slate-300 rounded transition-colors">
                  Log Out
                </button>
              </>
            ) : (
              <>
                <button onClick={() => signIn()} className="px-4 py-2 text-xs font-medium border border-white/10 hover:bg-white/5 text-slate-300 rounded transition-colors">
                  Log In
                </button>
                <Link href="/bot" className="px-4 py-2 text-xs font-medium bg-white hover:bg-slate-200 text-dark-900 rounded transition-colors shadow-sm">
                  Try the Bot
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
