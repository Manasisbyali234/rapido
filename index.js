// ============================================================
// HUBLI RIDER — Single-file frontend bundle
// ============================================================
import { enableScreens } from 'react-native-screens';
enableScreens();
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, FlatList, Switch, Animated, Easing, PanResponder,
  Dimensions, Platform, Alert, KeyboardAvoidingView, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, useFocusEffect, CommonActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
const WebView = Platform.OS !== 'web' ? require('react-native-webview').WebView : null;

// ─── THEME ───────────────────────────────────────────────────
const colors = {
  yellow: '#FFC400', yellowDark: '#E6B000', yellowLight: '#FFF8DC',
  black: '#111111', charcoal: '#2C2C2C', white: '#FFFFFF',
  bg: '#F4F5F7', card: '#FFFFFF', border: '#E8E8EC', borderFocus: '#FFC400',
  grey: '#7A7A80', greyLight: '#C4C4C8', greyBg: '#F0F0F3',
  success: '#16A34A', successBg: '#DCFCE7', danger: '#DC2626', dangerBg: '#FEE2E2',
  info: '#2563EB', infoBg: '#DBEAFE',
  auto: '#FFC400', bike: '#059669', cab: '#1E293B',
  autoBg: '#FFF8DC', bikeBg: '#D1FAE5', cabBg: '#E2E8F0',
  overlay: 'rgba(0,0,0,0.45)',
};
const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };
const radius = { xs: 6, sm: 10, md: 16, lg: 24, xl: 32, pill: 999 };
const type = {
  h1: { fontSize: 26, fontWeight: '800', color: colors.black, letterSpacing: -0.4 },
  h2: { fontSize: 21, fontWeight: '700', color: colors.black, letterSpacing: -0.3 },
  h3: { fontSize: 16, fontWeight: '700', color: colors.black },
  body: { fontSize: 14, fontWeight: '400', color: colors.charcoal, lineHeight: 20 },
  small: { fontSize: 12, fontWeight: '400', color: colors.grey, lineHeight: 17 },
  label: { fontSize: 11, fontWeight: '700', color: colors.grey, letterSpacing: 0.6, textTransform: 'uppercase' },
  caption: { fontSize: 11, fontWeight: '500', color: colors.greyLight },
};
const shadow = {
  sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  card: { shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 4 },
  lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 18, elevation: 8 },
};

// ─── DUMMY DATA ───────────────────────────────────────────────
const rideTypes = [
  { id: 'bike', label: 'Bike', icon: '🏍️', ionicon: 'bicycle', eta: '2 min', price: 42, desc: 'Quick & affordable' },
  { id: 'auto', label: 'Auto', icon: '🛺', ionicon: 'car-sport', eta: '4 min', price: 68, desc: 'Comfortable 3-wheeler' },
  { id: 'cab', label: 'Cab Economy', icon: '🚗', ionicon: 'car', eta: '6 min', price: 145, desc: 'AC cab, up to 4 seats' },
  { id: 'cabpremium', label: 'Cab Premium', icon: '🚙', ionicon: 'car-outline', eta: '8 min', price: 210, desc: 'Sedan, top rated drivers' },
];
let users = [
  { id: 'u1', name: 'Ananya Rao', phone: '9876543210', rides: 34, rating: 4.8, joined: '2023-04-12', status: 'active' },
  { id: 'u2', name: 'Rohit Sharma', phone: '9823456712', rides: 12, rating: 4.6, joined: '2024-01-02', status: 'active' },
  { id: 'u3', name: 'Priya Menon', phone: '9765432109', rides: 58, rating: 4.9, joined: '2022-11-20', status: 'active' },
  { id: 'u4', name: 'Vikram Singh', phone: '9012345678', rides: 3, rating: 4.2, joined: '2024-06-15', status: 'blocked' },
  { id: 'u5', name: 'Fatima Sheikh', phone: '9988776655', rides: 21, rating: 4.7, joined: '2023-09-08', status: 'active' },
];
let drivers = [
  { id: 'd1', name: 'Suresh Kumar', phone: '9111122223', vehicle: 'Bike', number: 'KA05 AB 1234', rides: 1204, rating: 4.9, status: 'online', earningsToday: 860 },
  { id: 'd2', name: 'Manoj Patil', phone: '9222233334', vehicle: 'Auto', number: 'KA01 CD 5678', rides: 980, rating: 4.7, status: 'online', earningsToday: 640 },
  { id: 'd3', name: 'Ramesh Gowda', phone: '9333344445', vehicle: 'Cab Economy', number: 'KA03 EF 9012', rides: 2100, rating: 4.8, status: 'offline', earningsToday: 0 },
  { id: 'd4', name: 'Iqbal Ahmed', phone: '9444455556', vehicle: 'Cab Premium', number: 'KA02 GH 3456', rides: 1560, rating: 4.9, status: 'online', earningsToday: 1120 },
  { id: 'd5', name: 'Deepak Nair', phone: '9555566667', vehicle: 'Bike', number: 'KA07 IJ 7890', rides: 430, rating: 4.5, status: 'offline', earningsToday: 0 },
];
const dummyRideRequests = [
  { id: 'r1', riderName: 'Ananya Rao', riderRating: 4.8, pickup: 'Koramangala 5th Block', drop: 'Indiranagar 100ft Road', distance: '5.2 km', fare: 68, rideType: 'Auto', eta: '3 min away' },
  { id: 'r2', riderName: 'Rohit Sharma', riderRating: 4.6, pickup: 'HSR Layout Sector 2', drop: 'Electronic City Phase 1', distance: '11.8 km', fare: 210, rideType: 'Cab Economy', eta: '6 min away' },
  { id: 'r3', riderName: 'Fatima Sheikh', riderRating: 4.7, pickup: 'MG Road Metro', drop: 'Whitefield ITPL', distance: '17.4 km', fare: 320, rideType: 'Cab Premium', eta: '9 min away' },
];
const adminStats = () => ({
  totalUsers: users.length, totalDrivers: drivers.length,
  onlineDrivers: drivers.filter(d => d.status === 'online').length,
  ridesToday: 1342, revenueToday: 186420,
});

// ─── CONFIG ───────────────────────────────────────────────────
const BASE_URL = (typeof window !== 'undefined') ? 'http://localhost:3000' : 'http://192.168.68.119:3000';

// ─── AUTH STORE ───────────────────────────────────────────────
const K = { currentUser: 'hr_currentUser', users: 'hr_users', captains: 'hr_captains', adminToken: 'hr_adminToken' };
async function _get(key) { try { const v = await AsyncStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; } }
async function _save(key, val) { try { await AsyncStorage.setItem(key, JSON.stringify(val)); } catch {} }
const _otpStore = {};
function generateOtp(phone) { const code = String(Math.floor(100000 + Math.random() * 900000)); _otpStore[phone] = code; return Promise.resolve(code); }
function verifyOtp(phone, code) { return Promise.resolve(code.length === 6 || _otpStore[phone] === code); }
async function getUsers() { return (await _get(K.users)) || []; }
async function registerUser({ name, email, phone }) {
  const list = await getUsers();
  if (list.find(u => u.phone === phone)) return { error: 'This mobile number is already registered. Please login.' };
  const user = { id: Date.now().toString(), name, email, phone, role: 'user', createdAt: new Date().toISOString() };
  await _save(K.users, [...list, user]); await _save(K.currentUser, user); return { user };
}
async function loginUser(phone) {
  const list = await getUsers(); const user = list.find(u => u.phone === phone);
  if (!user) return { error: 'No account found. Please register first.' };
  await _save(K.currentUser, user); return { user };
}
async function getCaptains() { return (await _get(K.captains)) || []; }
async function registerCaptain(data) {
  const list = await getCaptains();
  if (list.find(c => c.phone === data.phone)) return { error: 'This mobile number is already registered. Please login.' };
  const captain = { ...data, id: Date.now().toString(), role: 'captain', status: 'pending', createdAt: new Date().toISOString() };
  await _save(K.captains, [...list, captain]); await _save(K.currentUser, captain); return { captain };
}
async function loginCaptain(phone) {
  const list = await getCaptains(); const captain = list.find(c => c.phone === phone);
  if (!captain) return { error: 'No captain account found. Please register.' };
  await _save(K.currentUser, captain); return { captain };
}
async function updateCaptainStatus(id, status) {
  const list = await getCaptains();
  const updated = list.map(c => c.id === id ? { ...c, status } : c);
  await _save(K.captains, updated);
  const current = await _get(K.currentUser);
  if (current && current.id === id) await _save(K.currentUser, { ...current, status });
}
async function getCurrentUser() { return _get(K.currentUser); }
async function logout() { await AsyncStorage.removeItem(K.currentUser); await AsyncStorage.removeItem(K.adminToken); }

// Admin API helpers
let _adminToken = null;
async function getAdminToken() {
  if (_adminToken) return _adminToken;
  try { const t = await AsyncStorage.getItem(K.adminToken); if (t) _adminToken = t; return _adminToken; } catch { return null; }
}
async function adminRequest(path, options = {}) {
  const token = await getAdminToken();
  const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}
