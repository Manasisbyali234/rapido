require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Captain = require('./models/Captain');

const users = [
  { name: 'Ananya Rao',    phone: '9876543210', email: 'ananya@example.com',  role: 'user',    status: 'active',  rides: 34, rating: 4.8 },
  { name: 'Rohit Sharma',  phone: '9823456712', email: 'rohit@example.com',   role: 'user',    status: 'active',  rides: 12, rating: 4.6 },
  { name: 'Priya Menon',   phone: '9765432109', email: 'priya@example.com',   role: 'user',    status: 'active',  rides: 58, rating: 4.9 },
  { name: 'Vikram Singh',  phone: '9012345678', email: 'vikram@example.com',  role: 'user',    status: 'blocked', rides: 3,  rating: 4.2 },
  { name: 'Fatima Sheikh', phone: '9988776655', email: 'fatima@example.com',  role: 'user',    status: 'active',  rides: 21, rating: 4.7 },
];

const captains = [
  { name: 'Suresh Kumar', phone: '9111122223', vehicle: 'Bike',        vehicleNumber: 'KA05 AB 1234', rides: 1204, rating: 4.9, isOnline: true,  status: 'online',   earningsToday: 860  },
  { name: 'Manoj Patil',  phone: '9222233334', vehicle: 'Auto',        vehicleNumber: 'KA01 CD 5678', rides: 980,  rating: 4.7, isOnline: true,  status: 'online',   earningsToday: 640  },
  { name: 'Ramesh Gowda', phone: '9333344445', vehicle: 'Cab Economy', vehicleNumber: 'KA03 EF 9012', rides: 2100, rating: 4.8, isOnline: false, status: 'offline',  earningsToday: 0    },
  { name: 'Iqbal Ahmed',  phone: '9444455556', vehicle: 'Cab Premium', vehicleNumber: 'KA02 GH 3456', rides: 1560, rating: 4.9, isOnline: true,  status: 'online',   earningsToday: 1120 },
  { name: 'Deepak Nair',  phone: '9555566667', vehicle: 'Bike',        vehicleNumber: 'KA07 IJ 7890', rides: 430,  rating: 4.5, isOnline: false, status: 'offline',  earningsToday: 0    },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await User.deleteMany({});
  await Captain.deleteMany({});
  await User.insertMany(users);
  await Captain.insertMany(captains);
  console.log('Seeded users and captains');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
