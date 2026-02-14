"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Bot, User, Loader2, FileText, Image as ImageIcon, X, Download } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function BotPage() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hello! I am Doctor AI, the world's most intelligent medical AI. You can share images of injuries, upload medical PDF reports, or describe your symptoms, and I will provide profound, expert clinical insights." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      
      formData.append("history", JSON.stringify(messages.map(m => ({ role: m.role, content: m.content }))));

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
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
    <div className="flex h-[calc(100vh-4rem)] bg-dark-900 border-t border-white/5 w-full max-w-[100vw] overflow-hidden print-expand">
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col w-full bg-dark-900 print-expand">
        
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-6 shrink-0 border-b border-white/5 no-print">
          <span className="font-medium text-sm text-slate-300 tracking-wide">Doctor AI Clinical Interface</span>
          <button 
            onClick={downloadPDF} 
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-dark-800 hover:bg-white/10 text-slate-300 rounded border border-white/10 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </button>
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
  );
}
