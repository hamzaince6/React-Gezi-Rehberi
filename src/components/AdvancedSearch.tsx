import React, { useState } from 'react';
import { Search, Filter, Calendar, DollarSign } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { SearchFilters } from '../types';

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
}

export default function AdvancedSearch({ onSearch }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    destination: '',
    dateRange: undefined,
    budget: undefined,
    activities: [],
    accommodation: [],
    transportation: []
  });

  const [showFilters, setShowFilters] = useState(false);

  const activities = [
    'Tarihi Yerler',
    'Plajlar',
    'Müzeler',
    'Doğa Yürüyüşü',
    'Yemek Turu',
    'Alışveriş'
  ];

  const accommodations = [
    'Otel',
    'Apart',
    'Pansiyon',
    'Kamp',
    'Villa'
  ];

  const transportations = [
    'Uçak',
    'Otobüs',
    'Araç Kiralama',
    'Transfer'
  ];

  const handleSearch = () => {
    onSearch(filters);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Nereyi keşfetmek istersiniz?"
              value={filters.destination}
              onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Filter className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Ara
        </button>
      </div>

      {showFilters && (
        <div className="space-y-6 mt-6 border-t pt-6">
          {/* Tarih Aralığı */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Tarih Aralığı</h3>
            <div className="grid grid-cols-2 gap-4">
              <DatePicker
                selected={filters.dateRange?.start}
                onChange={(date) => setFilters({
                  ...filters,
                  dateRange: { ...filters.dateRange, start: date as Date }
                })}
                placeholderText="Başlangıç Tarihi"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <DatePicker
                selected={filters.dateRange?.end}
                onChange={(date) => setFilters({
                  ...filters,
                  dateRange: { ...filters.dateRange, end: date as Date }
                })}
                placeholderText="Bitiş Tarihi"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Bütçe Aralığı */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Bütçe Aralığı</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="number"
                  placeholder="Min"
                  onChange={(e) => setFilters({
                    ...filters,
                    budget: { ...filters.budget, min: Number(e.target.value) }
                  })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="number"
                  placeholder="Max"
                  onChange={(e) => setFilters({
                    ...filters,
                    budget: { ...filters.budget, max: Number(e.target.value) }
                  })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Aktiviteler */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Aktiviteler</h3>
            <div className="flex flex-wrap gap-2">
              {activities.map((activity) => (
                <button
                  key={activity}
                  onClick={() => {
                    const newActivities = filters.activities?.includes(activity)
                      ? filters.activities.filter(a => a !== activity)
                      : [...(filters.activities || []), activity];
                    setFilters({ ...filters, activities: newActivities });
                  }}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.activities?.includes(activity)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {activity}
                </button>
              ))}
            </div>
          </div>

          {/* Konaklama */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Konaklama</h3>
            <div className="flex flex-wrap gap-2">
              {accommodations.map((accommodation) => (
                <button
                  key={accommodation}
                  onClick={() => {
                    const newAccommodations = filters.accommodation?.includes(accommodation)
                      ? filters.accommodation.filter(a => a !== accommodation)
                      : [...(filters.accommodation || []), accommodation];
                    setFilters({ ...filters, accommodation: newAccommodations });
                  }}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.accommodation?.includes(accommodation)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {accommodation}
                </button>
              ))}
            </div>
          </div>

          {/* Ulaşım */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Ulaşım</h3>
            <div className="flex flex-wrap gap-2">
              {transportations.map((transportation) => (
                <button
                  key={transportation}
                  onClick={() => {
                    const newTransportations = filters.transportation?.includes(transportation)
                      ? filters.transportation.filter(t => t !== transportation)
                      : [...(filters.transportation || []), transportation];
                    setFilters({ ...filters, transportation: newTransportations });
                  }}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.transportation?.includes(transportation)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {transportation}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}