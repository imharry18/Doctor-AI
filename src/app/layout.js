import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";

export const metadata = {
  title: "Doctor AI - Medical Assistant",
  description: "Your intelligent medical assistant powered by AI for report analysis and symptom checking.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="flex flex-col min-h-screen">
        <Providers>
          <Navbar />
          <main className="flex-1 pt-16">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