async function adminLogin(email, password) {
  try {
    const res = await fetch(`${BASE_URL}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password }),
    });
    const data = await res.json();
    if (!res.ok) return false;
    _adminToken = data.token;
    await AsyncStorage.setItem(K.adminToken, data.token);
    return true;
  } catch { return false; }
}
async function isAdminLoggedIn() { const t = await getAdminToken(); return !!t; }

// ─── MAP VIEW ─────────────────────────────────────────────────
function MapView({ style, pickup = { lat: 12.9352, lng: 77.6245, label: 'Pickup' }, drop = null, driverLat = null, driverLng = null }) {
  const markers = [];
  if (pickup) markers.push(`L.marker([${pickup.lat},${pickup.lng}],{icon:L.divIcon({className:'',html:'<div style="width:14px;height:14px;background:#16A34A;border-radius:50%;border:2.5px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>',iconAnchor:[7,7]})}).addTo(map).bindPopup('${pickup.label||'Pickup'}');`);
  if (drop) markers.push(`L.marker([${drop.lat},${drop.lng}],{icon:L.divIcon({className:'',html:'<div style="width:14px;height:14px;background:#DC2626;border-radius:50%;border:2.5px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>',iconAnchor:[7,7]})}).addTo(map).bindPopup('${drop.label||'Drop'}');`);
  if (driverLat && driverLng) markers.push(`L.marker([${driverLat},${driverLng}],{icon:L.divIcon({className:'',html:'<div style="width:32px;height:32px;background:#FFC400;border-radius:50%;border:3px solid #111;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 3px 8px rgba(0,0,0,0.3)">🛵</div>',iconAnchor:[16,16]})}).addTo(map);`);
  const fitBounds = pickup && drop
    ? `var bounds=L.latLngBounds([${pickup.lat},${pickup.lng}],[${drop.lat},${drop.lng}]);map.fitBounds(bounds,{padding:[40,40]});`
    : `map.setView([${pickup?.lat||12.9352},${pickup?.lng||77.6245}],14);`;
  const html = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1.0"><link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/><script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script><style>*{margin:0;padding:0;box-sizing:border-box}html,body,#map{width:100%;height:100%}.leaflet-control-attribution{display:none}</style></head><body><div id="map"></div><script>var map=L.map('map',{zoomControl:false});L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);${fitBounds}${markers.join('')}</script></body></html>`;
  if (Platform.OS === 'web') return <View style={[{ overflow: 'hidden', backgroundColor: '#C8DDD0' }, style]}><iframe srcDoc={html} style={{ width: '100%', height: '100%', border: 'none' }} title="map" /></View>;
  if (!WebView) return <View style={[{ overflow: 'hidden', backgroundColor: '#C8DDD0' }, style]} />;
  return <View style={[{ overflow: 'hidden', backgroundColor: '#C8DDD0' }, style]}><WebView source={{ html }} style={StyleSheet.absoluteFill} scrollEnabled={false} originWhitelist={['*']} /></View>;
}

// ─── SWIPE BUTTON ─────────────────────────────────────────────
const TRACK_WIDTH = Dimensions.get('window').width - 48;
const THUMB_SIZE = 56;
const SWIPE_RANGE = TRACK_WIDTH - THUMB_SIZE - 8;
function SwipeButton({ label = 'Swipe to accept', onSwipeSuccess, color = colors.success }) {
  const pan = useRef(new Animated.Value(0)).current;
  const completed = useRef(false);
  const panResponder = useRef(PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, g) => pan.setValue(Math.max(0, Math.min(g.dx, SWIPE_RANGE))),
    onPanResponderRelease: (_, g) => {
      if (g.dx >= SWIPE_RANGE * 0.85 && !completed.current) {
        completed.current = true;
        Animated.timing(pan, { toValue: SWIPE_RANGE, duration: 120, useNativeDriver: false }).start(() => onSwipeSuccess && onSwipeSuccess());
      } else { Animated.spring(pan, { toValue: 0, useNativeDriver: false }).start(); }
    },
  })).current;
  const bgOpacity = pan.interpolate({ inputRange: [0, SWIPE_RANGE], outputRange: [1, 0.25] });
  return (
    <View style={{ width: TRACK_WIDTH, height: THUMB_SIZE + 8, borderRadius: radius.pill, borderWidth: 1.5, borderColor: color, backgroundColor: color + '22', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
      <Animated.Text style={{ fontSize: 15, fontWeight: '700', color, opacity: bgOpacity, position: 'absolute', alignSelf: 'center' }}>{label}</Animated.Text>
      <Animated.View {...panResponder.panHandlers} style={{ position: 'absolute', left: 4, width: THUMB_SIZE, height: THUMB_SIZE, borderRadius: THUMB_SIZE / 2, backgroundColor: color, justifyContent: 'center', alignItems: 'center', transform: [{ translateX: pan }] }}>
        <Ionicons name="chevron-forward" size={24} color="#fff" />
      </Animated.View>
    </View>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────
function StatCard({ label, value, accent = colors.yellow }) {
  return (
    <View style={[{ flexBasis: '47%', backgroundColor: colors.card, borderRadius: radius.md, padding: 14, marginBottom: 12, overflow: 'hidden' }, shadow.card]}>
      <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: accent }} />
      <Text style={{ ...type.h1, fontSize: 24, marginLeft: 6 }}>{value}</Text>
      <Text style={{ ...type.small, marginLeft: 6, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

// ─── AUTH: LOGIN ──────────────────────────────────────────────
function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [focused, setFocused] = useState(false);
  const valid = phone.length === 10;
  async function handleSendOtp() {
    const userResult = await loginUser(phone);
    const captainResult = await loginCaptain(phone);
    if (userResult.error && captainResult.error) { Alert.alert('Not Found', 'No account found for this number. Please register first.'); return; }
    const role = !userResult.error ? 'user' : 'captain';
    navigation.navigate('OtpVerify', { phone, flow: 'login', role });
  }
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }} keyboardShouldPersistTaps="handled">
        <View style={{ backgroundColor: colors.yellow, marginHorizontal: -20, marginTop: -20, paddingTop: 64, paddingBottom: 40, paddingHorizontal: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, marginBottom: 28, alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.black, justifyContent: 'center', alignItems: 'center' }}><Ionicons name="flash" size={20} color={colors.black === '#111111' ? colors.yellow : colors.black} /></View>
            <Text style={{ fontSize: 26, fontWeight: '900', color: colors.black, letterSpacing: -0.5 }}>Hubli Rider</Text>
          </View>
          <Text style={{ fontSize: 14, fontWeight: '500', color: 'rgba(0,0,0,0.6)' }}>Fast rides across Hubli</Text>
        </View>
        <View style={[{ backgroundColor: colors.white, borderRadius: radius.lg, padding: 24, borderWidth: 1, borderColor: colors.border }, shadow.card]}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: colors.black, marginBottom: 4 }}>Welcome Back</Text>
          <Text style={{ fontSize: 13, color: colors.grey, marginBottom: 24 }}>Login to continue to Hubli Rider</Text>
          <Text style={{ fontSize: 12, fontWeight: '600', color: colors.grey, marginBottom: 8, letterSpacing: 0.4 }}>Mobile Number</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: focused ? colors.yellow : colors.border, borderRadius: radius.md, backgroundColor: colors.white, marginBottom: 20, overflow: 'hidden' }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: colors.black, paddingHorizontal: 12 }}>🇮🇳 +91</Text>
            <View style={{ width: 1, height: 20, backgroundColor: colors.border }} />
            <TextInput style={{ flex: 1, paddingHorizontal: 12, paddingVertical: 14, fontSize: 16, fontWeight: '600', color: colors.black }} placeholder="98765 43210" placeholderTextColor={colors.greyLight} keyboardType="number-pad" maxLength={10} value={phone} onChangeText={setPhone} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
            {valid && <Ionicons name="checkmark-circle" size={20} color={colors.success} style={{ marginRight: 12 }} />}
          </View>
          <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: valid ? colors.yellow : colors.greyBg, borderRadius: radius.pill, paddingVertical: 15 }} disabled={!valid} onPress={handleSendOtp} activeOpacity={0.85}>
            <Text style={{ fontSize: 15, fontWeight: '800', color: valid ? colors.black : colors.greyLight }}>Send OTP</Text>
            <Ionicons name="arrow-forward" size={18} color={valid ? colors.black : colors.greyLight} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 18 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} /><Text style={{ fontSize: 11, fontWeight: '700', color: colors.greyLight }}>OR</Text><View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
          </View>
          <TouchableOpacity style={{ borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.pill, paddingVertical: 14, alignItems: 'center' }} onPress={() => navigation.navigate('Register')} activeOpacity={0.8}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.black }}>Create New Account</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 5, justifyContent: 'center', marginTop: 16 }} onPress={() => navigation.navigate('Admin')} activeOpacity={0.7}>
            <Ionicons name="shield-checkmark-outline" size={14} color={colors.grey} />
            <Text style={{ fontSize: 12, color: colors.grey, fontWeight: '500' }}>Admin Login</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ textAlign: 'center', color: colors.greyLight, marginTop: 24, fontSize: 11 }}>Hubli Rider · Demo build</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── AUTH: REGISTER ───────────────────────────────────────────
function RegisterScreen({ navigation }) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ backgroundColor: colors.yellow, paddingTop: 56, paddingBottom: 24, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
        <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.1)', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={20} color={colors.black} /></TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: colors.black, justifyContent: 'center', alignItems: 'center' }}><Ionicons name="flash" size={18} color={colors.yellow} /></View>
          <Text style={{ fontSize: 20, fontWeight: '900', color: colors.black }}>Hubli Rider</Text>
        </View>
      </View>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 26, fontWeight: '900', color: colors.black, letterSpacing: -0.5, lineHeight: 34, marginTop: 8, marginBottom: 6 }}>Create Your{'\n'}Hubli Rider Account</Text>
        <Text style={{ fontSize: 14, color: colors.grey, marginBottom: 28 }}>Choose how you want to use Hubli Rider</Text>
        <TouchableOpacity style={[{ backgroundColor: colors.white, borderRadius: radius.lg, padding: 20, marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 16, borderWidth: 1, borderColor: colors.border }, shadow.card]} activeOpacity={0.85} onPress={() => navigation.navigate('RegisterUser')}>
          <View style={{ width: 56, height: 56, borderRadius: radius.md, backgroundColor: colors.yellowLight, justifyContent: 'center', alignItems: 'center' }}><Ionicons name="person" size={28} color={colors.yellow} /></View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: colors.black, marginBottom: 4 }}>User</Text>
            <Text style={{ fontSize: 13, color: colors.grey, marginBottom: 10 }}>Book rides quickly and safely</Text>
            <View style={{ flexDirection: 'row', gap: 6 }}>{['Bike','Auto','Cab'].map(f => <View key={f} style={{ backgroundColor: colors.greyBg, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3 }}><Text style={{ fontSize: 11, fontWeight: '600', color: colors.charcoal }}>{f}</Text></View>)}</View>
          </View>
          <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.greyBg, justifyContent: 'center', alignItems: 'center' }}><Ionicons name="chevron-forward" size={18} color={colors.black} /></View>
        </TouchableOpacity>
        <TouchableOpacity style={[{ backgroundColor: colors.black, borderRadius: radius.lg, padding: 20, marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 16 }, shadow.card]} activeOpacity={0.85} onPress={() => navigation.navigate('RegisterCaptain')}>
          <View style={{ width: 56, height: 56, borderRadius: radius.md, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' }}><Ionicons name="bicycle" size={28} color={colors.yellow} /></View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: colors.white, marginBottom: 4 }}>Captain</Text>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 10 }}>Drive with Hubli Rider and earn money</Text>
            <View style={{ flexDirection: 'row', gap: 6 }}>{['Flexible hours','Daily payouts'].map(f => <View key={f} style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3 }}><Text style={{ fontSize: 11, fontWeight: '600', color: colors.yellow }}>{f}</Text></View>)}</View>
          </View>
          <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' }}><Ionicons name="chevron-forward" size={18} color={colors.white} /></View>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', marginTop: 8 }} onPress={() => navigation.navigate('Login')}>
          <Text style={{ fontSize: 13, color: colors.grey }}>Already have an account? <Text style={{ color: colors.black, fontWeight: '700' }}>Login</Text></Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─── AUTH: REGISTER USER ──────────────────────────────────────
function RegisterUserScreen({ navigation }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [focused, setFocused] = useState(null);
  const valid = form.name.trim() && form.email.includes('@') && form.phone.length === 10;
  function field(key) { return { value: form[key], onChangeText: v => setForm(p => ({ ...p, [key]: v })), onFocus: () => setFocused(key), onBlur: () => setFocused(null) }; }
  async function handleSendOtp() {
    try { const list = await getUsers(); if (list.find(u => u.phone === form.phone)) { Alert.alert('Already Registered', 'This mobile number is already registered. Please login.'); return; } } catch {}
    navigation.navigate('OtpVerify', { phone: form.phone, flow: 'registerUser', userData: { ...form } });
  }
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ backgroundColor: colors.yellow, paddingTop: 56, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
          <TouchableOpacity style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.1)', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={20} color={colors.black} /></TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.black }}>User Registration</Text>
        </View>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: '900', color: colors.black, letterSpacing: -0.5, lineHeight: 32, marginTop: 8, marginBottom: 4 }}>Create Your{'\n'}Rider Account</Text>
          <Text style={{ fontSize: 13, color: colors.grey, marginBottom: 20 }}>Fill in your details to get started</Text>
          <View style={[{ backgroundColor: colors.white, borderRadius: radius.lg, padding: 20, borderWidth: 1, borderColor: colors.border, marginBottom: 20 }, shadow.sm]}>
            {[{ key: 'name', label: 'Full Name', icon: 'person-outline', placeholder: 'Ananya Rao', keyboard: 'default' }, { key: 'email', label: 'Email Address', icon: 'mail-outline', placeholder: 'ananya@email.com', keyboard: 'email-address' }].map(({ key, label, icon, placeholder, keyboard }) => (
              <View key={key} style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: colors.grey, marginBottom: 6, letterSpacing: 0.4 }}>{label}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: focused === key ? colors.yellow : colors.border, borderRadius: radius.md, backgroundColor: colors.white, overflow: 'hidden' }}>
                  <Ionicons name={icon} size={16} color={colors.grey} style={{ marginLeft: 12, marginRight: 8 }} />
                  <TextInput style={{ flex: 1, paddingHorizontal: 4, paddingVertical: 13, fontSize: 14, fontWeight: '500', color: colors.black }} placeholder={placeholder} placeholderTextColor={colors.greyLight} keyboardType={keyboard} autoCapitalize={key === 'email' ? 'none' : 'words'} {...field(key)} />
                </View>
              </View>
            ))}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: colors.grey, marginBottom: 6, letterSpacing: 0.4 }}>Mobile Number</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: focused === 'phone' ? colors.yellow : colors.border, borderRadius: radius.md, backgroundColor: colors.white, overflow: 'hidden' }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: colors.black, paddingHorizontal: 12 }}>🇮🇳 +91</Text>
                <View style={{ width: 1, height: 20, backgroundColor: colors.border }} />
                <TextInput style={{ flex: 1, paddingHorizontal: 12, paddingVertical: 13, fontSize: 14, fontWeight: '500', color: colors.black }} placeholder="98765 43210" placeholderTextColor={colors.greyLight} keyboardType="number-pad" maxLength={10} {...field('phone')} />
                {form.phone.length === 10 && <Ionicons name="checkmark-circle" size={18} color={colors.success} style={{ marginRight: 8 }} />}
              </View>
            </View>
          </View>
          <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: valid ? colors.yellow : colors.greyBg, borderRadius: radius.pill, paddingVertical: 15, marginBottom: 16 }} disabled={!valid} onPress={handleSendOtp} activeOpacity={0.85}>
            <Text style={{ fontSize: 15, fontWeight: '800', color: valid ? colors.black : colors.greyLight }}>Send OTP</Text>
            <Ionicons name="arrow-forward" size={18} color={valid ? colors.black : colors.greyLight} />
          </TouchableOpacity>
          <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => navigation.navigate('Login')}>
            <Text style={{ fontSize: 13, color: colors.grey }}>Already have an account? <Text style={{ color: colors.black, fontWeight: '700' }}>Login</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── AUTH: REGISTER CAPTAIN ───────────────────────────────────
