import AsyncStorage from '@react-native-async-storage/async-storage';

const K = {
  currentUser: 'hr_currentUser',
  users: 'hr_users',
  captains: 'hr_captains',
  adminAuth: 'hr_adminAuth',
};

async function get(key) {
  try { const v = await AsyncStorage.getItem(key); return v ? JSON.parse(v) : null; }
  catch { return null; }
}
async function save(key, val) {
  try { await AsyncStorage.setItem(key, JSON.stringify(val)); } catch { /* web fallback */ }
}

// OTP — kept in memory so it works reliably on both web and native
const _otpStore = {};

export function generateOtp(phone) {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  _otpStore[phone] = code;
  return Promise.resolve(code);
}

export function verifyOtp(phone, code) {
  // Accept any 6-digit code for demo; also accept the generated code
  return Promise.resolve(code.length === 6 || _otpStore[phone] === code);
}

// Users
export async function getUsers() { return (await get(K.users)) || []; }

export async function getAllUsers() {
  const { users: dummyUsers } = require('../data/dummyData');
  const registered = await getUsers();
  // Merge: registered users take precedence; skip dummies whose phone matches a real user
  const registeredPhones = new Set(registered.map(u => u.phone));
  const merged = [...dummyUsers.filter(u => !registeredPhones.has(u.phone)), ...registered];
  return merged;
}

export async function registerUser({ name, email, phone }) {
  const list = await getUsers();
  if (list.find(u => u.phone === phone))
    return { error: 'This mobile number is already registered. Please login.' };
  const user = { id: Date.now().toString(), name, email, phone, role: 'user', createdAt: new Date().toISOString() };
  await save(K.users, [...list, user]);
  await save(K.currentUser, user);
  return { user };
}

export async function loginUser(phone) {
  const list = await getUsers();
  const user = list.find(u => u.phone === phone);
  if (!user) return { error: 'No account found. Please register first.' };
  await save(K.currentUser, user);
  return { user };
}

// Captains
export async function getCaptains() { return (await get(K.captains)) || []; }

export async function registerCaptain(data) {
  const list = await getCaptains();
  if (list.find(c => c.phone === data.phone))
    return { error: 'This mobile number is already registered. Please login.' };
  const captain = { ...data, id: Date.now().toString(), role: 'captain', status: 'pending', createdAt: new Date().toISOString() };
  await save(K.captains, [...list, captain]);
  await save(K.currentUser, captain);
  return { captain };
}

export async function loginCaptain(phone) {
  const list = await getCaptains();
  const captain = list.find(c => c.phone === phone);
  if (!captain) return { error: 'No captain account found. Please register.' };
  // Always save the latest captain data (reflects approval status changes)
  await save(K.currentUser, captain);
  return { captain };
}

export async function updateCaptainStatus(id, status) {
  const list = await getCaptains();
  const updated = list.map(c => c.id === id ? { ...c, status } : c);
  await save(K.captains, updated);
  // If this captain is the current user, update their session too
  const current = await get(K.currentUser);
  if (current && current.id === id) {
    await save(K.currentUser, { ...current, status });
  }
}

// Session
export async function getCurrentUser() { return get(K.currentUser); }
export async function logout() {
  try { await AsyncStorage.removeItem(K.currentUser); } catch {}
  try { await AsyncStorage.removeItem(K.adminAuth); } catch {}
  try { await AsyncStorage.removeItem('hr_token'); } catch {}
  try { await AsyncStorage.removeItem('hr_currentUser'); } catch {}
}

// Admin
export async function adminLogin(email, password) {
  if (email.trim() === 'admin@hublirider.com' && password === '1234') {
    await save(K.adminAuth, { loggedIn: true, email: email.trim(), name: 'Admin' });
    return true;
  }
  return false;
}
export async function getAdminUser() { return get(K.adminAuth); }
export async function isAdminLoggedIn() { const v = await get(K.adminAuth); return v === true || (v && v.loggedIn === true); }
