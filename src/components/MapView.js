import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

const DEFAULT_LAT = 12.9352;
const DEFAULT_LNG = 77.6245;

const safe = (str) => String(str || '').replace(/'/g, '').replace(/"/g, '').replace(/\\/g, '');

export default function MapView({
  style,
  pickup = { lat: 12.9352, lng: 77.6245, label: 'Pickup' },
  drop = null,
  driverLat = null,
  driverLng = null,
}) {
  const pLat = pickup?.lat || DEFAULT_LAT;
  const pLng = pickup?.lng || DEFAULT_LNG;

  const fitBounds = drop
    ? `map.fitBounds([[${pLat},${pLng}],[${drop.lat},${drop.lng}]],{padding:[40,40]});`
    : `map.setView([${pLat},${pLng}],14);`;

  const routeLine = drop
    ? `L.polyline([[${pLat},${pLng}],[${drop.lat},${drop.lng}]],{color:'#2563EB',weight:5,opacity:1}).addTo(map);`
    : '';

  const pickupMarker = `L.marker([${pLat},${pLng}],{icon:L.divIcon({className:'',html:'<div style="width:14px;height:14px;background:#16A34A;border-radius:50%;border:2.5px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>',iconAnchor:[7,7]})}).addTo(map);`;

  const dropMarker = drop
    ? `L.marker([${drop.lat},${drop.lng}],{icon:L.divIcon({className:'',html:'<div style="width:14px;height:14px;background:#DC2626;border-radius:50%;border:2.5px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>',iconAnchor:[7,7]})}).addTo(map);`
    : '';

  const driverMarker = (driverLat && driverLng)
    ? `L.marker([${driverLat},${driverLng}],{icon:L.divIcon({className:'',html:'<div style="width:32px;height:32px;background:#FFC400;border-radius:50%;border:3px solid #111;display:flex;align-items:center;justify-content:center;font-size:16px;">🛵</div>',iconAnchor:[16,16]})}).addTo(map);`
    : '';

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <style>*{margin:0;padding:0;box-sizing:border-box}html,body,#map{width:100%;height:100%}.leaflet-control-attribution{display:none}</style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var map = L.map('map',{zoomControl:false});
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);
    ${fitBounds}
    ${routeLine}
    ${pickupMarker}
    ${dropMarker}
    ${driverMarker}
  </script>
</body>
</html>`;

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, style]}>
        <iframe srcDoc={html} style={{ width: '100%', height: '100%', border: 'none' }} title="map" />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <WebView
        source={{ html }}
        style={StyleSheet.absoluteFill}
        scrollEnabled={false}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        mixedContentMode="always"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { overflow: 'hidden', backgroundColor: '#C8DDD0' },
});
