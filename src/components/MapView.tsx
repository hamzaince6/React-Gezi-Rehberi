import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import 'leaflet.fullscreen/Control.FullScreen.css';
import 'leaflet-measure/dist/leaflet-measure.css';
import { MapLocation } from '../types';
import {
  Search,
  Navigation,
  Layers,
  Maximize,
  Ruler,
  Map as MapIcon,
  Pencil,
  Trash2,
  Route
} from 'lucide-react';

// Leaflet plugins
import 'leaflet.markercluster';
import '@geoman-io/leaflet-geoman-free';
import 'leaflet.fullscreen';
import 'leaflet-routing-machine';
import 'leaflet-measure';
import 'leaflet.heat';

// Default icon setup
const DefaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  locations: MapLocation[];
  center: { lat: number; lng: number };
}

// Map Controls Component
function MapControls() {
  const map = useMap();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const routingControl = useRef<any>(null);

  useEffect(() => {
    // Initialize plugins
    map.pm.addControls({
      position: 'topleft',
      drawCircle: false,
    });

    // Add fullscreen control
    L.control.fullscreen({
      position: 'topleft',
      title: 'Tam Ekran',
      titleCancel: 'Tam Ekrandan Çık'
    }).addTo(map);

    // Add measure control
    const measureControl = new (L.Control as any).Measure({
      position: 'topleft',
      primaryLengthUnit: 'meters',
      secondaryLengthUnit: 'kilometers',
      primaryAreaUnit: 'sqmeters',
      secondaryAreaUnit: 'hectares'
    });
    measureControl.addTo(map);

    return () => {
      map.pm.removeControls();
      if (routingControl.current) {
        map.removeControl(routingControl.current);
      }
    };
  }, [map]);

  // Search functionality
  const handleSearch = () => {
    if (!searchTerm) return;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchTerm}`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          const { lat, lon } = data[0];
          map.setView([lat, lon], 13);
          L.marker([lat, lon]).addTo(map)
            .bindPopup(data[0].display_name)
            .openPopup();
        }
      });
  };

  // Route planning
  const startRouting = () => {
    if (routingControl.current) {
      map.removeControl(routingControl.current);
    }

    routingControl.current = L.Routing.control({
      waypoints: [],
      routeWhileDragging: true,
      showAlternatives: true,
      fitSelectedRoutes: true,
      language: 'tr'
    }).addTo(map);
  };

  // Toggle drawing mode
  const toggleDrawing = () => {
    if (isDrawing) {
      map.pm.disableDraw();
    } else {
      map.pm.enableDraw('Polygon');
    }
    setIsDrawing(!isDrawing);
  };

  // Clear all drawings and routes
  const clearAll = () => {
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Polygon || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });
    if (routingControl.current) {
      map.removeControl(routingControl.current);
      routingControl.current = null;
    }
  };

  return (
    <div className="absolute top-4 left-4 z-[1000] space-y-2">
      {/* Search Bar */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Konum ara..."
          className="px-3 py-2 rounded-lg border shadow-sm"
        />
        <button
          onClick={handleSearch}
          className="p-2 bg-white rounded-lg shadow hover:bg-gray-50"
          title="Ara"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Control Buttons */}
      <div className="bg-white rounded-lg shadow p-2 space-y-2">
        <button
          onClick={startRouting}
          className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 rounded"
          title="Rota Planla"
        >
          <Route className="w-5 h-5" />
          <span>Rota Planla</span>
        </button>

        <button
          onClick={toggleDrawing}
          className={`w-full flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 rounded ${
            isDrawing ? 'bg-indigo-50 text-indigo-600' : ''
          }`}
          title="Çizim Modu"
        >
          <Pencil className="w-5 h-5" />
          <span>Çizim Modu</span>
        </button>

        <button
          onClick={clearAll}
          className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 rounded text-red-600"
          title="Temizle"
        >
          <Trash2 className="w-5 h-5" />
          <span>Temizle</span>
        </button>
      </div>
    </div>
  );
}

// Marker Cluster Component
function MarkerClusterGroup({ locations }: { locations: MapLocation[] }) {
  const map = useMap();
  
  useEffect(() => {
    const markers = L.markerClusterGroup();
    
    locations.forEach(location => {
      const marker = L.marker([location.lat, location.lng])
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-bold">${location.name}</h3>
            <p>${location.description || ''}</p>
            ${location.rating ? `
              <div class="flex items-center mt-2">
                <span class="text-yellow-400">★</span>
                <span class="ml-1">${location.rating}</span>
              </div>
            ` : ''}
          </div>
        `);
      markers.addLayer(marker);
    });

    map.addLayer(markers);

    return () => {
      map.removeLayer(markers);
    };
  }, [locations, map]);

  return null;
}

export default function MapView({ locations, center }: MapViewProps) {
  return (
    <div className="relative">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        className="w-full h-[600px] rounded-xl"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        <MapControls />
        <MarkerClusterGroup locations={locations} />
      </MapContainer>
    </div>
  );
}