import React from 'react';
import { useState, useEffect, useRef } from "react"
import styles from "../assets/css/Map.module.css";
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '1000px',
  height: '800px',
};

const center = {
    lat: 37.569227, lng: 126.9777256
};

const MapPage = () => {
    
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyDyCBaHuD_xiJCzf_EH1Q_0R5WRaiA0LiM"
      })
    
      const [map, setMap] = React.useState(null)
    
      const onLoad = React.useCallback(function callback(map) {
        new window.google.maps.LatLngBounds(center);

            map.setOptions({ styles: [
            {featureType:'poi',stylers:[{visibility:'off'}]},],
        });
    
        setMap(map)
      }, [])
    
      const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
      }, [])
    
      return isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={17}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
          </GoogleMap>
      ) : <></>
    }
export default MapPage;