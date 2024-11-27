import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Search, Star, MapPin, Clock, Users, Loader2 } from 'lucide-react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import TravelGrid from './components/TravelGrid';
import DestinationDetail from './components/DestinationDetail';
import SavedTrips from './pages/SavedTrips';
import Guides from './pages/Guides';
import MapView from './components/MapView';
import TripPlanner from './components/TripPlanner';
import InspirationSection from './components/InspirationSection';
import EventsCalendar from './components/EventsCalendar';
import Contact from './components/Contact';
import AdminLayout from './components/admin/AdminLayout';
import Login from './components/admin/Login';
import Dashboard from './components/admin/Dashboard';
import Stories from './components/admin/Stories';
import TravelStories from './components/TravelStories';
import AllStories from './pages/AllStories';
import StoryDetail from './pages/StoryDetail';
import { getTravelRecommendations } from './api/travelApi';
import { popularDestinations } from './data/destinations';

const featuredRestaurants = [
  {
    id: 1,
    name: 'Köfteci Ramiz',
    image: 'https://images.unsplash.com/photo-1620167794423-10446fbd3bcd?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    cuisine: 'Türk Mutfağı',
    rating: 4.7,
    priceRange: '₺₺',
    locationUrl:'https://www.google.com/maps/search/istanbul+k%C3%B6fteci+ramiz/@40.9820649,28.875839,11z/data=!3m1!4b1?authuser=0&entry=ttu&g_ep=EgoyMDI0MTExOS4wIKXMDSoASAFQAw%3D%3D'
  },
  {
    id: 2,
    name: 'Kebapçı Halil Usta',
    image: 'https://images.unsplash.com/photo-1672246586198-048ad2e19d74?q=80&w=2222&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    cuisine: 'Kebap',
    rating: 4.8,
    priceRange: '₺₺',
    locationUrl:'https://www.google.com/maps/search/istanbul+k%C3%B6fteci+ramiz/@40.9820649,28.875839,11z/data=!3m1!4b1?authuser=0&entry=ttu&g_ep=EgoyMDI0MTExOS4wIKXMDSoASAFQAw%3D%3D'
  },
  {
    id: 3,
    name: 'Balıkçı Mehmet',
    image: 'https://plus.unsplash.com/premium_photo-1674498270805-d1fbcbeef7da?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    cuisine: 'Deniz Ürünleri',
    rating: 4.9,
    priceRange: '₺₺₺',
    locationUrl:'https://www.google.com/maps/search/istanbul+k%C3%B6fteci+ramiz/@40.9820649,28.875839,11z/data=!3m1!4b1?authuser=0&entry=ttu&g_ep=EgoyMDI0MTExOS4wIKXMDSoASAFQAw%3D%3D'
  }
];