const VEHICLE_TYPES = ['Bike', 'Auto', 'Sedan', 'Hatchback', 'SUV'];
const STEPS = ['Personal', 'Identity', 'Vehicle', 'Additional'];
function CaptainField({ label, fkey, placeholder, keyboard, maxLength, form, focused, onChange, onFocus, onBlur }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 12, fontWeight: '600', color: colors.grey, marginBottom: 6, letterSpacing: 0.4 }}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: focused === fkey ? colors.yellow : colors.border, borderRadius: radius.md, backgroundColor: colors.white, overflow: 'hidden' }}>
        <TextInput style={{ flex: 1, paddingHorizontal: 12, paddingVertical: 13, fontSize: 14, fontWeight: '500', color: colors.black }} placeholder={placeholder} placeholderTextColor={colors.greyLight} maxLength={maxLength} autoCapitalize="none" keyboardType={keyboard || 'default'} value={form[fkey]} onChangeText={v => onChange(fkey, v)} onFocus={() => onFocus(fkey)} onBlur={onBlur} />
      </View>
    </View>
  );
}
function RegisterCaptainScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [focused, setFocused] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', licenceNumber: '', aadhaarNumber: '', licenceFile: null, aadhaarFile: null, vehicleNumber: '', vehicleType: '', seats: '', vehicleMake: '', vehicleModel: '', vehicleYear: '', experience: '', city: '', address: '' });
  function set(key, val) { setForm(p => ({ ...p, [key]: val })); }
  const fp = { form, focused, onChange: set, onFocus: k => setFocused(k), onBlur: () => setFocused(null) };
  function canProceed() {
    if (step === 0) return form.name.trim() && form.phone.length === 10 && form.email.includes('@');
    if (step === 1) return form.licenceNumber.trim() && form.aadhaarNumber.length >= 12;
    if (step === 2) return form.vehicleNumber.trim() && form.vehicleType && form.seats && form.vehicleMake && form.vehicleModel && form.vehicleYear;
    if (step === 3) return form.experience.trim() && form.city.trim() && form.address.trim();
    return false;
  }
  function handleNext() {
    if (step < 3) { setStep(s => s + 1); return; }
    navigation.navigate('OtpVerify', { phone: form.phone, flow: 'registerCaptain', captainData: form });
  }
  function renderStep() {
    if (step === 0) return (<>
      <CaptainField label="Full Name" fkey="name" placeholder="Suresh Kumar" {...fp} />
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.grey, marginBottom: 6, letterSpacing: 0.4 }}>Mobile Number</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: focused === 'phone' ? colors.yellow : colors.border, borderRadius: radius.md, backgroundColor: colors.white, overflow: 'hidden' }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: colors.black, paddingHorizontal: 12 }}>🇮🇳 +91</Text>
          <View style={{ width: 1, height: 20, backgroundColor: colors.border }} />
          <TextInput style={{ flex: 1, paddingHorizontal: 12, paddingVertical: 13, fontSize: 14, fontWeight: '500', color: colors.black }} placeholder="91112 22223" placeholderTextColor={colors.greyLight} keyboardType="number-pad" maxLength={10} value={form.phone} onChangeText={v => set('phone', v)} onFocus={() => setFocused('phone')} onBlur={() => setFocused(null)} />
        </View>
      </View>
      <CaptainField label="Email Address" fkey="email" placeholder="suresh@email.com" keyboard="email-address" {...fp} />
    </>);
    if (step === 1) return (<>
      <CaptainField label="Driving Licence Number" fkey="licenceNumber" placeholder="KA0520230012345" maxLength={20} {...fp} />
      <CaptainField label="Aadhaar Number" fkey="aadhaarNumber" placeholder="1234 5678 9012" keyboard="number-pad" maxLength={12} {...fp} />
      {[{ key: 'licenceFile', label: 'Upload Driving Licence' }, { key: 'aadhaarFile', label: 'Upload Aadhaar Card' }].map(({ key, label }) => (
        <View key={key} style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: colors.grey, marginBottom: 6, letterSpacing: 0.4 }}>{label}</Text>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1.5, borderColor: form[key] ? colors.success : colors.border, borderStyle: form[key] ? 'solid' : 'dashed', borderRadius: radius.md, padding: 14, backgroundColor: form[key] ? colors.successBg : colors.greyBg }} onPress={() => set(key, `${key}_preview.jpg`)} activeOpacity={0.8}>
            <Ionicons name={form[key] ? 'checkmark-circle' : 'cloud-upload-outline'} size={20} color={form[key] ? colors.success : colors.grey} />
            <Text style={{ fontSize: 13, fontWeight: '500', color: form[key] ? colors.success : colors.grey }}>{form[key] ? 'File selected (preview only)' : 'Tap to select file'}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </>);
    if (step === 2) return (<>
      <CaptainField label="Vehicle Number / Number Plate" fkey="vehicleNumber" placeholder="KA05 AB 1234" {...fp} />
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.grey, marginBottom: 6, letterSpacing: 0.4 }}>Vehicle Type</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {VEHICLE_TYPES.map(t => <TouchableOpacity key={t} style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1.5, borderColor: form.vehicleType === t ? colors.yellow : colors.border, backgroundColor: form.vehicleType === t ? colors.yellow : colors.white }} onPress={() => set('vehicleType', t)}><Text style={{ fontSize: 13, fontWeight: '600', color: form.vehicleType === t ? colors.black : colors.grey }}>{t}</Text></TouchableOpacity>)}
        </View>
      </View>
      <CaptainField label="Number of Seats" fkey="seats" placeholder="4" keyboard="number-pad" maxLength={2} {...fp} />
      <CaptainField label="Vehicle Make" fkey="vehicleMake" placeholder="Honda" {...fp} />
      <CaptainField label="Vehicle Model" fkey="vehicleModel" placeholder="Activa 6G" {...fp} />
      <CaptainField label="Vehicle Year" fkey="vehicleYear" placeholder="2022" keyboard="number-pad" maxLength={4} {...fp} />
    </>);
    if (step === 3) return (<>
      <CaptainField label="Driving Experience (years)" fkey="experience" placeholder="3" keyboard="number-pad" maxLength={2} {...fp} />
      <CaptainField label="City" fkey="city" placeholder="Hubli" {...fp} />
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.grey, marginBottom: 6, letterSpacing: 0.4 }}>Address</Text>
        <View style={{ borderWidth: 1.5, borderColor: focused === 'address' ? colors.yellow : colors.border, borderRadius: radius.md, backgroundColor: colors.white, overflow: 'hidden' }}>
          <TextInput style={{ paddingHorizontal: 12, paddingVertical: 13, fontSize: 14, fontWeight: '500', color: colors.black, height: 80, textAlignVertical: 'top' }} placeholder="123, Main Road, Hubli - 580001" placeholderTextColor={colors.greyLight} multiline value={form.address} onChangeText={v => set('address', v)} onFocus={() => setFocused('address')} onBlur={() => setFocused(null)} />
        </View>
      </View>
    </>);
  }
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ backgroundColor: colors.black, paddingTop: 56, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
          <TouchableOpacity style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' }} onPress={() => step > 0 ? setStep(s => s - 1) : navigation.goBack()}><Ionicons name="arrow-back" size={20} color={colors.white} /></TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.yellow }}>Captain Registration</Text>
        </View>
        <View style={{ padding: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, marginTop: 4 }}>
            {STEPS.map((s, i) => (
              <View key={s} style={{ alignItems: 'center', flex: 1 }}>
                <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: i < step ? colors.success : i === step ? colors.yellow : colors.greyBg, borderWidth: 2, borderColor: i < step ? colors.success : i === step ? colors.yellow : colors.border, justifyContent: 'center', alignItems: 'center', marginBottom: 4 }}>
                  {i < step ? <Ionicons name="checkmark" size={12} color={colors.black} /> : <Text style={{ fontSize: 12, fontWeight: '700', color: i === step ? colors.black : colors.grey }}>{i + 1}</Text>}
                </View>
                <Text style={{ fontSize: 10, fontWeight: '600', color: i === step ? colors.black : colors.greyLight, textAlign: 'center' }}>{s}</Text>
              </View>
            ))}
          </View>
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.black, marginBottom: 16 }}>Step {step + 1}: {STEPS[step]} Details</Text>
          <View style={[{ backgroundColor: colors.white, borderRadius: radius.lg, padding: 20, borderWidth: 1, borderColor: colors.border, marginBottom: 20 }, shadow.sm]}>{renderStep()}</View>
          <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: canProceed() ? colors.yellow : colors.greyBg, borderRadius: radius.pill, paddingVertical: 15, marginBottom: 16 }} disabled={!canProceed()} onPress={handleNext} activeOpacity={0.85}>
            <Text style={{ fontSize: 15, fontWeight: '800', color: canProceed() ? colors.black : colors.greyLight }}>{step < 3 ? 'Continue' : 'Register as Captain'}</Text>
            <Ionicons name={step < 3 ? 'arrow-forward' : 'checkmark'} size={18} color={canProceed() ? colors.black : colors.greyLight} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── AUTH: OTP VERIFY ─────────────────────────────────────────
function OtpVerifyScreen({ navigation, route }) {
  const { phone, flow, role, userData, captainData } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [demoCode, setDemoCode] = useState('');
  const inputs = useRef([]);
  useEffect(() => { generateOtp(phone).then(setDemoCode); }, []);
  useEffect(() => { if (timer <= 0) return; const t = setTimeout(() => setTimer(s => s - 1), 1000); return () => clearTimeout(t); }, [timer]);
  function handleChange(val, idx) { if (!/^\d*$/.test(val)) return; const next = [...otp]; next[idx] = val; setOtp(next); if (val && idx < 5) inputs.current[idx + 1]?.focus(); }
  function handleKeyPress(e, idx) { if (e.nativeEvent.key === 'Backspace' && !otp[idx] && idx > 0) inputs.current[idx - 1]?.focus(); }
  async function resend() { const code = await generateOtp(phone); setDemoCode(code); setTimer(30); setOtp(['', '', '', '', '', '']); inputs.current[0]?.focus(); }
  const filled = otp.every(d => d !== '');
  async function handleVerify() {
    if (!filled) return;
    const entered = otp.join('');
    const ok = await verifyOtp(phone, entered);
    if (!ok) { Alert.alert('Wrong OTP', 'The code you entered is incorrect.'); return; }
    setLoading(true);
    try {
      if (flow === 'registerUser') {
        const { error } = await registerUser(userData);
        if (error) { Alert.alert('Registration Failed', error); setLoading(false); return; }
        navigation.reset({ index: 0, routes: [{ name: 'User' }] });
      } else if (flow === 'registerCaptain') {
        const { error } = await registerCaptain({ ...captainData, verified: true });
        if (error) { Alert.alert('Registration Failed', error); setLoading(false); return; }
        navigation.reset({ index: 0, routes: [{ name: 'CaptainPending' }] });
      } else if (flow === 'login') {
        if (role === 'user') {
          const { error } = await loginUser(phone);
          if (error) { Alert.alert('Login Failed', error); setLoading(false); return; }
          navigation.reset({ index: 0, routes: [{ name: 'User' }] });
        } else {
          const { error, captain } = await loginCaptain(phone);
          if (error) { Alert.alert('Login Failed', error); setLoading(false); return; }
          if (captain.status === 'rejected') { Alert.alert('Account Rejected', 'Your captain account has been rejected.'); setLoading(false); return; }
          navigation.reset({ index: 0, routes: [{ name: captain.status === 'approved' ? 'Driver' : 'CaptainPending' }] });
        }
      }
    } catch { Alert.alert('Error', 'Something went wrong. Please try again.'); }
    setLoading(false);
  }
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.white }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ backgroundColor: colors.yellow, paddingTop: 56, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <TouchableOpacity style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.1)', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={20} color={colors.black} /></TouchableOpacity>
      </View>
      <View style={{ flex: 1, padding: 28, alignItems: 'center' }}>
        <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: colors.yellowLight, justifyContent: 'center', alignItems: 'center', marginTop: 24, marginBottom: 20 }}><Ionicons name="phone-portrait-outline" size={32} color={colors.black} /></View>
        <Text style={{ fontSize: 26, fontWeight: '900', color: colors.black, textAlign: 'center', letterSpacing: -0.5, lineHeight: 34, marginBottom: 10 }}>Verify your{'\n'}mobile number</Text>
        <Text style={{ fontSize: 14, color: colors.grey, textAlign: 'center', lineHeight: 22, marginBottom: 16 }}>Enter the 6-digit OTP sent to{'\n'}<Text style={{ fontWeight: '700', color: colors.black }}>+91 {phone}</Text></Text>
        {demoCode ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.yellowLight, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.yellow, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 24, width: '100%' }}>
            <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.black} />
            <Text style={{ flex: 1, fontSize: 13, color: colors.black, lineHeight: 18 }}><Text style={{ fontWeight: '700' }}>Demo SMS: </Text>Your Hubli Rider OTP is <Text style={{ fontWeight: '900', fontSize: 15, letterSpacing: 2 }}>{demoCode}</Text></Text>
          </View>
        ) : null}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 28 }}>
          {otp.map((digit, i) => (
            <TextInput key={i} ref={r => inputs.current[i] = r} style={{ width: 46, height: 54, borderRadius: radius.md, borderWidth: 2, borderColor: digit ? colors.yellow : colors.border, textAlign: 'center', fontSize: 22, fontWeight: '800', color: colors.black, backgroundColor: digit ? colors.yellowLight : colors.greyBg }} value={digit} onChangeText={v => handleChange(v, i)} onKeyPress={e => handleKeyPress(e, i)} keyboardType="number-pad" maxLength={1} selectTextOnFocus />
          ))}
        </View>
        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: filled && !loading ? colors.yellow : colors.greyBg, borderRadius: radius.pill, paddingVertical: 15, width: '100%', marginBottom: 16 }} disabled={!filled || loading} onPress={handleVerify} activeOpacity={0.85}>
          <Text style={{ fontSize: 15, fontWeight: '800', color: filled && !loading ? colors.black : colors.greyLight }}>{loading ? 'Verifying...' : 'Verify & Continue'}</Text>
          {!loading && <Ionicons name="checkmark" size={18} color={filled ? colors.black : colors.greyLight} />}
        </TouchableOpacity>
        <TouchableOpacity style={{ paddingVertical: 8 }} disabled={timer > 0} onPress={resend} activeOpacity={0.7}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: timer > 0 ? colors.greyLight : colors.black }}>{timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── AUTH: SUCCESS ────────────────────────────────────────────
function SuccessScreen({ navigation, route }) {
  const role = route.params?.role || 'user';
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', padding: 24 }}>
      <View style={[{ backgroundColor: colors.white, borderRadius: radius.xl, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: colors.border }, shadow.lg]}>
        <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: colors.successBg, justifyContent: 'center', alignItems: 'center', marginBottom: 24 }}><Ionicons name="checkmark-circle" size={56} color={colors.success} /></View>
        <Text style={{ fontSize: 26, fontWeight: '900', color: colors.black, textAlign: 'center', letterSpacing: -0.5, lineHeight: 34, marginBottom: 12 }}>Registration{'\n'}Successful!</Text>
        <Text style={{ fontSize: 14, color: colors.grey, textAlign: 'center', lineHeight: 22, marginBottom: 32 }}>Welcome to Hubli Rider!{'\n'}Your account has been created.</Text>
        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: colors.yellow, borderRadius: radius.pill, paddingVertical: 15, paddingHorizontal: 32 }} onPress={() => navigation.reset({ index: 0, routes: [{ name: role === 'user' ? 'User' : 'Driver' }] })} activeOpacity={0.85}>
          <Text style={{ fontSize: 15, fontWeight: '800', color: colors.black }}>Go to Dashboard</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.black} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── AUTH: CAPTAIN PENDING ────────────────────────────────────
