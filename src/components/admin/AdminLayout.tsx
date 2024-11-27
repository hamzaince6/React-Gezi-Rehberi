import React, { useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, LogOut, Compass } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-indigo-700 text-white">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 p-4 hover:bg-indigo-800">
          <Compass className="h-8 w-8" />
          <span className="text-xl font-bold">Gezi Rehberim</span>
        </Link>

        {/* Navigation */}
        <nav className="mt-8 space-y-2 px-4">
          <Link
            to="/admin"
            className="flex items-center space-x-2 p-2 rounded hover:bg-indigo-800"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Admin Anasayfa</span>
          </Link>
          <Link
            to="/admin/stories"
            className="flex items-center space-x-2 p-2 rounded hover:bg-indigo-800"
          >
            <BookOpen className="h-5 w-5" />
            <span>Gezgin Hikayeleri</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 p-2 rounded hover:bg-indigo-800 w-full text-left"
          >
            <LogOut className="h-5 w-5" />
            <span>Çıkış Yap</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8 pt-16">
        <Outlet />
      </div>
    </div>
  );
}
