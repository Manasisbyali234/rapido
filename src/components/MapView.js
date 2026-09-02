import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

// Bangalore center as default
const DEFAULT_LAT = 12.9352;
const DEFAULT_LNG = 77.6245;

export default function MapView({
  style,
  pickup = { lat: 12.9352, lng: 77.6245, label: 'Pickup' },
  drop = null,
  driverLat = null,
  driverLng = null,
}) {
  const markers = [];

  if (pickup) {
    markers.push(`
      L.marker([${pickup.lat}, ${pickup.lng}], {
        icon: L.divIcon({
          className: '',
          html: '<div style="width:14px;height:14px;background:#16A34A;border-radius:50%;border:2.5px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>',
          iconAnchor: [7, 7]
        })
      }).addTo(map).bindPopup('${pickup.label || 'Pickup'}');
    `);
  }

  if (drop) {
    markers.push(`
      L.marker([${drop.lat}, ${drop.lng}], {
        icon: L.divIcon({
          className: '',
          html: '<div style="width:14px;height:14px;background:#DC2626;border-radius:50%;border:2.5px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>',
          iconAnchor: [7, 7]
        })
      }).addTo(map).bindPopup('${drop.label || 'Drop'}');
    `);
  }

  if (driverLat && driverLng) {
    markers.push(`
      L.marker([${driverLat}, ${driverLng}], {
        icon: L.divIcon({
          className: '',
          html: '<div style="width:32px;height:32px;background:#FFC400;border-radius:50%;border:3px solid #111;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 3px 8px rgba(0,0,0,0.3)">🛵</div>',
          iconAnchor: [16, 16]
        })
      }).addTo(map);
    `);
  }

  const fitBounds = pickup && drop ? `
    var bounds = L.latLngBounds(
      [${pickup.lat}, ${pickup.lng}],
      [${drop.lat}, ${drop.lng}]
    );
    map.fitBounds(bounds, { padding: [40, 40] });
  ` : `map.setView([${pickup?.lat || DEFAULT_LAT}, ${pickup?.lng || DEFAULT_LNG}], 14);`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body, #map { width: 100%; height: 100%; }
        .leaflet-control-attribution { display: none; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', { zoomControl: false });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        }).addTo(map);
        ${fitBounds}
        ${markers.join('\n')}
      </script>
    </body>
    </html>
  `;

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, style]}>
        <iframe
          srcDoc={html}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="map"
        />
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { overflow: 'hidden', backgroundColor: '#C8DDD0' },
});