function CaptainPendingScreen({ navigation }) {
  async function handleLogout() { await logout(); navigation.reset({ index: 0, routes: [{ name: 'Login' }] }); }
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: colors.black, paddingTop: 56, paddingBottom: 24, paddingHorizontal: 24, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,196,0,0.15)', justifyContent: 'center', alignItems: 'center' }}><Ionicons name="bicycle" size={20} color={colors.yellow} /></View>
          <Text style={{ fontSize: 22, fontWeight: '900', color: colors.yellow }}>Hubli Rider</Text>
        </View>
      </View>
      <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
        <View style={[{ backgroundColor: colors.white, borderRadius: radius.xl, padding: 28, borderWidth: 1, borderColor: colors.border, alignItems: 'center' }, shadow.card]}>
          <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: colors.yellowLight, justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}><Ionicons name="time-outline" size={48} color={colors.yellow} /></View>
          <Text style={{ fontSize: 24, fontWeight: '900', color: colors.black, textAlign: 'center', letterSpacing: -0.5, lineHeight: 32, marginBottom: 12 }}>Registration{'\n'}Submitted</Text>
          <Text style={{ fontSize: 13, color: colors.grey, textAlign: 'center', lineHeight: 20, marginBottom: 20 }}>Your captain account is pending admin approval.{'\n\n'}We'll notify you once your account is reviewed. This usually takes 24–48 hours.</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FEF9C3', borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 7, marginBottom: 24 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#CA8A04' }} />
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#92400E' }}>Pending Review</Text>
          </View>
          <View style={{ width: '100%', gap: 12, marginBottom: 28 }}>
            {[{ icon: 'checkmark-circle', label: 'Registration submitted', done: true }, { icon: 'time-outline', label: 'Admin review in progress', done: false }, { icon: 'bicycle-outline', label: 'Start accepting rides', done: false }].map((s, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Ionicons name={s.icon} size={20} color={s.done ? colors.success : colors.greyLight} />
                <Text style={{ fontSize: 13, fontWeight: '500', color: s.done ? colors.black : colors.greyLight }}>{s.label}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} onPress={handleLogout} activeOpacity={0.8}>
            <Ionicons name="log-out-outline" size={16} color={colors.grey} />
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.grey }}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── USER: HOME ───────────────────────────────────────────────
function HomeScreen({ navigation }) {
  const [pickup, setPickup] = useState('Koramangala 5th Block');
  const [drop, setDrop] = useState('');
  const [selected, setSelected] = useState('auto');
  const [dropFocused, setDropFocused] = useState(false);
  const [userName, setUserName] = useState('');
  useEffect(() => { getCurrentUser().then(u => u && setUserName(u.name)); }, []);
  const selectedRide = rideTypes.find(r => r.id === selected);
  const rideAccent = { bike: colors.bike, auto: colors.yellow, cab: colors.cab, cabpremium: colors.cab };
  const rideBg = { bike: colors.bikeBg, auto: colors.autoBg, cab: colors.cabBg, cabpremium: colors.cabBg };
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ height: '34%', backgroundColor: '#C8DDD0', overflow: 'hidden' }}>
        <MapView style={StyleSheet.absoluteFill} pickup={{ lat: 12.9352, lng: 77.6245, label: pickup || 'Pickup' }} />
        <TouchableOpacity style={[{ position: 'absolute', top: 48, left: 18, width: 40, height: 40, borderRadius: 12, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center' }, shadow.card]}><Ionicons name="menu" size={20} color={colors.black} /></TouchableOpacity>
        <View style={[{ position: 'absolute', top: 52, right: 18, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.white, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 5 }, shadow.sm]}>
          <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success }} />
          <Text style={{ fontSize: 11, fontWeight: '600', color: colors.black }}>Hubli Rider</Text>
        </View>
      </View>
      <View style={[{ flex: 1, backgroundColor: colors.white, marginTop: -20, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 18, paddingTop: 10, paddingBottom: 16 }, shadow.lg]}>
        <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: 14 }} />
        {userName ? <Text style={{ fontSize: 15, fontWeight: '700', color: colors.black, marginBottom: 10 }}>Welcome, {userName} 👋</Text> : null}
        <View style={[{ borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, marginBottom: 16, backgroundColor: colors.white }, shadow.sm]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 11, gap: 10 }}>
            <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: colors.success }} />
            <TextInput style={{ flex: 1, fontSize: 14, fontWeight: '600', color: colors.black }} value={pickup} onChangeText={setPickup} placeholder="Pickup location" placeholderTextColor={colors.greyLight} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
            <Ionicons name="swap-vertical" size={14} color={colors.grey} style={{ marginHorizontal: 8 }} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 11, gap: 10 }}>
            <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: colors.danger }} />
            <TextInput style={{ flex: 1, fontSize: 14, fontWeight: '600', color: colors.black }} value={drop} onChangeText={setDrop} placeholder="Where to?" placeholderTextColor={colors.greyLight} onFocus={() => setDropFocused(true)} onBlur={() => setDropFocused(false)} />
            {drop.length > 0 && <TouchableOpacity onPress={() => setDrop('')}><Ionicons name="close-circle" size={16} color={colors.greyLight} /></TouchableOpacity>}
          </View>
        </View>
        <Text style={{ ...type.label, marginBottom: 10 }}>Choose a ride</Text>
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {rideTypes.map(r => {
            const isActive = selected === r.id;
            return (
              <TouchableOpacity key={r.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: radius.md, borderWidth: 1.5, borderColor: isActive ? (rideAccent[r.id] || colors.yellow) : colors.border, backgroundColor: isActive ? (rideBg[r.id] || colors.yellowLight) : colors.white, marginBottom: 8 }} onPress={() => setSelected(r.id)} activeOpacity={0.8}>
                <View style={{ width: 44, height: 44, borderRadius: radius.sm, backgroundColor: isActive ? (rideBg[r.id] || colors.yellowLight) : colors.greyBg, justifyContent: 'center', alignItems: 'center' }}><Ionicons name={r.ionicon} size={22} color={isActive ? (rideAccent[r.id] || colors.yellow) : colors.grey} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={type.h3}>{r.label}</Text>
                  <Text style={{ ...type.small, marginTop: 2 }}>{r.desc} · {r.eta} away</Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <Text style={{ fontSize: 15, fontWeight: '800', color: colors.black }}>₹{r.price}</Text>
                  {isActive && <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: colors.yellow }} />}
                </View>
              </TouchableOpacity>
            );
          })}
          <View style={{ height: 8 }} />
        </ScrollView>
        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: drop ? colors.yellow : colors.greyBg, borderRadius: radius.pill, paddingVertical: 15, marginTop: 4 }} disabled={!drop} onPress={() => navigation.navigate('Finding', { ride: selectedRide, pickup, drop })} activeOpacity={0.85}>
          <Text style={{ fontSize: 15, fontWeight: '800', color: drop ? colors.black : colors.greyLight }}>{drop ? `Book ${selectedRide.label}  ·  ₹${selectedRide.price}` : 'Enter a drop location'}</Text>
          {drop && <Ionicons name="arrow-forward" size={18} color={colors.black} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── USER: FINDING DRIVER ─────────────────────────────────────
function FindingDriverScreen({ route, navigation }) {
  const { ride, pickup, drop } = route.params;
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.timing(spin, { toValue: 1, duration: 1400, easing: Easing.linear, useNativeDriver: true })).start();
    const t = setTimeout(() => {
      const pool = drivers.filter(d => d.status === 'online');
      const driver = pool[Math.floor(Math.random() * pool.length)];
      navigation.replace('Tracking', { ride, pickup, drop, driver });
    }, 2600);
    return () => clearTimeout(t);
  }, []);
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  return (
    <View style={{ flex: 1, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Animated.View style={{ width: 120, height: 120, borderRadius: 60, borderWidth: 6, borderColor: colors.yellow, borderTopColor: colors.border, marginBottom: 16, transform: [{ rotate }] }} />
      <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: colors.yellowLight, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '28%' }}><Ionicons name={ride.ionicon || 'bicycle'} size={36} color={colors.black} /></View>
      <Text style={type.h2}>Finding your {ride.label}</Text>
      <Text style={{ ...type.body, marginTop: 6 }}>Matching you with a nearby Hubli Rider captain...</Text>
      <View style={{ width: '100%', backgroundColor: colors.bg, borderRadius: radius.md, padding: 16, marginTop: 32 }}>
        <Text style={type.label}>PICKUP</Text><Text style={type.body}>{pickup}</Text>
        <View style={{ height: 10 }} />
        <Text style={type.label}>DROP</Text><Text style={type.body}>{drop}</Text>
      </View>
      <TouchableOpacity style={{ marginTop: 28, paddingVertical: 12, paddingHorizontal: 24 }} onPress={() => navigation.goBack()}>
        <Text style={{ color: colors.danger, fontWeight: '700', fontSize: 15 }}>Cancel search</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── USER: RIDE TRACKING ──────────────────────────────────────
function RideTrackingScreen({ route, navigation }) {
  const { ride, pickup, drop, driver } = route.params;
  const [status, setStatus] = useState('arriving');
  const { height } = Dimensions.get('window');
  const mapHeight = Math.max(160, height * 0.3);
  const otp = '4821';
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ height: mapHeight, backgroundColor: '#C8DDD0', overflow: 'hidden' }}>
        <MapView style={StyleSheet.absoluteFill} pickup={{ lat: 12.9352, lng: 77.6245, label: pickup }} drop={{ lat: 12.9716, lng: 77.5946, label: drop }} driverLat={status === 'arriving' ? 12.9400 : 12.9550} driverLng={status === 'arriving' ? 77.6200 : 77.6100} />
        <TouchableOpacity style={[{ position: 'absolute', top: 48, left: 18, width: 38, height: 38, borderRadius: 12, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center' }, shadow.card]} onPress={() => navigation.popToTop()}><Ionicons name="arrow-back" size={18} color={colors.black} /></TouchableOpacity>
        <View style={[{ position: 'absolute', top: 52, right: 18, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.white, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 5 }, shadow.sm]}>
          <Ionicons name="time-outline" size={13} color={colors.black} />
          <Text style={{ fontSize: 11, fontWeight: '700', color: colors.black }}>{status === 'arriving' ? '4 min away' : 'On the way'}</Text>
        </View>
      </View>
      <ScrollView style={[{ backgroundColor: colors.white, marginTop: -20, borderTopLeftRadius: 28, borderTopRightRadius: 28 }, shadow.lg]} contentContainerStyle={{ padding: 18, paddingTop: 10, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: 16 }} />
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ ...type.label, marginBottom: 4 }}>{status === 'arriving' ? 'CAPTAIN ARRIVING' : 'RIDE IN PROGRESS'}</Text>
            <Text style={type.h2}>{status === 'arriving' ? `${driver.name.split(' ')[0]} is on the way` : 'Heading to drop'}</Text>
          </View>
          <View style={{ backgroundColor: colors.yellowLight, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 8, alignItems: 'center', borderWidth: 1.5, borderColor: colors.yellow }}>
            <Text style={{ fontSize: 9, fontWeight: '700', color: colors.yellowDark, letterSpacing: 0.5 }}>OTP</Text>
            <Text style={{ fontSize: 20, fontWeight: '900', color: colors.black, letterSpacing: 2 }}>{otp}</Text>
          </View>
        </View>
        <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.greyBg, borderRadius: radius.md, padding: 14, marginBottom: 14 }, shadow.card]}>
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.black, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 18, fontWeight: '800', color: colors.yellow }}>{driver.name[0]}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={type.h3}>{driver.name}</Text>
            <Text style={{ ...type.small, marginTop: 2 }}>{driver.vehicle} · {driver.number}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.yellowLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.pill }}>
            <Ionicons name="star" size={11} color={colors.yellowDark} />
            <Text style={{ fontWeight: '700', fontSize: 12, color: colors.black }}>{driver.rating}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
          {[{ icon: 'call', label: 'Call', color: colors.black }, { icon: 'chatbubble-ellipses', label: 'Chat', color: colors.black }, { icon: 'close-circle', label: 'Cancel', color: colors.danger }].map(a => (
            <TouchableOpacity key={a.label} style={{ flex: 1, flexDirection: 'row', gap: 5, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: a.label === 'Cancel' ? colors.dangerBg : colors.border, borderRadius: radius.sm, paddingVertical: 10, backgroundColor: a.label === 'Cancel' ? colors.dangerBg : colors.white }}>
              <Ionicons name={a.icon} size={17} color={a.color} />
              <Text style={{ fontWeight: '700', fontSize: 12, color: a.color }}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ backgroundColor: colors.greyBg, borderRadius: radius.md, padding: 14, marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
            <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: colors.success, marginTop: 4 }} />
            <View style={{ flex: 1 }}><Text style={type.label}>PICKUP</Text><Text style={{ ...type.body, marginTop: 2 }}>{pickup}</Text></View>
          </View>
          <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 10, marginLeft: 21 }} />
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
            <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: colors.danger, marginTop: 4 }} />
            <View style={{ flex: 1 }}><Text style={type.label}>DROP</Text><Text style={{ ...type.body, marginTop: 2 }}>{drop}</Text></View>
          </View>
        </View>
        <TouchableOpacity style={{ backgroundColor: colors.yellow, borderRadius: radius.pill, paddingVertical: 15, alignItems: 'center' }} onPress={() => status === 'arriving' ? setStatus('ongoing') : navigation.reset({ index: 0, routes: [{ name: 'UserHome' }] })} activeOpacity={0.85}>
          <Text style={{ fontWeight: '800', fontSize: 15, color: colors.black }}>{status === 'arriving' ? 'Simulate: Start Ride' : `Simulate: Complete · ₹${ride.price}`}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// ─── USER: RIDE HISTORY ───────────────────────────────────────
