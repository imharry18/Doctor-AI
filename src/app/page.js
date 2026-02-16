import Link from "next/link";
import { ArrowRight, Activity, FileText, BotMessageSquare, ShieldCheck, Zap, Sparkles } from "lucide-react";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-dark-900">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10 flex flex-col items-center text-center">
           
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter mb-8 text-white leading-[1.1]">
          Intelligent Health <br className="hidden md:block" />
          <span className="text-slate-400">
            Guidance Instantly.
          </span>
        </h1>
        
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Upload complex medical reports, inquire about subtle symptoms, or discover precise medicine information in seconds. Doctor AI translates medical data into human clarity.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
          <Link href="/bot" className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-dark-900 bg-white hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-2 group">
            Start Free Session
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="#features" className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-white bg-transparent hover:bg-white/5 rounded-lg transition-colors border border-white/10 flex items-center justify-center">
            Explore Features
          </Link>
        </div>
      </section>

      {/* Mock Window Visual */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full z-10 -mt-4 mb-32 hidden md:block">
         <div className="w-full h-80 md:h-[450px] rounded-xl border border-white/5 bg-dark-800 shadow-2xl overflow-hidden flex flex-col relative">
            {/* Window Header */}
            <div className="h-10 border-b border-white/5 flex items-center px-4 gap-2 bg-dark-900/50">
              <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
              <div className="ml-4 text-[10px] font-medium tracking-wider text-slate-500 uppercase">Doctor AI CLI</div>
            </div>
            <div className="flex-1 p-8 flex flex-col justify-end">
              <div className="max-w-2xl gap-6 flex flex-col">
                {/* Mock Message AI */}
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded bg-dark-700 border border-white/5 flex items-center justify-center shrink-0">
                    <BotMessageSquare className="w-4 h-4 text-slate-300" />
                  </div>
                  <div className="pt-1">
                    <h4 className="text-slate-200 text-sm font-medium mb-1">Report Analysis Complete</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">I've reviewed your uploaded blood panel. Your Vitamin D and Iron levels are slightly below range. Here are a few dietary adjustments you can discuss with your primary care physician.</p>
                  </div>
                </div>
                {/* Mock Message User */}
                <div className="flex gap-4 items-end self-end mt-2">
                  <div className="border border-white/10 bg-dark-700 px-4 py-3 rounded-lg">
                    <p className="text-slate-200 text-sm">Thank you, Doctor AI.</p>
                  </div>
                </div>
              </div>
            </div>
         </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-slate-500 font-medium tracking-wide uppercase text-xs mb-3">Core Platform</h2>
              <h3 className="text-3xl md:text-5xl font-semibold text-white tracking-tight">Enterprise-Grade <br/>Medical AI</h3>
            </div>
            <p className="text-slate-400 max-w-md leading-relaxed text-sm">
              Powered by state-of-the-art Generative AI models tailored for precision, speed, and absolute empathy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <FileText className="w-5 h-5 text-slate-300" />,
                title: "Document Parsing",
                description: "Natively extracts and interprets dense PDF pathology and radiology reports securely.",
              },
              {
                icon: <Activity className="w-5 h-5 text-slate-300" />,
                title: "Diagnostic Insights",
                description: "Cross-references your symptoms with vast medical databases to suggest probable causes.",
              },
              {
                icon: <Zap className="w-5 h-5 text-slate-300" />,
                title: "Instant Guidance",
                description: "Zero wait times. Get compassionate, structured responses in mere milliseconds.",
              }
            ].map((item, idx) => (
              <div key={idx} className="border border-white/5 bg-dark-800/50 p-8 rounded-xl hover:bg-dark-800 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-dark-700 border border-white/5 flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h4 className="text-base font-medium text-white mb-2">{item.title}</h4>
                <p className="text-slate-400 leading-relaxed text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-32 relative border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <ShieldCheck className="w-10 h-10 text-slate-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-6 tracking-tight">Designed for Privacy & Safety</h2>
          <p className="text-slate-400 text-base leading-relaxed mb-10 mx-auto">
            Your conversations and medical files are processed ephemerally. We do not store your PDFs or map your identity to health inquiries. Professional empathy without the compromise.
          </p>
          <Link href="/bot" className="inline-flex items-center gap-2 text-sm text-slate-300 font-medium hover:text-white transition-colors">
            Read our technical standard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}