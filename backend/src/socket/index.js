// Socket.IO real-time layer
// Events:
//   client → server: join_ride, captain_location, captain_online
//   server → client: new_ride_request, ride_accepted, ride_started, ride_completed, ride_cancelled, captain_location

module.exports = function initSocket(io) {
  io.on('connection', (socket) => {
    // Join a ride room (user + captain both join)
    socket.on('join_ride', ({ rideId }) => {
      socket.join(`ride_${rideId}`);
    });

    // Captain broadcasts location update
    socket.on('captain_location', ({ captainId, lat, lng }) => {
      socket.broadcast.emit('captain_location', { captainId, lat, lng });
    });

    // Captain goes online/offline
    socket.on('captain_online', ({ captainId, isOnline }) => {
      socket.broadcast.emit('captain_status_changed', { captainId, isOnline });
    });

    socket.on('disconnect', () => {});
  });
};