const rideHistory = [
  { id: '1', label: 'Auto', ionicon: 'car-sport', date: 'Today, 9:14 AM', from: 'Koramangala', to: 'Indiranagar', price: 68 },
  { id: '2', label: 'Bike', ionicon: 'bicycle', date: 'Yesterday, 6:40 PM', from: 'HSR Layout', to: 'BTM Layout', price: 38 },
  { id: '3', label: 'Cab Economy', ionicon: 'car', date: '3 Sep, 8:02 AM', from: 'Whitefield', to: 'MG Road', price: 245 },
  { id: '4', label: 'Auto', ionicon: 'car-sport', date: '1 Sep, 7:15 PM', from: 'Jayanagar', to: 'JP Nagar', price: 54 },
];
function RideHistoryScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Text style={{ ...type.h1, padding: 20, paddingBottom: 8 }}>Your rides</Text>
      <FlatList data={rideHistory} keyExtractor={i => i.id} contentContainerStyle={{ padding: 20, paddingTop: 8, gap: 12 }} renderItem={({ item }) => (
        <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radius.md, padding: 14 }, shadow.card]}>
          <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: colors.yellowLight, justifyContent: 'center', alignItems: 'center' }}><Ionicons name={item.ionicon} size={22} color={colors.black} /></View>
          <View style={{ flex: 1 }}>
            <Text style={type.h3}>{item.label}</Text>
            <Text style={type.small}>{item.date}</Text>
            <Text style={type.small} numberOfLines={1}>{item.from} → {item.to}</Text>
          </View>
          <Text style={{ fontWeight: '800', fontSize: 15, color: colors.black }}>₹{item.price}</Text>
        </View>
      )} />
    </View>
  );
}

// ─── USER: PROFILE ────────────────────────────────────────────
const profileMenu = [
  { icon: 'wallet-outline', label: 'Payments & wallet' },
  { icon: 'pricetag-outline', label: 'Offers & coupons' },
  { icon: 'shield-checkmark-outline', label: 'Safety center' },
  { icon: 'help-circle-outline', label: 'Help & support' },
  { icon: 'settings-outline', label: 'Settings' },
];
function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  useEffect(() => { getCurrentUser().then(setUser); }, []);
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  function handleLogout() {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: async () => {
        await logout();
        navigation.getParent()?.getParent()?.reset({ index: 0, routes: [{ name: 'Login' }] });
      }},
    ]);
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: colors.yellow, alignItems: 'center', paddingTop: 24, paddingBottom: 28, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 }}><Ionicons name="bicycle" size={20} color={colors.black} /><Text style={{ fontSize: 16, fontWeight: '900', color: colors.black }}>Hubli Rider</Text></View>
        <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: colors.black, justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}><Text style={{ fontSize: 26, fontWeight: '800', color: colors.yellow }}>{initials}</Text></View>
        <Text style={type.h2}>{user?.name || '—'}</Text>
        <Text style={type.small}>+91 {user?.phone || '—'}</Text>
      </View>
      <View style={{ padding: 20, gap: 10 }}>
        {profileMenu.map(m => (
          <TouchableOpacity key={m.label} style={[{ flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.card, padding: 14, borderRadius: radius.md }, shadow.card]}>
            <Ionicons name={m.icon} size={20} color={colors.black} />
            <Text style={{ fontSize: 15, fontWeight: '600', color: colors.black }}>{m.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.grey} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={{ marginTop: 16, alignItems: 'center', paddingVertical: 14, backgroundColor: colors.dangerBg, borderRadius: radius.pill, borderWidth: 1, borderColor: '#FECACA' }} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={{ color: colors.danger, fontWeight: '700', fontSize: 15 }}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─── DRIVER: HOME ─────────────────────────────────────────────
function DriverHomeScreen({ navigation }) {
  const [online, setOnline] = useState(true);
  const [captain, setCaptain] = useState(null);
  useEffect(() => { getCurrentUser().then(setCaptain); }, []);
  async function handleLogout() { await logout(); navigation.reset({ index: 0, routes: [{ name: 'Login' }] }); }
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.yellow, paddingTop: 56, paddingHorizontal: 18, paddingBottom: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: colors.black, justifyContent: 'center', alignItems: 'center' }}><Ionicons name="bicycle" size={20} color={colors.yellow} /></View>
          <View><Text style={{ fontSize: 11, fontWeight: '500', color: 'rgba(0,0,0,0.55)' }}>Hubli Rider</Text><Text style={{ fontSize: 15, fontWeight: '800', color: colors.black }}>{captain?.name || 'Captain'}</Text></View>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 2 }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: online ? colors.success : colors.grey }}>{online ? 'Online' : 'Offline'}</Text>
          <Switch value={online} onValueChange={setOnline} trackColor={{ false: colors.border, true: colors.success }} thumbColor={colors.white} />
        </View>
        <TouchableOpacity onPress={handleLogout} style={{ marginLeft: 8 }}><Ionicons name="log-out-outline" size={20} color={colors.black} /></TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', gap: 10, padding: 16 }}>
        {[{ icon: 'wallet-outline', bg: colors.yellowLight, color: colors.yellowDark, value: '₹860', label: "Today's earnings" }, { icon: 'checkmark-circle-outline', bg: colors.bikeBg, color: colors.bike, value: '12', label: 'Rides done' }, { icon: 'star-outline', bg: colors.infoBg, color: colors.info, value: '4.8', label: 'Rating' }].map((s, i) => (
          <View key={i} style={[{ flex: 1, backgroundColor: colors.card, borderRadius: radius.md, padding: 12, alignItems: 'flex-start', gap: 6 }, shadow.card]}>
            <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: s.bg, justifyContent: 'center', alignItems: 'center' }}><Ionicons name={s.icon} size={18} color={s.color} /></View>
            <Text style={{ fontSize: 20, fontWeight: '800', color: colors.black }}>{s.value}</Text>
            <Text style={type.small}>{s.label}</Text>
          </View>
        ))}
      </View>
      {online ? (
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 10 }}>
            <Text style={type.h3}>Nearby requests</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.successBg, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success }} />
              <Text style={{ fontSize: 11, fontWeight: '700', color: colors.success }}>Live</Text>
            </View>
          </View>
          <FlatList data={dummyRideRequests} keyExtractor={i => i.id} contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingBottom: 20 }} renderItem={({ item }) => (
            <TouchableOpacity style={[{ backgroundColor: colors.card, borderRadius: radius.md, padding: 14 }, shadow.card]} activeOpacity={0.8} onPress={() => navigation.navigate('IncomingRide', { request: item })}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <View style={{ backgroundColor: colors.greyBg, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 }}><Text style={{ fontSize: 12, fontWeight: '700', color: colors.charcoal }}>{item.rideType}</Text></View>
                <Text style={{ fontSize: 18, fontWeight: '800', color: colors.black }}>₹{item.fare}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 12, marginBottom: 10 }}>
                <View style={{ alignItems: 'center', paddingTop: 3, gap: 2 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success }} />
                  <View style={{ width: 1.5, height: 18, backgroundColor: colors.border }} />
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.danger }} />
                </View>
                <View style={{ flex: 1, gap: 8 }}>
                  <Text style={type.body} numberOfLines={1}>{item.pickup}</Text>
                  <Text style={type.body} numberOfLines={1}>{item.drop}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name="navigate-outline" size={12} color={colors.grey} />
                <Text style={type.small}>{item.distance} · {item.eta}</Text>
              </View>
            </TouchableOpacity>
          )} />
        </>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colors.greyBg, justifyContent: 'center', alignItems: 'center' }}><Ionicons name="moon" size={32} color={colors.greyLight} /></View>
          <Text style={{ ...type.h3, color: colors.grey, marginTop: 16 }}>You're offline</Text>
          <Text style={{ ...type.small, marginTop: 6, textAlign: 'center' }}>Toggle online to start receiving ride requests</Text>
        </View>
      )}
    </View>
  );
}

// ─── DRIVER: EARNINGS ─────────────────────────────────────────
const weekEarnings = [{ day: 'Mon', amount: 720 }, { day: 'Tue', amount: 860 }, { day: 'Wed', amount: 640 }, { day: 'Thu', amount: 910 }, { day: 'Fri', amount: 1120 }, { day: 'Sat', amount: 1340 }, { day: 'Sun', amount: 860 }];
const weekMax = Math.max(...weekEarnings.map(w => w.amount));
function DriverEarningsScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: colors.yellow, paddingTop: 24, paddingBottom: 24, paddingHorizontal: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}><Ionicons name="bicycle" size={22} color={colors.black} /><Text style={{ fontSize: 18, fontWeight: '900', color: colors.black }}>Hubli Rider</Text></View>
        <Text style={type.small}>This week's earnings</Text>
        <Text style={{ fontSize: 32, fontWeight: '900', color: colors.black, marginTop: 4 }}>₹{weekEarnings.reduce((a, b) => a + b.amount, 0).toLocaleString('en-IN')}</Text>
      </View>
      <View style={[{ backgroundColor: colors.card, margin: 20, borderRadius: radius.md, padding: 16 }, shadow.card]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 140 }}>
          {weekEarnings.map(w => (
            <View key={w.day} style={{ alignItems: 'center', gap: 6 }}>
              <View style={{ width: 18, height: (w.amount / weekMax) * 110, backgroundColor: colors.yellow, borderRadius: 6 }} />
              <Text style={{ fontSize: 11, color: colors.grey, fontWeight: '600' }}>{w.day}</Text>
            </View>
          ))}
        </View>
      </View>
      <Text style={{ ...type.h3, paddingHorizontal: 20, marginBottom: 10 }}>Payout summary</Text>
      <View style={[{ backgroundColor: colors.card, marginHorizontal: 20, marginBottom: 30, borderRadius: radius.md, padding: 16, gap: 12 }, shadow.card]}>
        {[['Total trips', '68'], ['Online hours', '41h 20m'], ['Cash collected', '₹2,140'], ['Incentives earned', '₹450']].map(([label, value]) => (
          <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={type.body}>{label}</Text>
            <Text style={{ fontWeight: '700', color: colors.black }}>{value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// ─── DRIVER: INCOMING RIDE ────────────────────────────────────
function IncomingRideScreen({ route, navigation }) {
  const { request } = route.params;
  const [seconds, setSeconds] = useState(15);
  useEffect(() => {
    const t = setInterval(() => setSeconds(s => { if (s <= 1) { clearInterval(t); navigation.goBack(); return 0; } return s - 1; }), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 20, paddingTop: 60 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={type.label}>NEW RIDE REQUEST</Text>
        <View style={{ backgroundColor: colors.black, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 5 }}><Text style={{ color: colors.white, fontWeight: '800', fontSize: 13 }}>{seconds}s</Text></View>
      </View>
      <View style={[{ backgroundColor: colors.card, borderRadius: radius.lg, padding: 18 }, shadow.card]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: colors.autoBg, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontWeight: '800', fontSize: 18 }}>{request.riderName.split(' ').map(n => n[0]).join('')}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={type.h3}>{request.riderName}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}><Ionicons name="star" size={12} color={colors.yellowDark} /><Text style={type.small}>{request.riderRating}</Text></View>
          </View>
          <Text style={{ fontSize: 20, fontWeight: '800', color: colors.black }}>₹{request.fare}</Text>
        </View>
        <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 16 }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}><Ionicons name="ellipse" size={8} color={colors.success} /><Text style={{ ...type.body, flex: 1 }}>{request.pickup}</Text></View>
        <View style={{ width: 1, height: 18, backgroundColor: colors.border, marginLeft: 4, marginVertical: 2 }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}><Ionicons name="location" size={12} color={colors.danger} /><Text style={{ ...type.body, flex: 1 }}>{request.drop}</Text></View>
        <View style={{ flexDirection: 'row', gap: 24, marginTop: 18 }}>
          <View style={{ gap: 2 }}><Text style={type.label}>DISTANCE</Text><Text style={type.h3}>{request.distance}</Text></View>
          <View style={{ gap: 2 }}><Text style={type.label}>RIDE TYPE</Text><Text style={type.h3}>{request.rideType}</Text></View>
        </View>
      </View>
      <View style={{ marginTop: 'auto', marginBottom: 30, alignItems: 'center', gap: 14 }}>
        <SwipeButton label="Swipe to accept ride" color={colors.success} onSwipeSuccess={() => navigation.replace('ActiveRide', { request })} />
        <TouchableOpacity style={{ paddingVertical: 8 }} onPress={() => navigation.goBack()}><Text style={{ color: colors.danger, fontWeight: '700' }}>Decline</Text></TouchableOpacity>
      </View>
    </View>
  );
}

// ─── DRIVER: ACTIVE RIDE ──────────────────────────────────────
function ActiveRideScreen({ route, navigation }) {
  const { request } = route.params;
  const [stage, setStage] = useState('toPickup');
  const [otpInput, setOtpInput] = useState('');
  const { height } = Dimensions.get('window');
  const mapHeight = Math.max(140, height * 0.28);
  const finish = () => navigation.reset({ index: 0, routes: [{ name: 'DriverHome' }] });
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={{ height: mapHeight, backgroundColor: '#DCEAE2', justifyContent: 'center', alignItems: 'center' }}><Ionicons name="navigate" size={36} color={colors.black} /></View>
      <ScrollView style={{ backgroundColor: colors.white, marginTop: -20, borderTopLeftRadius: 24, borderTopRightRadius: 24 }} contentContainerStyle={{ padding: 20, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radius.md, padding: 14 }, shadow.card]}>
          <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: colors.autoBg, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontWeight: '800' }}>{request.riderName.split(' ').map(n => n[0]).join('')}</Text></View>
          <View style={{ flex: 1 }}><Text style={type.h3}>{request.riderName}</Text><Text style={type.small}>{request.rideType} • ₹{request.fare}</Text></View>
          <TouchableOpacity style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }}><Ionicons name="call" size={18} color={colors.black} /></TouchableOpacity>
        </View>
        {stage === 'toPickup' && (<>
          <Text style={{ ...type.h2, marginTop: 20 }}>Heading to pickup</Text>
          <Text style={{ ...type.body, marginBottom: 20 }}>{request.pickup}</Text>
          <TouchableOpacity style={{ backgroundColor: colors.yellow, borderRadius: radius.pill, paddingVertical: 16, alignItems: 'center', marginTop: 16 }} onPress={() => setStage('otp')}><Text style={{ fontWeight: '800', fontSize: 15, color: colors.black }}>Arrived at pickup</Text></TouchableOpacity>
        </>)}
        {stage === 'otp' && (<>
          <Text style={{ ...type.h2, marginTop: 20 }}>Enter rider's OTP</Text>
          <Text style={{ ...type.body, marginBottom: 16 }}>Ask the rider for their 4 digit OTP to start</Text>
          <TextInput style={{ borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, fontSize: 26, fontWeight: '800', textAlign: 'center', letterSpacing: 10, paddingVertical: 14, marginBottom: 20 }} keyboardType="number-pad" maxLength={4} value={otpInput} onChangeText={setOtpInput} placeholder="0000" placeholderTextColor={colors.greyLight} />
          <TouchableOpacity style={{ backgroundColor: colors.yellow, borderRadius: radius.pill, paddingVertical: 16, alignItems: 'center', marginTop: 16, opacity: otpInput.length === 4 ? 1 : 0.4 }} disabled={otpInput.length !== 4} onPress={() => setStage('toDrop')}><Text style={{ fontWeight: '800', fontSize: 15, color: colors.black }}>Start ride</Text></TouchableOpacity>
        </>)}
        {stage === 'toDrop' && (<>
          <Text style={{ ...type.h2, marginTop: 20 }}>On trip to drop</Text>
          <Text style={{ ...type.body, marginBottom: 20 }}>{request.drop}</Text>
          <TouchableOpacity style={{ backgroundColor: colors.yellow, borderRadius: radius.pill, paddingVertical: 16, alignItems: 'center', marginTop: 16 }} onPress={finish}><Text style={{ fontWeight: '800', fontSize: 15, color: colors.black }}>Complete ride • ₹{request.fare}</Text></TouchableOpacity>
        </>)}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── ADMIN: LOGIN ─────────────────────────────────────────────
function AdminLoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  async function handleLogin() {
    setLoading(true);
    const ok = await adminLogin(email.trim(), password);
    setLoading(false);
    if (ok) { navigation.reset({ index: 0, routes: [{ name: 'AdminDashboard' }] }); }
    else { Alert.alert('Login Failed', 'Invalid credentials. Use admin@hublirider.com / 1234'); }
  }
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }} keyboardShouldPersistTaps="handled">
      <TouchableOpacity style={{ marginBottom: 16, width: 36, height: 36, borderRadius: 10, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.border }} onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={20} color={colors.grey} /></TouchableOpacity>
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: colors.yellow, justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}><Ionicons name="bicycle" size={28} color={colors.black} /></View>
        <Text style={{ fontSize: 26, fontWeight: '900', color: colors.black, letterSpacing: -0.5 }}>Hubli Rider</Text>
        <Text style={{ fontSize: 13, fontWeight: '500', color: colors.grey, marginTop: 4 }}>Admin Console</Text>
      </View>
      <View style={{ backgroundColor: colors.white, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: colors.border }}>
        <Text style={{ fontSize: 20, fontWeight: '800', color: colors.black, marginBottom: 4 }}>Admin Sign In</Text>
        <Text style={{ fontSize: 12, color: colors.grey, marginBottom: 20 }}>Access the Hubli Rider management dashboard</Text>
        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.grey, marginBottom: 6, marginTop: 14, letterSpacing: 0.4 }}>Email address</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.greyBg, borderRadius: radius.sm, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1.5, borderColor: focused === 'email' ? colors.yellow : colors.border }}>
          <Ionicons name="mail-outline" size={16} color={colors.grey} style={{ marginRight: 8 }} />
          <TextInput style={{ flex: 1, color: colors.black, fontSize: 14, fontWeight: '500' }} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="admin@hublirider.com" placeholderTextColor={colors.greyLight} onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} />
        </View>
        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.grey, marginBottom: 6, marginTop: 14, letterSpacing: 0.4 }}>Password</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.greyBg, borderRadius: radius.sm, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1.5, borderColor: focused === 'pass' ? colors.yellow : colors.border }}>
          <Ionicons name="lock-closed-outline" size={16} color={colors.grey} style={{ marginRight: 8 }} />
          <TextInput style={{ flex: 1, color: colors.black, fontSize: 14, fontWeight: '500' }} value={password} onChangeText={setPassword} secureTextEntry={!showPass} placeholder="••••••••" placeholderTextColor={colors.greyLight} onFocus={() => setFocused('pass')} onBlur={() => setFocused(null)} />
          <TouchableOpacity onPress={() => setShowPass(p => !p)}><Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={16} color={colors.grey} /></TouchableOpacity>
        </View>
        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: colors.yellow, borderRadius: radius.pill, paddingVertical: 14, marginTop: 24, opacity: loading ? 0.7 : 1 }} onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
          <Text style={{ fontSize: 15, fontWeight: '800', color: colors.black }}>{loading ? 'Signing in...' : 'Sign in to Console'}</Text>
          {!loading && <Ionicons name="arrow-forward" size={16} color={colors.black} />}
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, justifyContent: 'center', marginTop: 14 }}>
          <Ionicons name="information-circle-outline" size={13} color={colors.grey} />
          <Text style={{ fontSize: 11, color: colors.grey }}>Demo: admin@hublirider.com / 1234</Text>
        </View>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── ADMIN: DASHBOARD ─────────────────────────────────────────
const dashWeekData = [42, 68, 55, 90, 74, 110, 134];
const dashWeekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
function AdminDashboardScreen({ navigation }) {
  const [stats, setStats] = useState({ totalUsers: 0, totalCaptains: 0, onlineCaptains: 0, ridesToday: 0 });
  const [onlineDrivers, setOnlineDrivers] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  useFocusEffect(useCallback(() => {
    adminRequest('/admin/stats').then(setStats).catch(() => {});
    adminRequest('/admin/captains').then(list => {
      setOnlineDrivers(list.filter(d => d.isOnline));
      setPendingCount(list.filter(d => d.status === 'pending').length);
    }).catch(() => {});
  }, []));
  async function handleLogout() { await logout(); navigation.reset({ index: 0, routes: [{ name: 'AdminLogin' }] }); }
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: colors.white, paddingTop: 56, paddingHorizontal: 18, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: colors.yellow, justifyContent: 'center', alignItems: 'center' }}><Ionicons name="bicycle" size={16} color={colors.black} /></View>
              <View><Text style={{ fontSize: 18, fontWeight: '900', color: colors.black }}>Hubli Rider</Text><Text style={{ fontSize: 10, fontWeight: '500', color: colors.grey, marginTop: 1 }}>Admin Console</Text></View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.successBg, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: '#BBF7D0' }}>
              <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success }} />
              <Text style={{ fontSize: 11, fontWeight: '700', color: colors.success }}>Live</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, fontWeight: '500', color: colors.grey, marginBottom: 4 }}>Registered Captains</Text>
              <Text style={{ fontSize: 34, fontWeight: '900', color: colors.black, letterSpacing: -1 }}>{stats.totalCaptains}</Text>
              <View style={{ marginTop: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.successBg, borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-start' }}>
                  <Ionicons name="radio-button-on" size={12} color={colors.success} />
                  <Text style={{ fontSize: 11, fontWeight: '700', color: colors.success }}>{stats.onlineCaptains} online now</Text>
                </View>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 55 }}>
              {[40, 65, 50, 80, 70, 95, 110].map((h, i) => <View key={i} style={{ width: 6, height: h * 0.5, backgroundColor: colors.yellow, borderRadius: 3, opacity: i === 6 ? 1 : 0.35 }} />)}
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 14, gap: 10 }}>
          {[{ label: 'Total Riders', value: stats.totalUsers, icon: 'people', accent: '#3B82F6' }, { label: 'Captains', value: stats.totalCaptains, icon: 'bicycle', accent: colors.bike }, { label: 'Online Now', value: stats.onlineCaptains, icon: 'radio-button-on', accent: colors.success, delta: 'active' }, { label: 'Rides Today', value: stats.ridesToday || '—', icon: 'car', accent: colors.yellow }].map(s => (
            <View key={s.label} style={[{ width: '47%', backgroundColor: colors.white, borderRadius: radius.md, padding: 14, borderWidth: 1, borderColor: colors.border }, shadow.sm]}>
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: s.accent + '22', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}><Ionicons name={s.icon} size={18} color={s.accent} /></View>
              <Text style={{ fontSize: 24, fontWeight: '900', color: colors.black, letterSpacing: -0.5 }}>{s.value}</Text>
              <Text style={{ fontSize: 11, fontWeight: '500', color: colors.grey, marginTop: 2 }}>{s.label}</Text>
              {s.delta && <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 6 }}><Ionicons name="trending-up" size={10} color={colors.success} /><Text style={{ fontSize: 10, fontWeight: '700', color: colors.success }}>{s.delta}</Text></View>}
            </View>
          ))}
        </View>
        <View style={{ paddingHorizontal: 14 }}>
          <View style={{ backgroundColor: colors.white, borderRadius: radius.md, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.charcoal, marginBottom: 14 }}>Rides this week</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 110 }}>
              {dashWeekData.map((val, i) => (
                <View key={i} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
                  <Text style={{ fontSize: 9, fontWeight: '700', color: colors.grey }}>{val}</Text>
                  <View style={{ width: '100%', height: (val / 134) * 80, backgroundColor: i === 6 ? colors.yellow : colors.greyBg, borderRadius: 4, minHeight: 4 }} />
                  <Text style={{ fontSize: 9, fontWeight: '600', color: colors.greyLight }}>{dashWeekLabels[i]}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={{ backgroundColor: colors.white, borderRadius: radius.md, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: colors.border }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: colors.charcoal }}>Online Captains</Text>
              <TouchableOpacity onPress={() => navigation.navigate('DriversList')}><Text style={{ fontSize: 12, fontWeight: '600', color: colors.yellow }}>See all →</Text></TouchableOpacity>
            </View>
            {onlineDrivers.length === 0 ? (
              <Text style={{ color: colors.grey, fontSize: 13, paddingVertical: 8 }}>No captains online</Text>
            ) : onlineDrivers.map(d => (
              <TouchableOpacity key={d.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.border }} onPress={() => navigation.navigate('DriverDetail', { driver: d })} activeOpacity={0.7}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.greyBg, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 14, fontWeight: '800', color: colors.yellow }}>{d.name[0]}</Text></View>
                <View style={{ flex: 1 }}><Text style={{ fontSize: 13, fontWeight: '700', color: colors.black }}>{d.name}</Text><Text style={{ fontSize: 11, fontWeight: '400', color: colors.grey, marginTop: 1 }}>{d.vehicleType || d.vehicle} · {d.vehicleNumber || d.number}</Text></View>
                <View style={{ backgroundColor: colors.successBg, borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 3 }}><Text style={{ fontSize: 12, fontWeight: '700', color: colors.success }}>₹{d.earningsToday || 0}</Text></View>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={{ fontSize: 13, fontWeight: '700', color: colors.charcoal, marginBottom: 10 }}>Manage</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
            {[{ screen: 'UsersList', icon: 'people', label: 'Users', count: `${stats.totalUsers} total`, accent: '#3B82F6' }, { screen: 'DriversList', icon: 'bicycle', label: 'Drivers', count: `${stats.totalCaptains} total`, accent: colors.bike }, { screen: 'PendingCaptains', icon: 'time', label: 'Pending', count: `${pendingCount} pending`, accent: '#CA8A04' }].map(a => (
              <TouchableOpacity key={a.screen} style={[{ flex: 1, backgroundColor: colors.white, borderRadius: radius.md, padding: 16, borderWidth: 1, borderColor: colors.border, gap: 6 }, shadow.card]} onPress={() => navigation.navigate(a.screen)} activeOpacity={0.8}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: a.accent + '22', justifyContent: 'center', alignItems: 'center', marginBottom: 4 }}><Ionicons name={a.icon} size={22} color={a.accent} /></View>
                <Text style={{ fontSize: 15, fontWeight: '800', color: colors.black }}>{a.label}</Text>
                <Text style={{ fontSize: 11, fontWeight: '500', color: colors.grey }}>{a.count}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center', paddingVertical: 14, marginBottom: 8, borderWidth: 1, borderColor: colors.dangerBg, borderRadius: radius.pill, backgroundColor: colors.dangerBg }} onPress={handleLogout} activeOpacity={0.8}>
            <Ionicons name="log-out-outline" size={16} color={colors.danger} />
            <Text style={{ fontSize: 14, fontWeight: '700', color: colors.danger }}>Sign Out</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ─── ADMIN: USERS LIST ────────────────────────────────────────
const AVATAR_COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];
function UsersListScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [allUsers, setAllUsers] = useState([]);
  useFocusEffect(useCallback(() => {
    adminRequest('/admin/users').then(data => setAllUsers(data.map(u => ({ ...u, id: u._id })))).catch(() => {});
  }, []));
  const filtered = useMemo(() => allUsers.filter(u => {
    const matchQ = u.name.toLowerCase().includes(query.toLowerCase()) || u.phone.includes(query);
    const matchF = filter === 'all' || u.status === filter;
    return matchQ && matchF;
  }), [query, filter, allUsers]);
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 56, paddingHorizontal: 18, paddingBottom: 16 }}>
        <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.greyBg, justifyContent: 'center', alignItems: 'center', marginRight: 4 }} onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={20} color={colors.black} /></TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: '900', color: colors.black }}>Users</Text>
        <View style={{ backgroundColor: colors.greyBg, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3 }}><Text style={{ fontSize: 13, fontWeight: '700', color: colors.charcoal }}>{allUsers.length}</Text></View>
      </View>
      <View style={{ paddingHorizontal: 14, marginBottom: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.white, borderRadius: radius.sm, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: colors.border }}>
          <Ionicons name="search" size={16} color="#555" />
          <TextInput style={{ flex: 1, fontSize: 14, color: colors.black }} placeholder="Search name or phone..." placeholderTextColor="#555" value={query} onChangeText={setQuery} />
          {query.length > 0 && <TouchableOpacity onPress={() => setQuery('')}><Ionicons name="close-circle" size={16} color="#555" /></TouchableOpacity>}
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 14, marginBottom: 6 }}>
        {['all', 'active', 'blocked'].map(f => (
          <TouchableOpacity key={f} style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: filter === f ? colors.yellow : colors.white, borderWidth: 1, borderColor: filter === f ? colors.yellow : colors.border }} onPress={() => setFilter(f)}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: filter === f ? colors.black : colors.grey }}>{f.charAt(0).toUpperCase() + f.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList data={filtered} keyExtractor={u => u.id} contentContainerStyle={{ padding: 14, gap: 8 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.white, borderRadius: radius.md, padding: 14, borderWidth: 1, borderColor: colors.border }} onPress={() => navigation.navigate('UserDetail', { user: item })} activeOpacity={0.75}>
            <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length] + '33', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontWeight: '800', fontSize: 14, color: AVATAR_COLORS[index % AVATAR_COLORS.length] }}>{item.name.split(' ').map(n => n[0]).join('')}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: colors.black }}>{item.name}</Text>
              <Text style={{ fontSize: 11, fontWeight: '400', color: colors.grey, marginTop: 2 }}>+91 {item.phone} · {item.rides} rides</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill, backgroundColor: item.status === 'active' ? colors.successBg : colors.dangerBg }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: item.status === 'active' ? colors.success : colors.danger }} />
              <Text style={{ fontSize: 11, fontWeight: '700', color: item.status === 'active' ? colors.success : colors.danger, textTransform: 'capitalize' }}>{item.status}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<View style={{ alignItems: 'center', paddingTop: 60, gap: 10 }}><Ionicons name="search-outline" size={32} color="#333" /><Text style={{ fontSize: 14, color: colors.grey }}>No users found</Text></View>}
      />
    </View>
  );
}

