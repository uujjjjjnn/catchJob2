import React from 'react';
import { useState, useEffect, useRef } from "react"
import styles from "../assets/css/Map.module.css";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import nowMarker from "../assets/img/nowMarker.png";
import destination from "../assets/img/dest.png";
import axios from "axios";


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
        const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
      
        const response = await axios.get(url, {
          params: {
            location: `${location.lat},${location.lng}`,
            radius: 1000,
            type: "카페",
            keyword: "스터디 카페",
            key: "AIzaSyDyCBaHuD_xiJCzf_EH1Q_0R5WRaiA0LiM",
          },
        });
      
        return response.data.results.map((result) => ({
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
          name: result.name,
          address: result.vicinity,
        }));
      };

      const getPlaceLocation = async query => {
        const geocoder = new window.google.maps.Geocoder();
      
        return new Promise((resolve, reject) => {
          geocoder.geocode({ address: query }, (results, status) => {
            if (status === window.google.maps.GeocoderStatus.OK) {
              const location = {
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
              };
              resolve(location);
            } else {
              reject(new Error("Geocode 검색에 실패하였습니다."));
            }
          });
        });
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
        const handleSearch = async () => {
            try {
              const searchedLocation = await getPlaceLocation(searchWord);
          
              mapRef.current.panTo(searchedLocation);
              mapRef.current.setZoom(17);
          
              const nearbyCafes = await searchCafesNearby(searchedLocation);
              setCafes(nearbyCafes);
            } catch (error) {
              console.error(error);
              alert("장소를 찾을 수 없습니다. 다른 검색어로 시도해주세요.");
            }
          };
          

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

        const handleKeyPress = (event) => {
            if (event.key === "Enter") {
                handleSearch();
            }
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
                            onKeyPress={handleKeyPress}
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