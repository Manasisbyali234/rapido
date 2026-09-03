// ---- Dummy in-memory "backend" for demo purposes ----

export const rideTypes = [
  {
    id: 'bike',
    label: 'Bike',
    icon: '🏍️',
    ionicon: 'bicycle',
    eta: '2 min',
    price: 42,
    desc: 'Quick & affordable',
  },
  {
    id: 'auto',
    label: 'Auto',
    icon: '🛺',
    ionicon: 'car-sport',
    eta: '4 min',
    price: 68,
    desc: 'Comfortable 3-wheeler',
  },
  {
    id: 'cab',
    label: 'Cab Economy',
    icon: '🚗',
    ionicon: 'car',
    eta: '6 min',
    price: 145,
    desc: 'AC cab, up to 4 seats',
  },
  {
    id: 'cabpremium',
    label: 'Cab Premium',
    icon: '🚙',
    ionicon: 'car-outline',
    eta: '8 min',
    price: 210,
    desc: 'Sedan, top rated drivers',
  },
];

export let users = [
  { id: 'u1', name: 'Ananya Rao', phone: '9876543210', rides: 34, rating: 4.8, joined: '2023-04-12', status: 'active' },
  { id: 'u2', name: 'Rohit Sharma', phone: '9823456712', rides: 12, rating: 4.6, joined: '2024-01-02', status: 'active' },
  { id: 'u3', name: 'Priya Menon', phone: '9765432109', rides: 58, rating: 4.9, joined: '2022-11-20', status: 'active' },
  { id: 'u4', name: 'Vikram Singh', phone: '9012345678', rides: 3, rating: 4.2, joined: '2024-06-15', status: 'blocked' },
  { id: 'u5', name: 'Fatima Sheikh', phone: '9988776655', rides: 21, rating: 4.7, joined: '2023-09-08', status: 'active' },
];

export let drivers = [
  { id: 'd1', name: 'Suresh Kumar', phone: '9111122223', vehicle: 'Bike', number: 'KA05 AB 1234', rides: 1204, rating: 4.9, status: 'online', earningsToday: 860 },
  { id: 'd2', name: 'Manoj Patil', phone: '9222233334', vehicle: 'Auto', number: 'KA01 CD 5678', rides: 980, rating: 4.7, status: 'online', earningsToday: 640 },
  { id: 'd3', name: 'Ramesh Gowda', phone: '9333344445', vehicle: 'Cab Economy', number: 'KA03 EF 9012', rides: 2100, rating: 4.8, status: 'offline', earningsToday: 0 },
  { id: 'd4', name: 'Iqbal Ahmed', phone: '9444455556', vehicle: 'Cab Premium', number: 'KA02 GH 3456', rides: 1560, rating: 4.9, status: 'online', earningsToday: 1120 },
  { id: 'd5', name: 'Deepak Nair', phone: '9555566667', vehicle: 'Bike', number: 'KA07 IJ 7890', rides: 430, rating: 4.5, status: 'offline', earningsToday: 0 },
];

export const dummyRideRequests = [
  {
    id: 'r1',
    riderName: 'Ananya Rao',
    riderRating: 4.8,
    pickup: 'Koramangala 5th Block',
    drop: 'Indiranagar 100ft Road',
    distance: '5.2 km',
    fare: 68,
    rideType: 'Auto',
    eta: '3 min away',
  },
  {
    id: 'r2',
    riderName: 'Rohit Sharma',
    riderRating: 4.6,
    pickup: 'HSR Layout Sector 2',
    drop: 'Electronic City Phase 1',
    distance: '11.8 km',
    fare: 210,
    rideType: 'Cab Economy',
    eta: '6 min away',
  },
  {
    id: 'r3',
    riderName: 'Fatima Sheikh',
    riderRating: 4.7,
    pickup: 'MG Road Metro',
    drop: 'Whitefield ITPL',
    distance: '17.4 km',
    fare: 320,
    rideType: 'Cab Premium',
    eta: '9 min away',
  },
];

export const adminStats = () => ({
  totalUsers: users.length,
  totalDrivers: drivers.length,
  onlineDrivers: drivers.filter(d => d.status === 'online').length,
  ridesToday: 1342,
  revenueToday: 186420,
});
