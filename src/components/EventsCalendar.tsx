import React from 'react';
import { Calendar as CalendarIcon, Music, Palette, Utensils } from 'lucide-react';

const upcomingEvents = [
  {
    id: 1,
    title: 'İstanbul Film Festivali',
    date: '15-25 Nisan 2024',
    location: 'İstanbul',
    category: 'Festival',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80',
    description: 'Türkiye\'nin en prestijli film festivali'
  },
  {
    id: 2,
    title: 'Kapadokya Balon Festivali',
    date: '1-5 Mayıs 2024',
    location: 'Nevşehir',
    category: 'Etkinlik',
    image: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&q=80',
    description: 'Gökyüzünde renk cümbüşü'
  },
  {
    id: 3,
    title: 'Efes Caz Festivali',
    date: '10-12 Haziran 2024',
    location: 'İzmir',
    category: 'Müzik',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80',
    description: 'Antik kentte caz keyfi'
  }
];

export default function EventsCalendar() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
            <CalendarIcon className="w-4 h-4 mr-2" />
            Yaklaşan Etkinlikler
          </span>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Kaçırılmayacak Etkinlikler</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/90 backdrop-blur-sm text-gray-900">
                    {event.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {event.date}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}