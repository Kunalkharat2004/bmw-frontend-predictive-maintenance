/**
 * NearbyWorkshops Component
 * Displays nearby car service centers/workshops using Google Maps
 * Features: Location detection, interactive map, service center list
 */
import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Collapse,
  Card,
  CardContent,
  Rating,
  Divider,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  CarRepair as WorkshopIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Phone as PhoneIcon,
  Language as WebsiteIcon,
  AccessTime as OpenIcon,
  Directions as DirectionsIcon,
  MyLocation as MyLocationIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { useThemeMode } from '../context/ThemeContext';
import { getServiceCenters } from '../services/api';

// Google Maps API libraries to load
const LIBRARIES = ['places'];

// Map container style
const mapContainerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '12px'
};

// Dark mode map styles
const darkMapStyles = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#283d6a' }] }
];

const NearbyWorkshops = () => {
  const theme = useTheme();
  const { isDark } = useThemeMode();
  
  // State
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [serviceCenters, setServiceCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [locationRequested, setLocationRequested] = useState(false);

  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: LIBRARIES
  });

  // Theme-based colors
  const colors = useMemo(() => ({
    cardBg: isDark ? 'rgba(22, 27, 34, 0.8)' : 'rgba(255, 255, 255, 0.95)',
    cardBorder: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    textPrimary: isDark ? '#ffffff' : '#0f172a',
    textSecondary: isDark ? 'rgba(255,255,255,0.6)' : '#64748b',
    headerBg: isDark 
      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)'
      : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
    openBadge: isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)',
    closedBadge: isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
    listItemBg: isDark ? 'rgba(30, 35, 42, 0.6)' : 'rgba(248, 250, 252, 0.9)',
    listItemHover: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'
  }), [isDark]);

  // Get user's current location
  const getCurrentLocation = useCallback(() => {
    setLocationRequested(true);
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        
        // Fetch nearby service centers
        try {
          const response = await getServiceCenters(latitude, longitude, 15000);
          if (response.success) {
            setServiceCenters(response.service_centers || []);
          } else {
            setError('Failed to fetch nearby workshops');
          }
        } catch (err) {
          console.error('Error fetching service centers:', err);
          setError(err.message || 'Failed to load nearby workshops');
        }
        
        setLoading(false);
      },
      (err) => {
        console.error('Geolocation error:', err);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location permission denied. Please enable location access in your browser settings.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information unavailable. Please try again.');
            break;
          case err.TIMEOUT:
            setError('Location request timed out. Please try again.');
            break;
          default:
            setError('An error occurred while getting your location.');
        }
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  // Toggle expand/collapse
  const handleToggleExpand = useCallback(() => {
    setExpanded(prev => !prev);
    if (!expanded && !locationRequested) {
      getCurrentLocation();
    }
  }, [expanded, locationRequested, getCurrentLocation]);

  // Map options
  const mapOptions = useMemo(() => ({
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true,
    styles: isDark ? darkMapStyles : []
  }), [isDark]);

  // Calculate map center
  const mapCenter = useMemo(() => {
    if (userLocation) return userLocation;
    return { lat: 19.076, lng: 72.8777 }; // Default: Mumbai
  }, [userLocation]);

  // Open directions in Google Maps
  const openDirections = useCallback((center) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${center.latitude},${center.longitude}&travelmode=driving`;
      window.open(url, '_blank');
    }
  }, [userLocation]);

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        bgcolor: colors.cardBg,
        border: `1px solid ${colors.cardBorder}`,
        backdropFilter: 'blur(10px)'
      }}
    >
      {/* Header - Always Visible */}
      <Box
        onClick={handleToggleExpand}
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          background: colors.headerBg,
          borderBottom: expanded ? `1px solid ${colors.cardBorder}` : 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            filter: 'brightness(1.05)'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
              display: 'flex'
            }}
          >
            <WorkshopIcon sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="700" color={colors.textPrimary}>
              Find Nearby Workshops
            </Typography>
            <Typography variant="body2" color={colors.textSecondary}>
              Locate car service centers near your location
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {serviceCenters.length > 0 && (
            <Chip
              label={`${serviceCenters.length} found`}
              size="small"
              sx={{
                bgcolor: isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)',
                color: isDark ? '#4ade80' : '#16a34a',
                fontWeight: 600
              }}
            />
          )}
          <IconButton 
            size="small"
            sx={{ color: colors.textSecondary }}
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      {/* Collapsible Content */}
      <Collapse in={expanded}>
        <Box sx={{ p: 2.5 }}>
          {/* Loading State */}
          {loading && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
              <CircularProgress size={48} sx={{ color: '#3b82f6', mb: 2 }} />
              <Typography color={colors.textSecondary}>
                Getting your location and finding nearby workshops...
              </Typography>
            </Box>
          )}

          {/* Error State */}
          {error && !loading && (
            <Alert 
              severity="error" 
              sx={{ mb: 2, borderRadius: 2 }}
              action={
                <Button color="inherit" size="small" onClick={getCurrentLocation}>
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          {/* Map and Results */}
          {!loading && userLocation && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Google Map */}
              {isLoaded && !loadError ? (
                <Box sx={{ borderRadius: 3, overflow: 'hidden', border: `1px solid ${colors.cardBorder}` }}>
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={mapCenter}
                    zoom={13}
                    options={mapOptions}
                  >
                    {/* User Location Marker */}
                    <Marker
                      position={userLocation}
                      icon={{
                        path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
                        scale: 10,
                        fillColor: '#3b82f6',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 3
                      }}
                      title="Your Location"
                    />

                    {/* Service Center Markers */}
                    {serviceCenters.map((center, index) => (
                      <Marker
                        key={center.id || index}
                        position={{ lat: center.latitude, lng: center.longitude }}
                        onClick={() => setSelectedCenter(center)}
                        icon={{
                          url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
                        }}
                        title={center.name}
                      />
                    ))}

                    {/* Info Window for Selected Marker */}
                    {selectedCenter && (
                      <InfoWindow
                        position={{ lat: selectedCenter.latitude, lng: selectedCenter.longitude }}
                        onCloseClick={() => setSelectedCenter(null)}
                      >
                        <Box sx={{ p: 1, minWidth: 200 }}>
                          <Typography variant="subtitle2" fontWeight="700" gutterBottom>
                            {selectedCenter.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {selectedCenter.address}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                            <Rating value={selectedCenter.rating} readOnly size="small" precision={0.1} />
                            <Typography variant="caption">({selectedCenter.total_ratings})</Typography>
                          </Box>
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<DirectionsIcon />}
                            onClick={() => openDirections(selectedCenter)}
                            sx={{
                              background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
                              fontSize: '0.75rem'
                            }}
                          >
                            Get Directions
                          </Button>
                        </Box>
                      </InfoWindow>
                    )}
                  </GoogleMap>
                </Box>
              ) : loadError ? (
                <Alert severity="warning" sx={{ borderRadius: 2 }}>
                  Map could not be loaded. Please check your API key configuration.
                </Alert>
              ) : (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: colors.listItemBg, borderRadius: 3 }}>
                  <CircularProgress size={32} />
                </Box>
              )}

              {/* Service Centers List */}
              <Box>
                <Typography variant="overline" sx={{ color: colors.textSecondary, letterSpacing: 1.5, fontWeight: 700, mb: 2, display: 'block' }}>
                  Nearby Service Centers ({serviceCenters.length})
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {serviceCenters.map((center, index) => (
                    <Card
                      key={center.id || index}
                      elevation={0}
                      sx={{
                        bgcolor: colors.listItemBg,
                        border: `1px solid ${colors.cardBorder}`,
                        borderRadius: 2,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: colors.listItemHover,
                          transform: 'translateY(-2px)',
                          boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)'
                        }
                      }}
                      onClick={() => setSelectedCenter(center)}
                    >
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" fontWeight="700" color={colors.textPrimary}>
                              {center.name}
                            </Typography>
                            <Typography variant="body2" color={colors.textSecondary} sx={{ mt: 0.5 }}>
                              <LocationIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                              {center.address}
                            </Typography>
                          </Box>
                          
                          {/* Distance Badge */}
                          <Chip
                            label={`${center.distance_km} km`}
                            size="small"
                            sx={{
                              bgcolor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                              color: '#3b82f6',
                              fontWeight: 700,
                              fontSize: '0.75rem'
                            }}
                          />
                        </Box>

                        <Divider sx={{ my: 1.5, borderColor: colors.cardBorder }} />

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                          {/* Rating */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <StarIcon sx={{ color: '#f59e0b', fontSize: 18 }} />
                            <Typography variant="body2" fontWeight="600" color={colors.textPrimary}>
                              {center.rating || 'N/A'}
                            </Typography>
                            <Typography variant="caption" color={colors.textSecondary}>
                              ({center.total_ratings} reviews)
                            </Typography>
                          </Box>

                          {/* Open/Closed Status */}
                          {center.is_open !== null && (
                            <Chip
                              icon={<OpenIcon sx={{ fontSize: 14 }} />}
                              label={center.is_open ? 'Open' : 'Closed'}
                              size="small"
                              sx={{
                                bgcolor: center.is_open ? colors.openBadge : colors.closedBadge,
                                color: center.is_open ? '#22c55e' : '#ef4444',
                                fontWeight: 600,
                                fontSize: '0.7rem',
                                '& .MuiChip-icon': {
                                  color: center.is_open ? '#22c55e' : '#ef4444'
                                }
                              }}
                            />
                          )}

                          {/* Actions */}
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {center.phone && (
                              <Tooltip title="Call">
                                <IconButton
                                  size="small"
                                  component="a"
                                  href={`tel:${center.phone}`}
                                  sx={{ 
                                    color: colors.textSecondary,
                                    '&:hover': { color: '#3b82f6' }
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <PhoneIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {center.website && (
                              <Tooltip title="Website">
                                <IconButton
                                  size="small"
                                  component="a"
                                  href={center.website}
                                  target="_blank"
                                  sx={{ 
                                    color: colors.textSecondary,
                                    '&:hover': { color: '#3b82f6' }
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <WebsiteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Get Directions">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDirections(center);
                                }}
                                sx={{ 
                                  color: colors.textSecondary,
                                  '&:hover': { color: '#10b981' }
                                }}
                              >
                                <DirectionsIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}

                  {serviceCenters.length === 0 && !loading && !error && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography color={colors.textSecondary}>
                        No service centers found nearby. Try increasing the search radius.
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Refresh Location Button */}
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  startIcon={<MyLocationIcon />}
                  onClick={getCurrentLocation}
                  sx={{
                    borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                    color: colors.textPrimary,
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#3b82f6',
                      bgcolor: 'rgba(59, 130, 246, 0.1)'
                    }
                  }}
                >
                  Refresh Location
                </Button>
              </Box>
            </Box>
          )}

          {/* Initial State - Before Location Request */}
          {!loading && !userLocation && !error && locationRequested && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color={colors.textSecondary}>
                Waiting for location permission...
              </Typography>
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default NearbyWorkshops;
