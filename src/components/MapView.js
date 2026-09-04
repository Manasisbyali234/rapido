import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

const DEFAULT_LAT = 12.9352;
const DEFAULT_LNG = 77.6245;

export default function MapView({
  style,
  pickup = { lat: 12.9352, lng: 77.6245, label: 'Pickup' },
  drop = null,
  driverLat = null,
  driverLng = null,
  animateDriver = false,
}) {
  const webRef = useRef(null);
  const pLat = pickup?.lat || DEFAULT_LAT;
  const pLng = pickup?.lng || DEFAULT_LNG;

  // Send updated driver position to the WebView without full reload
  useEffect(() => {
    if (!animateDriver || driverLat == null || driverLng == null) return;
    const js = `moveDriver(${driverLat}, ${driverLng}); true;`;
    if (Platform.OS === 'web') {
      try { webRef.current?.contentWindow?.eval(js); } catch (_) {}
    } else {
      webRef.current?.injectJavaScript(js);
    }
  }, [driverLat, driverLng]);

  const initDriverLat = driverLat ?? pLat;
  const initDriverLng = driverLng ?? pLng;

  const dropCoords = drop ? `[${drop.lat},${drop.lng}]` : 'null';

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    html,body,#map{width:100%;height:100%}
    .leaflet-control-attribution{display:none}
    .auto-icon{width:36px;height:36px;background:#FFC400;border-radius:50%;border:3px solid #111;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 3px 10px rgba(0,0,0,0.35);transition:all 0.3s ease}
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var map = L.map('map',{zoomControl:false,attributionControl:false});
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',{maxZoom:19}).addTo(map);

    var pLat=${pLat}, pLng=${pLng};
    var dropCoords=${dropCoords};
    var routeLayer=null, shadowLayer=null;

    // Pickup marker
    var pickupIcon=L.divIcon({className:'',html:'<div style="width:16px;height:16px;background:#16A34A;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4)"></div>',iconAnchor:[8,8]});
    L.marker([pLat,pLng],{icon:pickupIcon}).addTo(map);

    // Drop marker
    if(dropCoords){
      var dropIcon=L.divIcon({className:'',html:'<div style="width:0;height:0;border-left:9px solid transparent;border-right:9px solid transparent;border-top:18px solid #DC2626;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.4))"></div>',iconAnchor:[9,18]});
      L.marker(dropCoords,{icon:dropIcon}).addTo(map);
    }

    // Auto driver marker
    var autoIcon=L.divIcon({className:'',html:'<div class="auto-icon">🛺</div>',iconAnchor:[18,18]});
    var driverMarker=L.marker([${initDriverLat},${initDriverLng}],{icon:autoIcon,zIndexOffset:1000}).addTo(map);

    function lerp(a,b,t){return a+(b-a)*t;}
    var _curLat=${initDriverLat}, _curLng=${initDriverLng};
    var _targetLat=${initDriverLat}, _targetLng=${initDriverLng};
    var _animFrame=null;
    function animateTo(lat,lng){
      _targetLat=lat; _targetLng=lng;
      if(_animFrame) cancelAnimationFrame(_animFrame);
      var steps=30, i=0;
      var fromLat=_curLat, fromLng=_curLng;
      function step(){
        i++;
        var t=i/steps;
        _curLat=lerp(fromLat,_targetLat,t);
        _curLng=lerp(fromLng,_targetLng,t);
        driverMarker.setLatLng([_curLat,_curLng]);
        if(i<steps) _animFrame=requestAnimationFrame(step);
      }
      _animFrame=requestAnimationFrame(step);
    }

    function moveDriver(lat,lng){ animateTo(lat,lng); }

    // Fetch OSRM route
    function drawRoute(fromLat,fromLng,toLat,toLng){
      var url='https://router.project-osrm.org/route/v1/driving/'+fromLng+','+fromLat+';'+toLng+','+toLat+'?overview=full&geometries=geojson';
      fetch(url).then(function(r){return r.json();}).then(function(data){
        if(!data.routes||!data.routes[0]) return;
        var coords=data.routes[0].geometry.coordinates.map(function(c){return[c[1],c[0]];});
        if(shadowLayer){map.removeLayer(shadowLayer);}
        if(routeLayer){map.removeLayer(routeLayer);}
        shadowLayer=L.polyline(coords,{color:'rgba(37,99,235,0.18)',weight:10,lineCap:'round',lineJoin:'round'}).addTo(map);
        routeLayer=L.polyline(coords,{color:'#2563EB',weight:5,lineCap:'round',lineJoin:'round',opacity:0.95}).addTo(map);
        // Bring markers to front
        driverMarker.bringToFront();
        // Fit bounds with padding
        var allPoints=[[pLat,pLng],[toLat,toLng],[${initDriverLat},${initDriverLng}]];
        map.fitBounds(allPoints,{padding:[48,48],maxZoom:15});
      }).catch(function(){
        // Fallback straight line
        if(shadowLayer){map.removeLayer(shadowLayer);}
        if(routeLayer){map.removeLayer(routeLayer);}
        shadowLayer=L.polyline([[fromLat,fromLng],[toLat,toLng]],{color:'rgba(37,99,235,0.18)',weight:10}).addTo(map);
        routeLayer=L.polyline([[fromLat,fromLng],[toLat,toLng]],{color:'#2563EB',weight:5,opacity:0.95}).addTo(map);
        map.fitBounds([[fromLat,fromLng],[toLat,toLng]],{padding:[48,48],maxZoom:15});
      });
    }

    if(dropCoords){
      drawRoute(${initDriverLat},${initDriverLng},dropCoords[0],dropCoords[1]);
    } else {
      map.setView([pLat,pLng],15);
    }
  </script>
</body>
</html>`;

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, style]}>
        <iframe ref={webRef} srcDoc={html} style={{ width: '100%', height: '100%', border: 'none' }} title="map" />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webRef}
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
  container: { overflow: 'hidden', backgroundColor: '#E8EFF5' },
});
