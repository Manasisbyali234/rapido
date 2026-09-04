import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export const BASE_URL = Platform.OS === 'web'
  ? 'http://localhost:3000'
  : 'http://192.168.68.119:3000';

// In-memory cache — set on login, restored from storage on first request
let _token = null;

async function getToken() {
  if (_token) return _token;
  try {
    const stored = await AsyncStorage.getItem('hr_token');
    if (stored) _token = stored;
    return _token;
  } catch {
    return null;
  }
}

async function saveToken(token) {
  _token = token;
  try { await AsyncStorage.setItem('hr_token', token); } catch {}
}

export async function removeToken() {
  _token = null;
  try {
    await AsyncStorage.removeItem('hr_token');
    await AsyncStorage.removeItem('hr_adminAuth');
  } catch {}
}

async function request(path, options = {}) {
  const token = await getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(`${BASE_URL}${path}`, { ...options, headers, signal: controller.signal });
    clearTimeout(timeout);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  } catch (e) {
    clearTimeout(timeout);
    console.warn(`[API] ${path} failed:`, e.message);
    throw e;
  }
}

// Auth
export const sendOtp      = (phone)             => request('/auth/send-otp',      { method: 'POST', body: JSON.stringify({ phone }) });
export const verifyOtp    = (phone, code)        => request('/auth/verify-otp',    { method: 'POST', body: JSON.stringify({ phone, code }) });
export const registerUser = (name, phone, email) => request('/auth/user/register', { method: 'POST', body: JSON.stringify({ name, phone, email }) });
export const loginUser    = (phone)              => request('/auth/user/login',     { method: 'POST', body: JSON.stringify({ phone }) });

// Admin login — saves JWT into memory + storage
export async function adminLogin(email, password) {
  // Login request has no token yet — send directly
  const res = await fetch(`${BASE_URL}/auth/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  await saveToken(data.token);
  await AsyncStorage.setItem('hr_adminAuth', JSON.stringify({ loggedIn: true, email, name: 'Admin' }));
  return data;
}

export async function saveSession(token, user) {
  await saveToken(token);
  try { await AsyncStorage.setItem('hr_currentUser', JSON.stringify(user)); } catch {}
}

export const getProfile    = () => request('/auth/me');
export const updateProfile = (data) => request('/auth/me', { method: 'PATCH', body: JSON.stringify(data) });

// Admin — all read from MongoDB via backend
export const adminGetStats        = ()                  => request('/admin/stats');
export const adminGetUsers        = (search)            => request(`/admin/users${search ? `?search=${encodeURIComponent(search)}` : ''}`);
export const adminGetDrivers      = ()                  => request('/admin/captains');
export const adminGetUserRides    = (userId)            => request(`/admin/users/${userId}/rides`);
export const adminToggleUserBlock = (userId)            => request(`/admin/users/${userId}/toggle-block`,         { method: 'PATCH' });
export const adminToggleSuspend   = (captainId)         => request(`/admin/captains/${captainId}/toggle-suspend`, { method: 'PATCH' });
export const adminCaptainAction   = (captainId, action) => request(`/admin/captains/${captainId}/${action}`,      { method: 'PATCH' });
