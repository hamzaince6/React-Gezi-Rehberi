import React from 'react';
import { BookOpen, Users, Map, Calendar } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    {
      title: 'Toplam Hikaye',
      value: localStorage.getItem('travelStories')
        ? JSON.parse(localStorage.getItem('travelStories')!).length
        : 0,
      icon: BookOpen,
      color: 'bg-indigo-500',
    },
    {
      title: 'Toplam Ziyaretçi',
      value: '1,234',
      icon: Users,
      color: 'bg-emerald-500',
    },
    {
      title: 'Aktif Rotalar',
      value: '15',
      icon: Map,
      color: 'bg-orange-500',
    },
    {
      title: 'Planlı Etkinlikler',
      value: '8',
      icon: Calendar,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-6 flex items-center"
          >
            <div
              className={`${stat.color} rounded-lg p-3 text-white mr-4`}
            >
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{stat.title}</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Son Aktiviteler
        </h2>
        <div className="space-y-4">
          {/* Bu kısım gerçek verilerle doldurulacak */}
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            <span>Yeni bir hikaye eklendi: "İstanbul'da Bir Güz Sabahı"</span>
            <span className="ml-auto">2 saat önce</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
            <span>Rota güncellendi: "Kapadokya Turu"</span>
            <span className="ml-auto">5 saat önce</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
            <span>Yeni yorum: "Harika bir deneyimdi!"</span>
            <span className="ml-auto">1 gün önce</span>
          </div>
        </div>
      </div>
    </div>
  );
}
