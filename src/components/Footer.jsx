import Link from "next/link";
import { HeartPulse } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <HeartPulse className="w-6 h-6 text-slate-400 group-hover:text-slate-200 transition-colors" />
              <span className="text-xl font-medium text-slate-200 tracking-tight">Doctor AI</span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Your intelligent medical assistant. Analyze reports, understand symptoms, and get professional insights instantly using our advanced AI models.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-slate-200 tracking-wider mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">Home</Link></li>
              <li><Link href="/bot" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">Medical Bot</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-200 tracking-wider mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><span className="text-sm text-slate-500 cursor-not-allowed">Privacy Policy</span></li>
              <li><span className="text-sm text-slate-500 cursor-not-allowed">Terms of Service</span></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Doctor AI. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 italic text-center md:text-right max-w-lg">
            Disclaimer: Doctor AI is for informational purposes only and does not provide professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.
          </p>
        </div>
      </div>
    </footer>
  );
}