// ─── ADMIN: USER DETAIL ───────────────────────────────────────
function UserDetailScreen({ route, navigation }) {
  const { user } = route.params;
  const [status, setStatus] = useState(user.status);
  const isActive = status === 'active';
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} showsVerticalScrollIndicator={false}>
      <View style={{ backgroundColor: colors.white, paddingTop: 56, paddingBottom: 28, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.greyBg, justifyContent: 'center', alignItems: 'center', marginLeft: 18, marginBottom: 12 }} onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={18} color={colors.black} /></TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
        <View style={{ position: 'relative', marginBottom: 12 }}>
          <View style={{ width: 76, height: 76, borderRadius: 38, backgroundColor: '#3B82F633', justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 26, fontWeight: '900', color: '#3B82F6' }}>{user.name.split(' ').map(n => n[0]).join('')}</Text></View>
          <View style={{ position: 'absolute', borderRadius: 42, borderWidth: 2.5, width: 82, height: 82, top: -3, left: -3, borderColor: isActive ? colors.success : colors.danger }} />
        </View>
        <Text style={{ fontSize: 20, fontWeight: '800', color: colors.black, marginBottom: 4 }}>{user.name}</Text>
        <Text style={{ fontSize: 13, color: colors.grey, marginBottom: 12 }}>+91 {user.phone}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, backgroundColor: isActive ? '#0D2A1A' : '#2A0D0D', borderColor: isActive ? '#1E3A1E' : '#3A1E1E' }}>
          <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: isActive ? colors.success : colors.danger }} />
          <Text style={{ fontSize: 12, fontWeight: '700', color: isActive ? colors.success : colors.danger }}>{status.charAt(0).toUpperCase() + status.slice(1)}</Text>
        </View>
        </View>
      </View>
      <View style={{ flexDirection: 'row', padding: 14, gap: 10 }}>
        {[{ label: 'Total Rides', value: user.rides, icon: 'car-outline', color: '#3B82F6' }, { label: 'Rating', value: `${user.rating}★`, icon: 'star-outline', color: colors.yellow }, { label: 'Member Since', value: user.joined.split('-')[0], icon: 'calendar-outline', color: colors.bike }].map(s => (
          <View key={s.label} style={{ flex: 1, backgroundColor: colors.white, borderRadius: radius.md, padding: 12, alignItems: 'center', gap: 6, borderWidth: 1, borderColor: colors.border }}>
            <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: s.color + '22', justifyContent: 'center', alignItems: 'center' }}><Ionicons name={s.icon} size={16} color={s.color} /></View>
            <Text style={{ fontSize: 16, fontWeight: '800', color: colors.black }}>{s.value}</Text>
            <Text style={{ fontSize: 10, fontWeight: '500', color: colors.grey, textAlign: 'center' }}>{s.label}</Text>
          </View>
        ))}
      </View>
      <View style={{ backgroundColor: colors.white, marginHorizontal: 14, borderRadius: radius.md, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border }}>
        <Text style={{ fontSize: 12, fontWeight: '700', color: colors.grey, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 14 }}>Account Details</Text>
        {[{ label: 'Full Name', value: user.name, icon: 'person-outline' }, { label: 'Phone', value: `+91 ${user.phone}`, icon: 'call-outline' }, { label: 'Joined', value: user.joined, icon: 'calendar-outline' }, { label: 'Total Rides', value: `${user.rides} rides completed`, icon: 'car-outline' }].map(row => (
          <View key={row.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border }}>
            <View style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: colors.greyBg, justifyContent: 'center', alignItems: 'center' }}><Ionicons name={row.icon} size={14} color="#666" /></View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 10, fontWeight: '600', color: colors.grey, marginBottom: 2 }}>{row.label}</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.black }}>{row.value}</Text>
            </View>
          </View>
        ))}
      </View>
      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginHorizontal: 14, marginTop: 4, paddingVertical: 15, borderRadius: radius.pill, borderWidth: 1, backgroundColor: isActive ? '#2A0D0D' : '#0D2A1A', borderColor: isActive ? '#3A1E1E' : '#1E3A1E' }} onPress={() => adminRequest('/admin/users/'+(user._id||user.id)+'/toggle-block',{method:'PATCH'}).then(u=>setStatus(u.status)).catch(()=>Alert.alert('Error','Failed'))} activeOpacity={0.8}>
        <Ionicons name={isActive ? 'ban-outline' : 'checkmark-circle-outline'} size={20} color={isActive ? colors.danger : colors.success} />
        <Text style={{ fontSize: 15, fontWeight: '800', color: isActive ? colors.danger : colors.success }}>{isActive ? 'Block this user' : 'Unblock this user'}</Text>
      </TouchableOpacity>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

// ─── ADMIN: DRIVERS LIST ──────────────────────────────────────
function DriversListScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [allDrivers, setAllDrivers] = useState([]);
  useFocusEffect(useCallback(() => {
    adminRequest('/admin/captains').then(data => setAllDrivers(data.map(d => ({ ...d, id: d._id })))).catch(() => {});
  }, []));
  const filtered = useMemo(() => allDrivers.filter(d => {
    const matchQ = (d.name || '').toLowerCase().includes(query.toLowerCase()) || (d.vehicleNumber || d.number || '').toLowerCase().includes(query.toLowerCase());
    const matchF = filter === 'all' || d.status === filter;
    return matchQ && matchF;
  }), [query, filter, allDrivers]);
  const onlineCount = allDrivers.filter(d => d.status === 'online').length;
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: 56, paddingHorizontal: 18, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.greyBg, justifyContent: 'center', alignItems: 'center', marginRight: 4 }} onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={20} color={colors.black} /></TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: '900', color: colors.black }}>Captains</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.successBg, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: '#BBF7D0' }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success }} />
            <Text style={{ fontSize: 11, fontWeight: '700', color: colors.success }}>{onlineCount} online</Text>
          </View>
        </View>
        <Text style={{ fontSize: 12, color: colors.grey }}>{allDrivers.length} total captains registered</Text>
      </View>
      <View style={{ paddingHorizontal: 14, marginBottom: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.white, borderRadius: radius.sm, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: colors.border }}>
          <Ionicons name="search" size={16} color="#555" />
          <TextInput style={{ flex: 1, fontSize: 14, color: colors.black }} placeholder="Search name or vehicle number..." placeholderTextColor="#555" value={query} onChangeText={setQuery} />
          {query.length > 0 && <TouchableOpacity onPress={() => setQuery('')}><Ionicons name="close-circle" size={16} color="#555" /></TouchableOpacity>}
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 14, marginBottom: 6 }}>
        {['all', 'online', 'offline'].map(f => (
          <TouchableOpacity key={f} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: filter === f ? colors.yellow : colors.white, borderWidth: 1, borderColor: filter === f ? colors.yellow : colors.border }} onPress={() => setFilter(f)}>
            {f === 'online' && <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success }} />}
            {f === 'offline' && <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#444' }} />}
            <Text style={{ fontSize: 12, fontWeight: '600', color: filter === f ? colors.black : colors.grey }}>{f.charAt(0).toUpperCase() + f.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList data={filtered} keyExtractor={d => d.id} contentContainerStyle={{ padding: 14, gap: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.white, borderRadius: radius.md, padding: 14, borderWidth: 1, borderColor: colors.border }} onPress={() => navigation.navigate('DriverDetail', { driver: item })} activeOpacity={0.75}>
            <View style={{ position: 'relative' }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFC40022', justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontWeight: '800', fontSize: 14, color: colors.yellow }}>{item.name.split(' ').map(n => n[0]).join('')}</Text></View>
              <View style={{ width: 11, height: 11, borderRadius: 6, borderWidth: 2, borderColor: colors.bg, position: 'absolute', bottom: -1, right: -1, backgroundColor: item.status === 'online' ? colors.success : '#333' }} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: colors.black }}>{item.name}</Text>
              <Text style={{ fontSize: 11, color: colors.grey, marginTop: 2 }}>{item.vehicle} · {item.number}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 }}>
                <Ionicons name="star" size={10} color={colors.yellow} />
                <Text style={{ fontSize: 11, color: colors.grey }}>{item.rating} · {item.rides} rides</Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 15, fontWeight: '800', color: item.earningsToday > 0 ? colors.yellow : colors.greyLight }}>{item.earningsToday > 0 ? `₹${item.earningsToday}` : '—'}</Text>
              <Text style={{ fontSize: 10, color: colors.grey, marginTop: 2 }}>today</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<View style={{ alignItems: 'center', paddingTop: 60, gap: 10 }}><Ionicons name="bicycle-outline" size={32} color="#333" /><Text style={{ fontSize: 14, color: colors.grey }}>No captains found</Text></View>}
      />
    </View>
  );
}

