import AsyncStorage from '@react-native-async-storage/async-storage';

// Set to your backend URL:
// - Web/browser: 'http://localhost:3000'
// - Android emulator: 'http://10.0.2.2:3000'
// - Physical device: 'http://<YOUR_LAN_IP>:3000'
export const BASE_URL = 'http://192.168.0.109:3000';

async function getToken() {
  try { return await AsyncStorage.getItem('hr_token'); } catch { return null; }
}

async function saveToken(token) {
  try { await AsyncStorage.setItem('hr_token', token); } catch {}
}

export async function removeToken() {
  try { await AsyncStorage.removeItem('hr_token'); } catch {}
}

async function request(path, options = {}) {
  const token = await getToken();
  const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// Auth
export const sendOtp     = (phone)              => request('/auth/send-otp',        { method: 'POST', body: JSON.stringify({ phone }) });
export const verifyOtp   = (phone, code)        => request('/auth/verify-otp',      { method: 'POST', body: JSON.stringify({ phone, code }) });
export const registerUser = (name, phone, email) => request('/auth/user/register',  { method: 'POST', body: JSON.stringify({ name, phone, email }) });
export const loginUser   = (phone)              => request('/auth/user/login',       { method: 'POST', body: JSON.stringify({ phone }) });
export const adminLogin  = (email, password)    => request('/auth/admin/login',      { method: 'POST', body: JSON.stringify({ email, password }) });

// Save token + user after login/register
export async function saveSession(token, user) {
  await saveToken(token);
  try { await AsyncStorage.setItem('hr_currentUser', JSON.stringify(user)); } catch {}
}

// Profile
export const getProfile    = ()           => request('/auth/me');
export const updateProfile = (data)       => request('/auth/me', { method: 'PATCH', body: JSON.stringify(data) });

// Admin
export const adminGetStats = ()       => request('/admin/stats');
export const adminGetUsers   = (search) => request(`/admin/users${search ? `?search=${encodeURIComponent(search)}` : ''}`);
export const adminGetDrivers = ()       => request('/admin/drivers');
export const adminGetUserRides = (userId) => request(`/admin/users/${userId}/rides`);
