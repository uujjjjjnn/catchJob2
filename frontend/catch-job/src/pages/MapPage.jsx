import React from 'react';
import { useState, useEffect, useRef } from "react"
import styles from "../assets/css/Map.module.css";


const MapPage = () => {
    
    const ref = useRef();
    const API_KEY = "AIzaSyDyCBaHuD_xiJCzf_EH1Q_0R5WRaiA0LiM";

useEffect(()=>{
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
        new window.google.maps.Map(ref.current, {
            center: { lat: 37.569227, lng: 126.9777256 },
            zoom: 16,
        });
    }         
}, [])

    return (
        <div className={`${styles.mapLooking}`} ref={ref} id="map"></div>
    )
};

export default MapPage;