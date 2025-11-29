import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Layers, LogOut, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * AdminSidebar Component - Navigation menu for admin pages
 */
export default function AdminSidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      key: 'dashboard',
    },
    {
      label: 'Products',
      href: '/admin/products',
      icon: Package,
      key: 'products',
    },
    {
      label: 'Orders',
      href: '/admin/orders',
      icon: ShoppingCart,
      key: 'orders',
    },
    {
      label: 'Categories',
      href: '/admin/categories',
      icon: Layers,
      key: 'categories',
    },
  ];

  const isActive = (href) => location.pathname.startsWith(href);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-transform duration-200 z-50 flex flex-col`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">
              S
            </div>
            <span className="font-bold text-lg">Admin</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-gray-700 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.key}
                to={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  active
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 font-medium transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
