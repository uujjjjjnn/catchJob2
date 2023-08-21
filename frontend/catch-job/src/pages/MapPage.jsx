import React from 'react';
import { useState, useEffect, useRef } from "react"
import styles from "../assets/css/Map.module.css";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import nowMarker from "../assets/img/nowMarker.png";
import destination from "../assets/img/dest.png";


const containerStyle = {
    width: '800px',
    height: '900px',
};

const center = {
    lat: 37.569227, lng: 126.9777256
};

const MapPage = () => {

    const [searchWord, setSearchWord] = useState("");
    const [userPosition, setUserPosition] = useState({
        lat: null,
        lng:null
    });
    const [cafes, setCafes] = useState([]);
    const [openedInfoWindowIndex, setOpenedInfoWindowIndex] = useState(null);
    const mapRef = useRef(null);


    const searchCafesNearby = async (location) => {
        const url = new URL("https://maps.googleapis.com/maps/api/place/nearbysearch/json");
      
        url.searchParams.set("location", `${location.lat},${location.lng}`);
        url.searchParams.set("radius", 1000); 
        url.searchParams.set("type", "카페");
        url.searchParams.set("keyword", "스터디 카페");
        url.searchParams.set("key", "AIzaSyDyCBaHuD_xiJCzf_EH1Q_0R5WRaiA0LiM");
      
        const response = await fetch(url.href);
        const data = await response.json();
      
        return data.results.map((result) => ({
            lat: result.geometry.location.lat,
            lng: result.geometry.location.lng,
            name: result.name,
            address: result.vicinity,
        }));
        
      };

      const handleMapIdle = async () => {
        const currentMapCenter = mapRef.current.getCenter();
        const currentLocation = {
          lat: currentMapCenter.lat(),
          lng: currentMapCenter.lng()
        };
      
        const nearbyCafes = await searchCafesNearby(currentLocation);
        setCafes(nearbyCafes);
      };
      
      
    
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyDyCBaHuD_xiJCzf_EH1Q_0R5WRaiA0LiM"
        })

        useEffect(() => {
            navigator.geolocation.getCurrentPosition(async function (position) {
              const currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              setUserPosition(currentLocation);
          
              const nearbyCafes = await searchCafesNearby(currentLocation);
              setCafes(nearbyCafes);
            });
          }, []);
        
        const onLoad = React.useCallback(function callback(map) {
        new window.google.maps.LatLngBounds(center);

            map.setOptions({ styles: [
            {featureType:'poi',stylers:[{visibility:'off'}]},],
        });
        mapRef.current = map;
    
        }, [])

        const handleSearch = () => {
            console.log("hi")
        }

        const renderCafeMarkers = () => {
            return cafes.map((cafe, index) => {
                const handleClick = () => {
                    setOpenedInfoWindowIndex(index);
                };
        
                return (
                    <React.Fragment key={index}>
                        <Marker
                            position={cafe}
                            icon={{
                                url: destination,
                                scaledSize: new window.google.maps.Size(40, 40)
                            }}
                            onClick={handleClick}
                        />
                        {openedInfoWindowIndex === index && (
                            <InfoWindow
                                position={cafe}
                                onCloseClick={() => setOpenedInfoWindowIndex(null)}
                            >
                                <div>
                                    <h2>{cafe.name}</h2>
                                    <p>{cafe.address}</p>
                                </div>
                            </InfoWindow>
                        )}
                    </React.Fragment>
                );
            });
        };

        const renderUserMarker = () => {
            if (userPosition.lat && userPosition.lng) {
            return (
            <Marker
                position={userPosition}
                icon={{
                    url: nowMarker,
                    scaledSize: new window.google.maps.Size(40, 40)
                }}
                />
            );
            }
            return null;
        };
        

        return isLoaded && userPosition.lat && userPosition.lng ? (
            <div className={`${styles.wrapper}`}>
                <div className={`${styles.mapList}`}>
                    <div className={`${styles.searchBox}`}>
                        <div onClick={handleSearch}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} className={`${styles.searchButton}`}/>
                        </div>
                        <input
                            type="text"
                            placeholder="장소를 입력하세요."
                            className={`${styles.searchInput}`}
                            value={searchWord}
                            onChange={(e) => setSearchWord(e.target.value)}
                        />
                    </div>
                    <div className={`${styles.searchList}`}>
                        {cafes.map((cafe, index) => (
                            <div key={index} className={`${styles.searchListOne}`}> 
                                <div className={`${styles.searchListOneName}`}>{cafe.name}</div>
                                <p className={`${styles.searchListOneAddress}`}>{cafe.address}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={`${styles.container}`}>
                    <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={userPosition}
                    zoom={17}
                    onLoad={onLoad}
                    onIdle={handleMapIdle}
                    >
                    {renderUserMarker()}
                    {renderCafeMarkers()}
                    </GoogleMap>
                </div>
            </div>
        ) : <></>
    }
export default MapPage;