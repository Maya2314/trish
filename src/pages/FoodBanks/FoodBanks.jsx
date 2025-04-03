import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import './FoodBanks.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom icon for user location
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Map update component
function MapUpdater({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

const FoodBanks = () => {
  const [foodBanks, setFoodBanks] = useState([]);
  const [selectedFoodBank, setSelectedFoodBank] = useState(null);
  const [userLocation, setUserLocation] = useState({
    lat: 51.5321, // Brunel University coordinates
    lng: -0.4727,
    name: "Brunel University London"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    fetchNearbyFoodBanks(userLocation.lat, userLocation.lng);
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  const fetchNearbyFoodBanks = async (lat, lng) => {
    try {
      const response = await axios.get(`http://localhost:8080/swapsaviour/foodbanks?lat=${lat}&lng=${lng}`);
      setFoodBanks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching food banks:', error);
      setError('Failed to fetch food banks. Please try again later.');
      setLoading(false);
    }
  };

  const formatDistance = (distance) => {
    if (distance == null) return 'Distance not available';
    return `${distance.toFixed(1)} km`;
  };

  if (loading) {
    return <div className="loading">Loading food banks...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="food-banks-container">
      <div className="food-banks-header">
        <h1>Local Food Banks</h1>
        <p>Find food banks near you that accept food donations</p>
      </div>

      <div className="map-container">
        <MapContainer
          key={`${userLocation.lat}-${userLocation.lng}`}
          center={[userLocation.lat, userLocation.lng]}
          zoom={12}
          style={{ height: '600px', width: '100%' }}
          whenCreated={setMap}
        >
          <MapUpdater center={[userLocation.lat, userLocation.lng]} zoom={12} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <Marker 
            position={[userLocation.lat, userLocation.lng]}
            icon={userIcon}
          >
            <Popup>
              <strong>{userLocation.name}</strong><br />
              Your Current Location
            </Popup>
          </Marker>

          {foodBanks.map((foodBank) => (
            <Marker
              key={foodBank.id}
              position={[foodBank.latitude, foodBank.longitude]}
              eventHandlers={{
                click: () => setSelectedFoodBank(foodBank),
              }}
            >
              <Popup>
                <div className="info-window">
                  <h3>{foodBank.name}</h3>
                  <p>{foodBank.address}</p>
                  <p><strong>Hours:</strong> {foodBank.openingHours}</p>
                  <p><strong>Phone:</strong> {foodBank.phone}</p>
                  <p><strong>Accepts:</strong> {foodBank.acceptedItems}</p>
                  <a
                    href={`https://www.openstreetmap.org/directions?from=${userLocation.lat},${userLocation.lng}&to=${foodBank.latitude},${foodBank.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="directions-link"
                  >
                    Get Directions
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="food-banks-list">
        <h2>Nearby Food Banks</h2>
        <div className="food-banks-grid">
          {foodBanks.map((foodBank) => (
            <div
              key={foodBank.id}
              className="food-bank-card"
              onClick={() => setSelectedFoodBank(foodBank)}
            >
              <h3>{foodBank.name}</h3>
              <p>{foodBank.address}</p>
              <p><strong>Distance:</strong> {formatDistance(foodBank.distance)}</p>
              <p><strong>Hours:</strong> {foodBank.openingHours || 'Hours not available'}</p>
              <button className="view-details-btn">View Details</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodBanks; 