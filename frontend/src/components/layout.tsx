import Header from "./header";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-white to-pink-100 overflow-x-hidden">
      {/* Header */}
      <Header
        app_id="app_staging_627c1f36530d1f0fac88c5bb1618bbfe"
        action="sign_in"
        signal=""
      />

      {/* Main Content */}
      <main className="flex-grow py-16 px-4">
        <div className="max-w-6xl mx-auto ">
          <div className="bg-white/70 backdrop-blur-lg p-10 rounded-3xl shadow-xl border border-gray-200">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/70 backdrop-blur-lg border-t border-gray-200 py-10 mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-center md:text-left text-sm text-gray-700 font-medium">
              © 2024 Chain Score. All rights reserved.
            </p>
            <div className="flex space-x-8 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-700 hover:text-blue-500 transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-500 transition-colors duration-300"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-500 transition-colors duration-300"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
