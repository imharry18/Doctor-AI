"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Bot, User, Loader2, FileText, Image as ImageIcon, X, Download, Mic } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useSession } from "next-auth/react";

export default function BotPage() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hello! I am Doctor AI, the world's most intelligent medical AI. You can share images of injuries, upload medical PDF reports, or describe your symptoms, and I will provide profound, expert clinical insights." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [reportMarkdown, setReportMarkdown] = useState("");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const { data: session } = useSession();
  const [chatId, setChatId] = useState(null);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const reportRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (session?.user) {
      fetch('/api/history')
        .then(res => res.json())
        .then(data => {
          if (data.chat) {
            setChatId(data.chat.id);
            if (data.chat.messages && data.chat.messages.length > 0) {
              setMessages([
                 { role: 'ai', content: "Welcome back! I have securely synchronized your clinical history. How can I assist you today?" },
                 ...data.chat.messages.map(m => ({ role: m.role, content: m.content }))
              ]);
            }
          }
        })
        .catch(e => console.error(e));
    }
  }, [session]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + ' ';
            }
          }
          if (finalTranscript) {
            setInput(prev => prev + finalTranscript);
          }
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };
      }
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch(e) {
          console.error(e);
        }
      } else {
        alert("Speech recognition is not supported in this browser. Try Chrome.");
      }
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "application/pdf" || file.type.startsWith("image/"))) {
      setSelectedFile(file);
    } else if (file) {
      alert("Please upload a valid PDF or Image file.");
    }
    // reset input
    e.target.value = '';
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const downloadPDF = () => {
    window.print();
  };

  const generateOfficialReport = async () => {
    if (messages.length <= 1) return alert("Please have a meaningful conversation first before generating a report.");
    setIsGeneratingReport(true);
    
    try {
      const formData = new FormData();
      formData.append("history", JSON.stringify(messages.map(m => ({ role: m.role, content: m.content }))));
      
      const response = await fetch('/api/report', { method: 'POST', body: formData });
      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      
      setReportMarkdown(data.report);
      
      // We need to wait for React to render the markdown in the hidden div 
      // before capturing it via html2canvas.
      setTimeout(async () => {
        if (!reportRef.current) return;
        
        // Dynamically import to avoid Next.js build-time SSR window crashes
        const html2canvas = (await import('html2canvas')).default;
        const { jsPDF } = await import('jspdf');
        
        const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        
        // Calculate dimensions to fit neatly on A4 equivalent
        const pdfWidth = canvas.width / 2; 
        const pdfHeight = canvas.height / 2;
        
        const pdf = new jsPDF({
          orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
          unit: 'px',
          format: [pdfWidth, pdfHeight]
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('DoctorAI_Clinical_Summary.pdf');
        
        setIsGeneratingReport(false);
      }, 800);
      
    } catch (e) {
      console.error(e);
      alert("Failed to generate report.");
      setIsGeneratingReport(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedFile) return;

    const userMsg = input.trim();
    const currentFile = selectedFile;
    
    // Add user message to UI
    let contentDisplay = userMsg;
    if (currentFile) {
      const typeLabel = currentFile.type.startsWith("image/") ? "Image" : "PDF";
      contentDisplay = userMsg ? `[Attached ${typeLabel}: ${currentFile.name}]\n${userMsg}` : `[Attached ${typeLabel}: ${currentFile.name}] Please analyze this.`;
    }

    setMessages(prev => [...prev, { role: 'user', content: contentDisplay }]);
    setInput("");
    setSelectedFile(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("message", userMsg || "Please analyze this attached context in detail.");
      if (currentFile) {
        formData.append("file", currentFile);
      }
      if (chatId) {
        formData.append("chatId", chatId);
      }
      
      formData.append("history", JSON.stringify(messages.map(m => ({ role: m.role, content: m.content }))));

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      if (data.chatId && !chatId) {
        setChatId(data.chatId);
      }
      
      setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error while processing your request. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <div className="flex h-[calc(100vh-4rem)] bg-dark-900 border-t border-white/5 w-full max-w-[100vw] overflow-hidden print-expand">
        <div className="flex-1 flex flex-col w-full bg-dark-900 print-expand">
          
          {/* Header */}
          <div className="h-14 flex items-center justify-between px-6 shrink-0 border-b border-white/5 no-print">
            <span className="font-medium text-sm text-slate-300 tracking-wide">Doctor AI Clinical Interface</span>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={downloadPDF} 
                className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
                title="Print current visual chat transcript"
              >
                Print Transcript
              </button>
              <button 
                onClick={generateOfficialReport} 
                disabled={isGeneratingReport}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-white text-dark-900 hover:bg-slate-200 rounded transition-colors disabled:opacity-50"
              >
                {isGeneratingReport ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
                Generate Official Report
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 scroll-smooth print-expand">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-4 max-w-3xl mx-auto ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-slate-200' : 'bg-dark-800 border border-white/10'}`}>
                  {msg.role === 'user' ? <User className="w-5 h-5 text-dark-900" /> : <Bot className="w-5 h-5 text-slate-300" />}
                </div>
                <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}>
                  <div className={`py-2 ${msg.role === 'user' ? 'px-4 bg-dark-800 border border-white/5 text-slate-200 rounded-lg' : 'text-slate-300'}`}>
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.content}</p>
                    ) : (
                      <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed marker:text-slate-500 prose-a:text-white prose-code:text-slate-200 prose-pre:bg-dark-800 prose-pre:border prose-pre:border-white/10">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4 max-w-3xl mx-auto">
                <div className="w-8 h-8 rounded bg-dark-800 border border-white/10 shrink-0 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-slate-300" />
                </div>
                <div className="py-2 flex items-center gap-3 text-slate-500 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing request...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-dark-900 shrink-0 border-t border-white/5 no-print">
            <div className="max-w-3xl mx-auto">
              {selectedFile && (
                <div className="mb-3 flex items-center gap-2 bg-dark-800 border border-white/10 px-3 py-2 rounded-lg w-fit">
                  {selectedFile.type.startsWith("image/") ? (
                    <ImageIcon className="w-4 h-4 text-slate-400" />
                  ) : (
                    <FileText className="w-4 h-4 text-slate-400" />
                  )}
                  <span className="text-xs font-medium text-slate-300 truncate max-w-xs">{selectedFile.name}</span>
                  <button onClick={removeFile} className="ml-2 hover:text-white text-slate-500 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              <div className="relative flex items-end gap-2 bg-dark-900 border border-white/10 rounded-xl p-1.5 focus-within:border-white/30 transition-all mx-2 md:mx-0 shadow-sm">
                <input 
                  type="file" 
                  accept="application/pdf, image/*"
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 text-slate-500 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-colors shrink-0"
                  title="Upload PDF or Image"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                
                <button 
                  onClick={toggleListening}
                  className={`p-2.5 rounded-lg transition-colors shrink-0 ${isListening ? 'text-red-400 bg-red-400/10 animate-pulse' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'}`}
                  title="Voice Input"
                >
                  <Mic className="w-5 h-5" />
                </button>
                
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message Doctor AI with text, images, or PDFs..."
                  className="w-full bg-transparent border-none focus:ring-0 text-slate-200 resize-none max-h-48 min-h-[44px] py-3 px-2 placeholder-slate-600 outline-none text-sm leading-relaxed"
                  rows={1}
                />
                
                <button 
                  onClick={handleSend}
                  disabled={isLoading || (!input.trim() && !selectedFile)}
                  className="p-2.5 bg-white text-dark-900 hover:bg-slate-200 disabled:opacity-20 disabled:hover:bg-white rounded-lg transition-colors shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="text-center mt-3 text-[10px] text-slate-600 font-medium tracking-wide">
                Doctor AI processes images, scans, and PDFs securely. Consult a physician for formal diagnosis.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden PDF Report Template Container */}
      <div className="absolute left-[-9999px] top-[-9999px] pointer-events-none">
        <div ref={reportRef} className="bg-white text-black p-12 w-[850px] min-h-[1100px] font-sans antialiased">
          <div className="flex items-center gap-3 mb-8 border-b-2 border-slate-200 pb-6">
            <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Doctor AI</h1>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mt-1">Intelligent Clinical Summary</span>
            </div>
          </div>
          <div className="prose prose-slate prose-sm max-w-none text-slate-800 marker:text-slate-400">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {reportMarkdown}
            </ReactMarkdown>
          </div>
          
          <div className="mt-16 pt-8 border-t border-slate-200 text-center">
            <p className="text-[10px] text-slate-400 font-medium max-w-xl mx-auto uppercase tracking-wider leading-relaxed">
              CONFIDENTIAL AUTOMATED REPORT • DOCTOR AI 2.0 ENGINE
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
