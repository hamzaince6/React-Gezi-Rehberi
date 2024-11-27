import React from 'react';
import { MapPin, Utensils, Cloud, Camera, Train, Info, Sun, CloudRain, Wind, Thermometer, Bookmark, UserPlus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TravelGridProps {
  results: {
    description: string;
    attractions: Array<{
      name: string;
      description: string;
      imageUrl: string;
      link: string;
    }>;
    weather: string;
    restaurants: Array<{
      name: string;
      cuisine: string;
      description: string;
      imageUrl: string;
      link: string;
    }>;
    culturalInfo: string;
    transportationTips: string;
  };
}

export default function TravelGrid({ results }: TravelGridProps) {
  const navigate = useNavigate();

  const handleSaveTrip = () => {
    // Burada localStorage'a kaydetme işlemi yapılacak
    const savedTrips = JSON.parse(localStorage.getItem('savedTrips') || '[]');
    const newTrip = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      destination: '', // Kayıtlı Alanlar Başlık
      image: results.attractions[0]?.imageUrl || 'default-image-url',
      description: results.description,
      highlights: results.attractions.slice(0, 3).map(a => a.name)
    };
    savedTrips.push(newTrip);
    localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
    navigate('/saved-trips');
  };

  const handleAssignGuide = () => {
    navigate('/guides');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 mb-8">
        <button
          onClick={handleSaveTrip}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Bookmark className="w-5 h-5 mr-2" />
          Geziyi Kaydet
        </button>
        <button
          onClick={handleAssignGuide}
          className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Rehber Ata
        </button>
      </div>

      <div className="space-y-12">
        {/* Şehir Bilgileri */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Şehir Hakkında</h2>
          <p className="text-gray-700 leading-relaxed">{results.description}</p>
        </div>

        {/* Gezilecek Yerler */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Gezilecek Yerler</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {results.attractions.map((attraction, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-lg overflow-hidden">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={attraction.imageUrl}
                    alt={attraction.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{attraction.name}</h3>
                  <p className="text-gray-600 mb-4">{attraction.description}</p>
                  <div className="flex items-center space-x-4">
                    <a
                      href="#"
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      Detaylı bilgi
                    </a>
                    <a
                      href={attraction.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      Haritada gör
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Restoranlar */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Önerilen Restoranlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {results.restaurants.map((restaurant, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-lg overflow-hidden">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{restaurant.name}</h3>
                  <p className="text-indigo-600 text-sm font-medium mb-3">{restaurant.cuisine}</p>
                  <p className="text-gray-600 mb-4">{restaurant.description}</p>
                  <div className="flex items-center justify-between">
                    <a
                      href="#"
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      Detaylı bilgi
                    </a>
                    <a
                      href={restaurant.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      Restorana git
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alt Bilgiler */}
        <div className="grid grid-cols-1 gap-6">
          {/* Hava Durumu */}
          <div className="bg-gradient-to-br from-sky-50 to-indigo-50 rounded-3xl p-8">
            <div className="flex items-center mb-6">
              <div className="flex space-x-3 text-sky-600">
                <Sun className="w-6 h-6" />
                <CloudRain className="w-6 h-6" />
                <Wind className="w-6 h-6" />
                <Thermometer className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 ml-4">Hava Durumu</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">{results.weather}</p>
          </div>

          {/* Kültürel Bilgiler */}
          <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-3xl p-8">
            <div className="flex items-center mb-6">
              <Info className="w-6 h-6 text-rose-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Kültürel Bilgiler</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">{results.culturalInfo}</p>
          </div>

          {/* Ulaşım */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8">
            <div className="flex items-center mb-6">
              <div className="flex space-x-3 text-emerald-600">
                <Train className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 ml-4">Ulaşım</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">{results.transportationTips}</p>
          </div>
        </div>
      </div>
    </div>
  );
}