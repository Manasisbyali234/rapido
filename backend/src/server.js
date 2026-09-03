require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const connectDB    = require('../config/db');
const authRoutes   = require('./routes/auth');
const rideRoutes   = require('./routes/rides');
const captainRoutes = require('./routes/captains');
const adminRoutes  = require('./routes/admin');
const initSocket   = require('./socket');
const initDb       = require('./config/initDb');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.set('io', io);

app.use('/auth',     authRoutes);
app.use('/rides',    rideRoutes);
app.use('/captains', captainRoutes);
app.use('/admin',    adminRoutes);

app.get('/health', (_, res) => res.json({ status: 'ok' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

initSocket(io);

connectDB().then(async () => {
  await initDb();
  server.listen(process.env.PORT || 3000, () =>
    console.log(`Server running on port ${process.env.PORT || 3000}`)
  );
});
