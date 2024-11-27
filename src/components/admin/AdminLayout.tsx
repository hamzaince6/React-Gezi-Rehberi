import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, LogOut, Compass, BookOpenCheck, Menu, X } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const menuItems = [
    {
      to: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
      text: "Admin Anasayfa"
    },
    {
      to: "/admin/stories",
      icon: <BookOpen className="h-5 w-5" />,
      text: "Gezgin Hikayeleri"
    },
    {
      to: "/admin/guides",
      icon: <BookOpenCheck className="h-5 w-5" />,
      text: "Rehberler"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-md bg-indigo-700 text-white hover:bg-indigo-800 focus:outline-none"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 w-64 bg-indigo-700 text-white transform transition-transform duration-300 ease-in-out z-40
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center space-x-2 p-4 hover:bg-indigo-800"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <Compass className="h-8 w-8" />
          <span className="text-xl font-bold">Gezi Rehberim</span>
        </Link>

        {/* Navigation */}
        <nav className="mt-8 space-y-2 px-4">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.to}
              className="flex items-center space-x-2 p-2 rounded hover:bg-indigo-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.icon}
              <span>{item.text}</span>
            </Link>
          ))}
          <button
            onClick={() => {
              handleLogout();
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center space-x-2 p-2 rounded hover:bg-indigo-800 w-full text-left"
          >
            <LogOut className="h-5 w-5" />
            <span>Çıkış Yap</span>
          </button>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-64 flex-1 p-4 lg:p-8 pt-16">
        <Outlet />
      </div>
    </div>
  );
}
