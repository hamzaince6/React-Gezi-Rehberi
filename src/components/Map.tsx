import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import '../utils/leaflet-setup';

interface MapProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    position: [number, number];
    title: string;
  }>;
  routing?: {
    start: [number, number];
    end: [number, number];
  };
}

const Map: React.FC<MapProps> = ({
  center = [41.0082, 28.9784], // İstanbul'un koordinatları
  zoom = 13,
  markers = [],
  routing
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const routingControlRef = useRef<L.Routing.Control | null>(null);

  useEffect(() => {
    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView(center, zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);
    }

    // Add markers
    markers.forEach(marker => {
      L.marker(marker.position)
        .bindPopup(marker.title)
        .addTo(mapRef.current!);
    });

    // Add routing if provided
    if (routing && mapRef.current) {
      if (routingControlRef.current) {
        routingControlRef.current.remove();
      }

      routingControlRef.current = L.Routing.control({
        waypoints: [
          L.latLng(routing.start[0], routing.start[1]),
          L.latLng(routing.end[0], routing.end[1])
        ],
        routeWhileDragging: true
      }).addTo(mapRef.current);
    }

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (routingControlRef.current) {
        routingControlRef.current.remove();
        routingControlRef.current = null;
      }
    };
  }, [center, zoom, markers, routing]);

  return <div id="map" style={{ height: '400px', width: '100%' }} />;
};

export default Map;
