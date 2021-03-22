import React, { useRef, useEffect, useState } from 'react';
import style from './Map.module.css';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';

mapboxgl.accessToken =
    'pk.eyJ1IjoibWNhcHVycmkiLCJhIjoiY2tsMmR4Z2NmMDgwaDJ1cDEycmEyN3NiaCJ9.Mmr5igenBPR3QkJOKMgG3A';

const Map = ({ setRequestedAddress }) => {
    const mapContainer = useRef();
    const [berlin, setBerlin] = useState({
        lng: 13.405,
        lat: 52.52,
        zoom: 10,
    });
    let lngLat = '';

    let address = async (lngLat) => {
        console.log('lngLat', lngLat);
        await axios
            .get(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat.lng},${lngLat.lat}.json?access_token=${mapboxgl.accessToken}&cachebuster=1616347496121&autocomplete=true&types=address&types=place&`
            )
            .then((resAddress) => {
                console.log('resAddress', resAddress);
                setRequestedAddress({
                    street:
                        resAddress.data.features[0].text +
                        ', ' +
                        resAddress.data.features[0].address,
                    city: resAddress.data.features[0].context[2].text,
                    zipCode: resAddress.data.features[0].context[0].text,
                    coords: lngLat,
                });
            })
            .catch((err) => console.log(err));
    };
    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [berlin.lng, berlin.lat],
            zoom: berlin.zoom,
        });
        map.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true,
                },
                trackUserLocation: true,
            })
        );

        // setting a popup
        const popup = new mapboxgl.Popup({
            closeButton: false,
        });
        popup
            .setLngLat([13.455, 52.45])
            .setHTML('<span>we are here</span>')
            .setMaxWidth('200px')
            .addTo(map);

        // Geocoder
        // map.addControl(
        //     new MapboxGeocoder({
        //         accessToken: mapboxgl.accessToken,
        //         mapboxgl: mapboxgl,
        //     })
        // );
        map.on('move', () => {
            setBerlin({
                lng: map.getCenter().lng.toFixed(4),
                lat: map.getCenter().lng.toFixed(4),
                zoom: map.getZoom().toFixed(2),
            });
        });
        const marker = new mapboxgl.Marker({
            scale: 1,
            color: 'red',
            draggable: true,
        });
        const addMarker = (event) => {
            // console.log(event.lngLat);
            marker.setLngLat(event.lngLat).addTo(map);
            address(event.lngLat);
        };
        map.on('click', addMarker);

        const onDragEnd = () => {
            lngLat = marker.getLngLat();
            address(lngLat);
        };

        marker.on('dragend', onDragEnd);

        return () => map.remove();
    }, [lngLat]);

    return (
        <section className={style.Container}>
            <div className={style.infos}>
                <h5> Contact Information </h5>
                <address className="address">
                    Animal Clinic <br /> Buschkrug Allee 206, <br /> 12359
                    Berlin <br /> Germany <br /> +49 157 00 00 00
                </address>
            </div>
            <div>
                {/* <div className={style.Sidebar}>
                    Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
                </div> */}
                <div className={style.Map} ref={mapContainer}></div>
            </div>
        </section>
    );
};

export default Map;
