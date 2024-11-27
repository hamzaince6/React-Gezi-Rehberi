import React, { useState } from 'react';
import { Search, Calendar, ArrowLeft } from 'lucide-react';

interface SearchBarProps {
  onSearch: (location: string, dates: string) => void;
  onReset: () => void;
  isSearched: boolean;
}

export default function SearchBar({ onSearch, onReset, isSearched }: SearchBarProps) {
  const [location, setLocation] = useState('');
  const [dates, setDates] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      onSearch(location.trim(), dates);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
      {isSearched && (
        <button
          type="button"
          onClick={onReset}
          className="md:px-4 py-3 text-indigo-600 hover:text-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-2xl flex items-center justify-center md:justify-start"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Ana Sayfa</span>
        </button>
      )}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Nereyi keşfetmek istersiniz?"
          className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-transparent bg-white/90 backdrop-blur-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
        />
      </div>
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="date"
          value={dates}
          onChange={(e) => setDates(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-transparent bg-white/90 backdrop-blur-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
        />
      </div>
      <button
        type="submit"
        className="px-8 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Keşfet
      </button>
    </form>
  );
}