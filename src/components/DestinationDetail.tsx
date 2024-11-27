import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { Star, Clock, Sun, ArrowLeft, MapPin } from 'lucide-react';

interface Destination {
  id: number;
  name: string;
  image: string;
  description: string;
  rating: number;
  duration: string;
  bestSeason: string;
  gallery: string[];
  details: {
    history: string;
    attractions: string[];
    activities: string[];
  };
}

interface DestinationDetailProps {
  destinations: Destination[];
}

export default function DestinationDetail({ destinations }: DestinationDetailProps) {
  const { id } = useParams();
  const destination = destinations.find(d => d.id === Number(id));

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Destinasyon bulunamadı</h2>
          <Link to="/" className="text-indigo-600 hover:text-indigo-800 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Slider */}
      <div className="relative h-[70vh]">
        <Splide
          options={{
            type: 'fade',
            rewind: true,
            arrows: true,
            pagination: true,
          }}
        >
          {destination.gallery.map((image, index) => (
            <SplideSlide key={index}>
              <div className="relative h-[70vh]">
                <img
                  src={image}
                  alt={`${destination.name} - Görsel ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30" />
              </div>
            </SplideSlide>
          ))}
        </Splide>
        
        {/* Back Button */}
        <Link
          to="/"
          className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center text-gray-900 hover:bg-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Ana Sayfa
        </Link>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{destination.name}</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{destination.description}</p>
            
            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-8">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 mr-2" />
                <span className="text-gray-900">{destination.rating} puan</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-900">{destination.duration}</span>
              </div>
              <div className="flex items-center">
                <Sun className="w-5 h-5 text-orange-400 mr-2" />
                <span className="text-gray-900">{destination.bestSeason}</span>
              </div>
            </div>
          </div>

          {/* History */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tarihçe</h2>
            <p className="text-gray-700 leading-relaxed">{destination.details.history}</p>
          </div>

          {/* Attractions */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gezilecek Yerler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {destination.details.attractions.map((attraction, index) => (
                <div key={index} className="flex items-start space-x-4 bg-white p-6 rounded-2xl shadow-sm">
                  <MapPin className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                  <span className="text-gray-700">{attraction}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activities */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Aktiviteler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {destination.details.activities.map((activity, index) => (
                <div key={index} className="bg-white/50 backdrop-blur-sm p-4 rounded-xl text-center">
                  <span className="text-gray-700">{activity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}