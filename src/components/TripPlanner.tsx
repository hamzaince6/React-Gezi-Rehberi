import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { PlannedTrip, TripActivity } from '../types';

interface TripPlannerProps {
  onSave: (trip: PlannedTrip) => void;
}

export default function TripPlanner({ onSave }: TripPlannerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [activities, setActivities] = useState<TripActivity[]>([]);
  const [budget, setBudget] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [destination, setDestination] = useState('');
  const [savedTrips, setSavedTrips] = useState<PlannedTrip[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('plannedTrips');
    if (saved) {
      setSavedTrips(JSON.parse(saved));
    }
  }, []);

  const handleAddActivity = () => {
    const newActivity: TripActivity = {
      id: Date.now().toString(),
      name: '',
      date: new Date(),
      location: '',
      duration: 1,
      notes: ''
    };
    setActivities([...activities, newActivity]);
  };

  const handleSave = () => {
    if (!startDate || !endDate || !destination) {
      alert('Lütfen gerekli alanları doldurun');
      return;
    }

    const newTrip: PlannedTrip = {
      id: Date.now().toString(),
      destination,
      startDate,
      endDate,
      activities,
      notes,
      budget,
      participants: []
    };

    const updatedTrips = [...savedTrips, newTrip];
    setSavedTrips(updatedTrips);
    localStorage.setItem('plannedTrips', JSON.stringify(updatedTrips));

    // Form alanlarını temizle
    setDestination('');
    setStartDate(null);
    setEndDate(null);
    setActivities([]);
    setBudget(0);
    setNotes('');
    setIsFormOpen(false);

    onSave(newTrip);
  };

  const handleDeleteTrip = (tripId: string) => {
    const updatedTrips = savedTrips.filter(trip => trip.id !== tripId);
    setSavedTrips(updatedTrips);
    localStorage.setItem('plannedTrips', JSON.stringify(updatedTrips));
  };

  return (
    <div className="space-y-8">
      {/* Accordion Header */}
      <div className="bg-white rounded-2xl shadow-lg">
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="w-full px-6 py-4 flex items-center justify-between text-left"
        >
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <span className="text-lg font-semibold text-gray-900">
              Yeni Seyahat Planı Oluştur
            </span>
          </div>
          {isFormOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>

        {/* Accordion Content */}
        {isFormOpen && (
          <div className="p-6 border-t border-gray-100">
            <div className="space-y-6">
              {/* Form içeriği */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destinasyon</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nereye gidiyorsunuz?"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Başlangıç Tarihi</label>
                  <DatePicker
                    selected={startDate}
                    onChange={({date}: { date: any }) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bitiş Tarihi</label>
                  <DatePicker
                    selected={endDate}
                    onChange={({date}: { date: any }) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bütçe (₺)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₺</span>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Aktiviteler</h3>
                  <button
                    onClick={handleAddActivity}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Aktivite Ekle
                  </button>
                </div>
                
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <div key={activity.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Aktivite Adı"
                          value={activity.name}
                          onChange={(e) => {
                            const newActivities = [...activities];
                            newActivities[index].name = e.target.value;
                            setActivities(newActivities);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                          type="text"
                          placeholder="Konum"
                          value={activity.location}
                          onChange={(e) => {
                            const newActivities = [...activities];
                            newActivities[index].location = e.target.value;
                            setActivities(newActivities);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notlar</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={handleSave}
                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Planı Kaydet
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Kayıtlı Planlar */}
      {savedTrips.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Kayıtlı Planlarım</h2>
          <div className="space-y-4">
            {savedTrips.map((trip) => (
              <div key={trip.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{trip.destination}</h3>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">
                        <Calendar className="inline-block w-4 h-4 mr-2" />
                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="inline-block mr-2">₺</span>
                        {trip.budget.toLocaleString('tr-TR')} TL
                      </p>
                    </div>
                    {trip.activities.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700">Planlanmış Aktiviteler:</p>
                        <ul className="mt-1 space-y-1">
                          {trip.activities.map((activity) => (
                            <li key={activity.id} className="text-sm text-gray-600">
                              • {activity.name} - {activity.location}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteTrip(trip.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}