export default function App() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const location = useLocation();

  // Check if current route is admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleSearch = async (location: string, dates: string) => {
    setLoading(true);
    setHasSearched(true);
    try {
      const data = await getTravelRecommendations(location, dates);
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setHasSearched(false);
    setLoading(false);
  };

  return (
    <>
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="stories" element={<Stories />} />
        </Route>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/stories" element={<AllStories />} />
        <Route path="/stories/:id" element={<StoryDetail />} />
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-white pt-16">
              <div
                className={`relative ${
                  hasSearched ? 'h-[40vh]' : 'h-[80vh]'
                } overflow-hidden transition-all duration-500`}
              >
                <img
                  src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2021&q=80"
                  alt="Travel Background"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative h-full flex items-center">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="text-center">
                      {!hasSearched && (
                        <>
                          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Yeni Maceranı Keşfet
                          </h1>
                          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
                            Yapay zeka destekli öneriler ve kişiselleştirilmiş seyahat planları ile
                            hayalinizdeki tatili planlayın
                          </p>
                        </>
                      )}
                      <div className="max-w-2xl mx-auto">
                        <SearchBar onSearch={handleSearch} onReset={handleReset} isSearched={hasSearched} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {loading && (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                  <p className="text-xl text-gray-600">Seyahat önerileri hazırlanıyor...</p>
                </div>
              )}

              {!loading && results && <TravelGrid results={results} />}

              {!hasSearched && (
                  <>
                    {/* Features Section */}
                    <div className="py-20 bg-gray-50">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                          <h2 className="text-3xl font-bold text-gray-900">Neden Bizi Tercih Etmelisiniz?</h2>
                          <p className="mt-4 text-lg text-gray-600">
                            Seyahat planlamanızı kolaylaştıran özelliklerimiz
                          </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                              <Star className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">Kişiselleştirilmiş Öneriler</h3>
                            <p className="text-gray-600">
                              Tercihlerinize ve ilgi alanlarınıza göre özel seyahat önerileri sunuyoruz.
                            </p>
                          </div>
                          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                              <MapPin className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">Detaylı Rotalar</h3>
                            <p className="text-gray-600">
                              Gideceğiniz yerin en güzel noktalarını keşfetmeniz için özel rotalar
                              hazırlıyoruz.
                            </p>
                          </div>
                          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                              <Users className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">Yerel Deneyimler</h3>
                            <p className="text-gray-600">
                              Yerel rehberler ve gezginlerin önerileriyle otantik deneyimler yaşayın.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Travel Stories Section */}
                    <TravelStories />

                    {/* Popular Destinations */}
                    <div className="py-20">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                          <h2 className="text-3xl font-bold text-gray-900">Popüler Destinasyonlar</h2>
                          <p className="mt-4 text-lg text-gray-600">En çok tercih edilen tatil rotaları</p>
                        </div>
                        <Splide
                            options={{
                              type: 'loop',
                              autoplay: true,
                              interval: 3000,
                              arrows: false,
                              pagination: false,
                              pauseOnHover: false,
                              perPage: 3,
                              gap: '2rem',
                              breakpoints: {
                                768: {
                                  perPage: 1,
                                },
                                1024: {
                                  perPage: 2,
                                },
                              },
                            }}
                        >
                          {popularDestinations.map((destination) => (
                              <SplideSlide key={destination.id}>
                                <Link to={`/destination/${destination.id}`} className="block h-[30rem]">
                                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02] duration-300">
                                    <div className="relative h-64">
                                      <img
                                          src={destination.image}
                                          alt={destination.name}
                                          className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="p-6">
                                      <h3 className="text-xl font-bold mb-2">{destination.name}</h3>
                                      <p className="text-gray-600 mb-4">{destination.description}</p>
                                      <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center">
                                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                          <span>{destination.rating}</span>
                                        </div>
                                        <div className="flex items-center">
                                          <Clock className="w-4 h-4 text-gray-400 mr-1" />
                                          <span>{destination.duration}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              </SplideSlide>
                          ))}
                        </Splide>
                      </div>
                    </div>

                    {/* Featured Restaurants */}
                    <div className="py-20 bg-gray-50">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                          <h2 className="text-3xl font-bold text-gray-900">Öne Çıkan Restoranlar</h2>
                          <p className="mt-4 text-lg text-gray-600">Reklam & Sponsorluk</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          {featuredRestaurants.map((restaurant) => (
                              <div key={restaurant.id} className="bg-white rounded-2xl overflow-hidden shadow-lg">
                                <div className="relative h-48">
                                  <img
                                      src={restaurant.image}
                                      alt={restaurant.name}
                                      className="w-full h-full object-cover"
                                  />
                                  <div
                                      className="absolute top-4 right-4 bg-white px-2 py-1 rounded-lg text-sm font-medium">
                                    {restaurant.priceRange}
                                  </div>
                                </div>
                                <div className="p-6">
                                  <h3 className="text-xl font-bold mb-2">{restaurant.name}</h3>
                                  <p className="text-indigo-600 text-sm font-medium mb-3">{restaurant.cuisine}</p>
                                  <div className="flex items-center justify-between text-sm mb-3">
                                    <div className="flex items-center">
                                      <Star className="w-4 h-4 text-yellow-400 mr-1"/>
                                      <span>{restaurant.rating}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <MapPin className="w-4 h-4 text-gray-400 mr-1"/>
                                      <a
                                          href={restaurant.locationUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-600 hover:underline text-sm"
                                      >
                                        Haritada Görüntüle
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                          ))}
                        </div>

                      </div>
                    </div>
                  </>
              )}

              {!hasSearched && (
                <>
                  <InspirationSection />
                  <EventsCalendar />
                </>
              )}
            </div>
          }
        />
        <Route path="/saved-trips" element={<SavedTrips />} />
        <Route path="/guides" element={<Guides />} />
        <Route path="/destination/:id" element={<DestinationDetail destinations={popularDestinations} />} />
        <Route
          path="/map"
          element={
            <div className="min-h-screen pt-24 px-4 bg-gray-50">
              <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Harita Görünümü</h1>
                <MapView
                  locations={[
                    {
                      lat: 41.0082,
                      lng: 28.9784,
                      name: "İstanbul",
                      type: "attraction",
                      description: "Tarihi yarımada",
                      rating: 4.8
                    }
                  ]}
                  center={{ lat: 41.0082, lng: 28.9784 }}
                />
              </div>
            </div>
          }
        />
        <Route
          path="/trip-planner"
          element={
            <div className="min-h-screen pt-24 bg-gray-50">
              <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Seyahat Planlayıcı</h1>
                <TripPlanner onSave={() => {}} />
              </div>
            </div>
          }
        />
        <Route
            path="/contact"
            element={
              <div className="min-h-screen bg-gray-50">
                <Contact />
              </div>
            }
        />
      </Routes>
    </>
  );
}