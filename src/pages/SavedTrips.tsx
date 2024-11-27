import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, CalendarCheck, CalendarClock, Trash2 } from 'lucide-react';

interface SavedTrip {
  id: number;
  destination: string;
  image: string;
  date: string;
  description: string;
  highlights: string[];
}

export default function SavedTrips() {
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);

  useEffect(() => {
    const trips = JSON.parse(localStorage.getItem('savedTrips') || '[]');
    setSavedTrips(trips);
  }, []);

  const handleDeleteTrip = (id: number) => {
    const updatedTrips = savedTrips.filter(trip => trip.id !== id);
    localStorage.setItem('savedTrips', JSON.stringify(updatedTrips));
    setSavedTrips(updatedTrips);
  };

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <CalendarCheck className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-900">Kayıtlı Gezilerim</h2>
            </div>
          </div>
          <div className="p-6">
            {savedTrips.length > 0 ? (
              <div className="space-y-6">
                {savedTrips.map((trip) => (
                  <div key={trip.id} className="flex space-x-4 bg-white p-6 rounded-xl shadow-sm">
                    <div className="w-32 h-32 flex-shrink-0">
                      <img
                        src={trip.image}
                        alt={trip.destination}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {trip.destination}
                        </h3>
                        <button
                          onClick={() => handleDeleteTrip(trip.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2">{trip.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {trip.highlights.map((highlight, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Kaydedilme Tarihi: {trip.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">Henüz kaydedilmiş gezi bulunmamaktadır.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}