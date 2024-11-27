export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  favorites: string[];
  plannedTrips: PlannedTrip[];
}

export interface PlannedTrip {
  id: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  activities: TripActivity[];
  notes: string;
  budget?: number;
  participants: string[];
}

export interface TripActivity {
  id: string;
  name: string;
  date: Date;
  location: string;
  duration: number;
  cost?: number;
  notes?: string;
}

export interface SearchFilters {
  destination?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  budget?: {
    min: number;
    max: number;
  };
  activities?: string[];
  accommodation?: string[];
  transportation?: string[];
}

export interface MapLocation {
  lat: number;
  lng: number;
  name: string;
  type: 'attraction' | 'restaurant' | 'hotel';
  rating?: number;
  description?: string;
}