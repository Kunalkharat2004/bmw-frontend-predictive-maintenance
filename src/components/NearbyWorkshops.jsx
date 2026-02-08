/**
 * NearbyWorkshops Component
 * Displays nearby car service centers/workshops using Google Maps
 * Features: Location detection, interactive map, service center list
 * Now displays directly in tab (no collapsible wrapper)
 */
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
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
  Phone as PhoneIcon,
  Language as WebsiteIcon,
  AccessTime as OpenIcon,
  Directions as DirectionsIcon,
  MyLocation as MyLocationIcon,
  Star as StarIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { useThemeMode } from '../context/ThemeContext';
import { getServiceCenters } from '../services/api';

// Google Maps API libraries to load
const LIBRARIES = ['places'];

// Map container style - larger for tab view
const mapContainerStyle = {
  width: '100%',
  height: '350px',
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [serviceCenters, setServiceCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [hasInitialized, setHasInitialized] = useState(false);

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
    listItemHover: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
    emptyBg: isDark ? 'rgba(22, 27, 34, 0.6)' : 'rgba(248, 250, 252, 0.9)'
  }), [isDark]);

  // Get user's current location
  const getCurrentLocation = useCallback(() => {
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

  // Initial empty state - prompt user to enable location
  const showInitialPrompt = !loading && !userLocation && !error && !hasInitialized;
  
  // Handle find workshops click
  const handleFindWorkshops = useCallback(() => {
    setHasInitialized(true);
    getCurrentLocation();
  }, [getCurrentLocation]);

  return (
    <Box>
      {/* Initial Prompt - Before Location Request */}
      {showInitialPrompt && (
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 4, md: 6 }, 
            textAlign: 'center', 
            borderRadius: 3,
            bgcolor: colors.emptyBg,
            border: `1px dashed ${colors.cardBorder}`,
            backdropFilter: 'blur(10px)'
          }}
        >
          <Box 
            sx={{ 
              display: 'inline-flex', 
              p: 2.5, 
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
              borderRadius: '50%', 
              mb: 3,
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}
          >
            <LocationIcon sx={{ fontSize: 48, color: '#3b82f6' }} />
          </Box>
          <Typography variant="h5" fontWeight="700" color={colors.textPrimary} gutterBottom>
            Find Nearby Service Centers
          </Typography>
          <Typography color={colors.textSecondary} maxWidth="400px" mx="auto" lineHeight={1.7} sx={{ mb: 3 }}>
            Allow location access to discover car service centers and workshops near you. We'll show you ratings, contact info, and directions.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<SearchIcon />}
            onClick={handleFindWorkshops}
            sx={{ 
              px: 4,
              py: 1.5,
              fontWeight: 600,
              fontSize: '1rem'
            }}
          >
            Find Workshops Near Me
          </Button>
        </Paper>
      )}

      {/* Loading State */}
      {loading && (
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 4, md: 6 }, 
            textAlign: 'center', 
            borderRadius: 3,
            bgcolor: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`
          }}
        >
          <CircularProgress size={56} sx={{ color: '#3b82f6', mb: 3 }} />
          <Typography variant="h6" fontWeight="600" color={colors.textPrimary} gutterBottom>
            Finding Nearby Workshops...
          </Typography>
          <Typography color={colors.textSecondary}>
            Getting your location and searching for service centers
          </Typography>
        </Paper>
      )}

      {/* Error State */}
      {error && !loading && (
        <Alert 
          severity="error" 
          sx={{ mb: 3, borderRadius: 2 }}
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
          {/* Header with stats */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: 1.5,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
                  display: 'flex'
                }}
              >
                <WorkshopIcon sx={{ color: 'white', fontSize: 20 }} />
              </Box>
              <Typography variant="h6" fontWeight="700" color={colors.textPrimary}>
                Service Centers Near You
              </Typography>
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
            </Box>
            <Button
              variant="outlined"
              size="small"
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

          {/* Google Map */}
          {isLoaded && !loadError ? (
            <Paper 
              elevation={0}
              sx={{ 
                borderRadius: 3, 
                overflow: 'hidden', 
                border: `1px solid ${colors.cardBorder}`,
                bgcolor: colors.cardBg
              }}
            >
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
                    <Box sx={{ p: 1, minWidth: 220 }}>
                      <Typography variant="subtitle2" fontWeight="700" gutterBottom>
                        {selectedCenter.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {selectedCenter.address}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                        <Rating value={selectedCenter.rating} readOnly size="small" precision={0.1} />
                        <Typography variant="caption">({selectedCenter.total_ratings})</Typography>
                      </Box>
                      <Button
                        size="small"
                        variant="contained"
                        fullWidth
                        startIcon={<DirectionsIcon />}
                        onClick={() => openDirections(selectedCenter)}
                        sx={{
                          background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}
                      >
                        Get Directions
                      </Button>
                    </Box>
                  </InfoWindow>
                )}
              </GoogleMap>
            </Paper>
          ) : loadError ? (
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              Map could not be loaded. Please check your API key configuration.
            </Alert>
          ) : (
            <Paper 
              elevation={0}
              sx={{ 
                height: 350, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                bgcolor: colors.listItemBg, 
                borderRadius: 3,
                border: `1px solid ${colors.cardBorder}`
              }}
            >
              <CircularProgress size={40} sx={{ color: '#3b82f6' }} />
            </Paper>
          )}

          {/* Service Centers List */}
          <Box>
            <Typography 
              variant="overline" 
              sx={{ 
                color: colors.textSecondary, 
                letterSpacing: 1.5, 
                fontWeight: 700, 
                mb: 2, 
                display: 'block' 
              }}
            >
              All Service Centers ({serviceCenters.length})
            </Typography>
            
            <Box 
              sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
                gap: 2 
              }}
            >
              {serviceCenters.map((center, index) => (
                <Card
                  key={center.id || index}
                  elevation={0}
                  sx={{
                    bgcolor: colors.listItemBg,
                    border: `1px solid ${colors.cardBorder}`,
                    borderRadius: 2.5,
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
                  <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                      <Box sx={{ flex: 1, pr: 1 }}>
                        <Typography variant="subtitle1" fontWeight="700" color={colors.textPrimary} noWrap>
                          {center.name}
                        </Typography>
                        <Typography variant="body2" color={colors.textSecondary} sx={{ mt: 0.5, display: 'flex', alignItems: 'flex-start' }}>
                          <LocationIcon sx={{ fontSize: 14, mr: 0.5, mt: 0.3, flexShrink: 0 }} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            {center.address}
                          </span>
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
                          fontSize: '0.75rem',
                          flexShrink: 0
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
                                '&:hover': { color: '#3b82f6', bgcolor: 'rgba(59, 130, 246, 0.1)' }
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
                                '&:hover': { color: '#3b82f6', bgcolor: 'rgba(59, 130, 246, 0.1)' }
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
                              '&:hover': { color: '#10b981', bgcolor: 'rgba(16, 185, 129, 0.1)' }
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
            </Box>

            {serviceCenters.length === 0 && !loading && !error && (
              <Paper 
                elevation={0}
                sx={{ 
                  textAlign: 'center', 
                  py: 6, 
                  px: 3,
                  borderRadius: 3,
                  bgcolor: colors.emptyBg,
                  border: `1px dashed ${colors.cardBorder}`
                }}
              >
                <WorkshopIcon sx={{ fontSize: 48, color: colors.textSecondary, mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" fontWeight="600" color={colors.textPrimary} gutterBottom>
                  No Service Centers Found
                </Typography>
                <Typography color={colors.textSecondary}>
                  Try increasing the search radius or check back later.
                </Typography>
              </Paper>
            )}
          </Box>
        </Box>
      )}

      {/* Waiting for permission state */}
      {!loading && !userLocation && !error && hasInitialized && (
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 4, md: 6 }, 
            textAlign: 'center', 
            borderRadius: 3,
            bgcolor: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`
          }}
        >
          <CircularProgress size={48} sx={{ color: '#3b82f6', mb: 2 }} />
          <Typography variant="h6" fontWeight="600" color={colors.textPrimary} gutterBottom>
            Waiting for Location Permission
          </Typography>
          <Typography color={colors.textSecondary}>
            Please allow location access in your browser to find nearby workshops.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default NearbyWorkshops;
