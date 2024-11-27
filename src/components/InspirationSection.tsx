import React from 'react';
import { Calendar, Users, Camera, Coffee } from 'lucide-react';

const categories = [
  {
    id: 1,
    title: 'Kültür Turları',
    description: 'Tarihi mekanlar ve müzeler',
    icon: Camera,
    image: 'https://images.unsplash.com/photo-1669237504736-74bd40c03c4a?auto=format&fit=crop&q=80',
    tags: ['Müze', 'Tarih', 'Mimari']
  },
  {
    id: 2,
    title: 'Gastronomi',
    description: 'Yerel lezzetler ve mutfak kültürü',
    icon: Coffee,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80',
    tags: ['Yemek', 'Şarap', 'Kahve']
  },
  {
    id: 3,
    title: 'Festival & Etkinlik',
    description: 'Yerel festivaller ve etkinlikler',
    icon: Users,
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80',
    tags: ['Müzik', 'Dans', 'Sanat']
  },
  {
    id: 4,
    title: 'Mevsimsel Rotalar',
    description: 'Mevsime özel gezi rotaları',
    icon: Calendar,
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80',
    tags: ['Doğa', 'Spor', 'Macera']
  }
];

export default function InspirationSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Seyahat İlhamı</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Yeni yerler keşfedin, benzersiz deneyimler yaşayın ve unutulmaz anılar biriktirin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.id}
                className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Icon className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {category.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}