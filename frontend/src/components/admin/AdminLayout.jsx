import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

/**
 * AdminLayout Component - Main layout wrapper for admin pages
 * Contains sidebar, header, and main content area
 */
export default function AdminLayout({ children, pageTitle, pageDescription }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
                {pageDescription && (
                  <p className="text-sm text-gray-600 mt-1">{pageDescription}</p>
                )}
              </div>
            </div>

            {/* Admin Info */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">Admin</p>
                <p className="text-xs text-gray-600">Store Manager</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