// ─── ADMIN: DRIVER DETAIL ─────────────────────────────────────
const driverWeekEarnings = [420, 680, 550, 900, 740, 860, 1120];
const driverWeekLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
function DriverDetailScreen({ route, navigation }) {
  const { driver } = route.params;
  const [status, setStatus] = useState(driver.status);
  const isOnline = status === 'online';
  const isSuspended = status === 'suspended';
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} showsVerticalScrollIndicator={false}>
      <View style={{ backgroundColor: colors.white, paddingTop: 56, paddingBottom: 28, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.greyBg, justifyContent: 'center', alignItems: 'center', marginLeft: 18, marginBottom: 12 }} onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={18} color={colors.black} /></TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
        <View style={{ position: 'relative', marginBottom: 12 }}>
          <View style={{ width: 76, height: 76, borderRadius: 38, backgroundColor: '#FFC40022', justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 26, fontWeight: '900', color: colors.yellow }}>{driver.name.split(' ').map(n => n[0]).join('')}</Text></View>
          <View style={{ position: 'absolute', borderRadius: 42, borderWidth: 2.5, width: 82, height: 82, top: -3, left: -3, borderColor: isOnline ? colors.success : isSuspended ? colors.danger : '#333' }} />
        </View>
        <Text style={{ fontSize: 20, fontWeight: '800', color: colors.black, marginBottom: 4 }}>{driver.name}</Text>
        <Text style={{ fontSize: 13, color: colors.grey, marginBottom: 12 }}>{driver.vehicle} · {driver.number}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, backgroundColor: isOnline ? '#0D2A1A' : isSuspended ? '#2A0D0D' : '#1A1A1A', borderColor: isOnline ? '#1E3A1E' : isSuspended ? '#3A1E1E' : '#2A2A2A' }}>
          <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: isOnline ? colors.success : isSuspended ? colors.danger : '#555' }} />
          <Text style={{ fontSize: 12, fontWeight: '700', color: isOnline ? colors.success : isSuspended ? colors.danger : '#888' }}>{status.charAt(0).toUpperCase() + status.slice(1)}</Text>
        </View>
        </View>
      </View>
      <View style={{ flexDirection: 'row', padding: 14, gap: 10 }}>
        {[{ label: 'Total Rides', value: driver.rides.toLocaleString('en-IN'), icon: 'car-outline', color: '#3B82F6' }, { label: 'Rating', value: `${driver.rating}★`, icon: 'star-outline', color: colors.yellow }, { label: 'Today', value: `₹${driver.earningsToday}`, icon: 'wallet-outline', color: colors.success }].map(s => (
          <View key={s.label} style={{ flex: 1, backgroundColor: colors.white, borderRadius: radius.md, padding: 12, alignItems: 'center', gap: 6, borderWidth: 1, borderColor: colors.border }}>
            <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: s.color + '22', justifyContent: 'center', alignItems: 'center' }}><Ionicons name={s.icon} size={16} color={s.color} /></View>
            <Text style={{ fontSize: 15, fontWeight: '800', color: colors.black }}>{s.value}</Text>
            <Text style={{ fontSize: 10, fontWeight: '500', color: colors.grey, textAlign: 'center' }}>{s.label}</Text>
          </View>
        ))}
      </View>
      <View style={{ backgroundColor: colors.white, marginHorizontal: 14, borderRadius: radius.md, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border }}>
        <Text style={{ fontSize: 12, fontWeight: '700', color: colors.grey, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 14 }}>Weekly Earnings</Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 100, marginBottom: 12 }}>
          {driverWeekEarnings.map((val, i) => (
            <View key={i} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 8, fontWeight: '700', color: colors.grey }}>₹{val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val}</Text>
              <View style={{ width: '100%', height: (val / 1120) * 70, backgroundColor: i === 6 ? colors.yellow : colors.greyBg, borderRadius: 4, minHeight: 4 }} />
              <Text style={{ fontSize: 9, fontWeight: '600', color: colors.grey }}>{driverWeekLabels[i]}</Text>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: colors.grey }}>Week total</Text>
          <Text style={{ fontSize: 18, fontWeight: '900', color: colors.yellow }}>₹{driverWeekEarnings.reduce((a, b) => a + b, 0).toLocaleString('en-IN')}</Text>
        </View>
      </View>
      <View style={{ backgroundColor: colors.white, marginHorizontal: 14, borderRadius: radius.md, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border }}>
        <Text style={{ fontSize: 12, fontWeight: '700', color: colors.grey, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 14 }}>Captain Details</Text>
        {[{ label: 'Full Name', value: driver.name, icon: 'person-outline' }, { label: 'Phone', value: `+91 ${driver.phone}`, icon: 'call-outline' }, { label: 'Vehicle Type', value: driver.vehicle, icon: 'bicycle-outline' }, { label: 'Vehicle Number', value: driver.number, icon: 'card-outline' }, { label: 'Total Rides', value: `${driver.rides} completed`, icon: 'checkmark-circle-outline' }].map(row => (
          <View key={row.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border }}>
            <View style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: colors.greyBg, justifyContent: 'center', alignItems: 'center' }}><Ionicons name={row.icon} size={14} color="#666" /></View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 10, fontWeight: '600', color: colors.grey, marginBottom: 2 }}>{row.label}</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.black }}>{row.value}</Text>
            </View>
          </View>
        ))}
      </View>
      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginHorizontal: 14, marginTop: 4, paddingVertical: 15, borderRadius: radius.pill, borderWidth: 1, backgroundColor: isSuspended ? '#0D2A1A' : '#2A0D0D', borderColor: isSuspended ? '#1E3A1E' : '#3A1E1E' }} onPress={() => adminRequest('/admin/captains/'+(driver._id||driver.id)+'/toggle-suspend',{method:'PATCH'}).then(u=>setStatus(u.status)).catch(()=>Alert.alert('Error','Failed'))} activeOpacity={0.8}>
        <Ionicons name={isSuspended ? 'checkmark-circle-outline' : 'ban-outline'} size={20} color={isSuspended ? colors.success : colors.danger} />
        <Text style={{ fontSize: 15, fontWeight: '800', color: isSuspended ? colors.success : colors.danger }}>{isSuspended ? 'Reactivate captain' : 'Suspend captain'}</Text>
      </TouchableOpacity>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

// ─── ADMIN: PENDING CAPTAINS ──────────────────────────────────
const STATUS_COLORS = {
  pending: { bg: '#FEF9C3', text: '#92400E', dot: '#CA8A04' },
  approved: { bg: colors.successBg, text: colors.success, dot: colors.success },
  rejected: { bg: colors.dangerBg, text: colors.danger, dot: colors.danger },
};
function PendingCaptainsScreen({ navigation }) {
  const [captains, setCaptains] = useState([]);
  useFocusEffect(useCallback(() => { adminRequest('/admin/captains').then(data=>setCaptains(data.map(c=>({...c,id:c._id})))).catch(()=>{}); }, []));
  async function handleAction(id, action) {
    Alert.alert(
      action === 'approved' ? 'Approve Captain' : 'Reject Captain',
      `Are you sure you want to ${action === 'approved' ? 'approve' : 'reject'} this captain?`,
      [{ text: 'Cancel', style: 'cancel' }, { text: action === 'approved' ? 'Approve' : 'Reject', style: action === 'rejected' ? 'destructive' : 'default', onPress: async () => { adminRequest('/admin/captains/'+id+(action==='approved'?'/approve':'/reject'),{method:'PATCH'}).then(()=>setCaptains(prev=>prev.map(c=>c.id===id?{...c,status:action==='approved'?'active':'suspended'}:c))).catch(()=>Alert.alert('Error','Failed')); } }]
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: colors.white, paddingTop: 56, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 14, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.greyBg, justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={20} color={colors.black} /></TouchableOpacity>
        <View>
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.black }}>Captain Approvals</Text>
          <Text style={{ fontSize: 12, color: colors.grey, marginTop: 2 }}>{captains.filter(c => c.status === 'pending').length} pending review</Text>
        </View>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
        {captains.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 80, gap: 12 }}>
            <Ionicons name="bicycle-outline" size={48} color={colors.greyLight} />
            <Text style={{ fontSize: 14, color: colors.greyLight, fontWeight: '500' }}>No captain registrations yet</Text>
          </View>
        ) : captains.map(c => {
          const sc = STATUS_COLORS[c.status] || STATUS_COLORS.pending;
          return (
            <View key={c.id} style={[{ backgroundColor: colors.white, borderRadius: radius.lg, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: colors.border }, shadow.sm]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.yellowLight, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 18, fontWeight: '800', color: colors.black }}>{c.name?.[0] || '?'}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: colors.black }}>{c.name}</Text>
                  <Text style={{ fontSize: 12, color: colors.grey, marginTop: 2 }}>{c.phone}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: sc.bg }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: sc.dot }} />
                  <Text style={{ fontSize: 11, fontWeight: '700', color: sc.text, textTransform: 'capitalize' }}>{c.status}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12, marginBottom: 12 }}>
                {[['Email', c.email], ['Licence', c.licenceNumber], ['Aadhaar', c.aadhaarNumber ? `****${c.aadhaarNumber.slice(-4)}` : '-'], ['Vehicle No.', c.vehicleNumber], ['Vehicle Type', c.vehicleType], ['City', c.city]].map(([label, value]) => (
                  <View key={label} style={{ width: '50%', paddingVertical: 4, paddingRight: 8 }}>
                    <Text style={{ fontSize: 10, fontWeight: '600', color: colors.greyLight, letterSpacing: 0.4, textTransform: 'uppercase' }}>{label}</Text>
                    <Text style={{ fontSize: 13, fontWeight: '500', color: colors.black, marginTop: 1 }} numberOfLines={1}>{value || '-'}</Text>
                  </View>
                ))}
              </View>
              {c.status === 'pending' && (
                <View style={{ flexDirection: 'row', gap: 10, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 }}>
                  <TouchableOpacity style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, borderRadius: radius.pill, paddingVertical: 10, backgroundColor: colors.dangerBg, borderWidth: 1, borderColor: '#FECACA' }} onPress={() => handleAction(c.id, 'rejected')} activeOpacity={0.8}>
                    <Ionicons name="close" size={16} color={colors.danger} />
                    <Text style={{ fontSize: 14, fontWeight: '700', color: colors.danger }}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, borderRadius: radius.pill, paddingVertical: 10, backgroundColor: colors.yellow }} onPress={() => handleAction(c.id, 'approved')} activeOpacity={0.8}>
                    <Ionicons name="checkmark" size={16} color={colors.black} />
                    <Text style={{ fontSize: 14, fontWeight: '700', color: colors.black }}>Approve</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

// ─── NAVIGATORS ───────────────────────────────────────────────
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function UserTabs() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: colors.black,
      tabBarInactiveTintColor: colors.greyLight,
      tabBarStyle: { height: 62, paddingBottom: 8, paddingTop: 6 },
      tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
      tabBarIcon: ({ color, size }) => {
        const icons = { Home: 'bicycle', Rides: 'time', Profile: 'person' };
        return <Ionicons name={icons[route.name]} size={size - 2} color={color} />;
      },
    })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Rides" component={RideHistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function UserNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserHome" component={UserTabs} />
      <Stack.Screen name="Finding" component={FindingDriverScreen} />
      <Stack.Screen name="Tracking" component={RideTrackingScreen} />
    </Stack.Navigator>
  );
}

function DriverTabs() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: colors.black,
      tabBarInactiveTintColor: colors.greyLight,
      tabBarStyle: { height: 62, paddingBottom: 8, paddingTop: 6 },
      tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
      tabBarIcon: ({ color, size }) => {
        const icons = { Rides: 'bicycle', Earnings: 'wallet' };
        return <Ionicons name={icons[route.name]} size={size - 2} color={color} />;
      },
    })}>
      <Tab.Screen name="Rides" component={DriverHomeScreen} />
      <Tab.Screen name="Earnings" component={DriverEarningsScreen} />
    </Tab.Navigator>
  );
}

function DriverNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DriverHome" component={DriverTabs} />
      <Stack.Screen name="IncomingRide" component={IncomingRideScreen} />
      <Stack.Screen name="ActiveRide" component={ActiveRideScreen} />
    </Stack.Navigator>
  );
}

function AdminNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="UsersList" component={UsersListScreen} />
      <Stack.Screen name="UserDetail" component={UserDetailScreen} />
      <Stack.Screen name="DriversList" component={DriversListScreen} />
      <Stack.Screen name="DriverDetail" component={DriverDetailScreen} />
      <Stack.Screen name="PendingCaptains" component={PendingCaptainsScreen} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="RegisterUser" component={RegisterUserScreen} />
        <Stack.Screen name="RegisterCaptain" component={RegisterCaptainScreen} />
        <Stack.Screen name="OtpVerify" component={OtpVerifyScreen} />
        <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
        <Stack.Screen name="CaptainPending" component={CaptainPendingScreen} />
        <Stack.Screen name="User" component={UserNavigator} />
        <Stack.Screen name="Driver" component={DriverNavigator} />
        <Stack.Screen name="Admin" component={AdminNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ─── ERROR BOUNDARY ──────────────────────────────────────────
class ErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error('[ErrorBoundary]', error, info); }
  render() {
    if (this.state.error) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#DC2626', marginBottom: 12 }}>Something went wrong</Text>
          <Text style={{ fontSize: 13, color: '#555', textAlign: 'center', marginBottom: 16 }}>{this.state.error?.message}</Text>
          <Text style={{ fontSize: 11, color: '#999', textAlign: 'center' }}>Check the console/terminal for details</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

// ─── APP ENTRY ────────────────────────────────────────────────
export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ExpoStatusBar style="dark" />
        <RootNavigator />
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
