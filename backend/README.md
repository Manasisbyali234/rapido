# Rapido Backend

Express + Socket.IO + MongoDB REST API for the Rapido clone app.

## Setup

```bash
cd backend
npm install
```

Make sure MongoDB is running locally, then:

```bash
# Seed dummy data
npm run seed

# Start dev server (with auto-reload)
npm run dev

# Start production server
npm start
```

Server runs on `http://localhost:5000`

---

## API Reference

### Auth

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/auth/send-otp` | `{ phone }` | Send OTP (returned in response for demo) |
| POST | `/auth/verify-otp` | `{ phone, code }` | Verify OTP |
| POST | `/auth/user/register` | `{ name, phone, email? }` | Register rider |
| POST | `/auth/user/login` | `{ phone }` | Login rider |
| POST | `/auth/captain/register` | `{ name, phone, vehicle, vehicleNumber, licenseNumber? }` | Register captain |
| POST | `/auth/captain/login` | `{ phone }` | Login captain |
| POST | `/auth/admin/login` | `{ email, password }` | Admin login |

### Rides  *(Bearer token required)*

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/rides` | user | Book a ride |
| GET | `/rides/my` | user | Ride history |
| GET | `/rides/active` | user | Current active ride |
| PATCH | `/rides/:id/cancel` | user/captain | Cancel ride |
| PATCH | `/rides/:id/accept` | captain | Accept ride |
| PATCH | `/rides/:id/verify-otp` | captain | Verify OTP → start ride |
| PATCH | `/rides/:id/complete` | captain | Complete ride |
| GET | `/rides/captain/active` | captain | Captain's active ride |
| GET | `/rides/captain/history` | captain | Captain's ride history |

### Captains  *(Bearer token required)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/captains/me` | Get own profile |
| PATCH | `/captains/toggle-online` | `{ isOnline: bool }` |
| PATCH | `/captains/location` | `{ lat, lng }` |

### Admin  *(Bearer admin token required)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/stats` | Dashboard stats |
| GET | `/admin/users?search=` | List users |
| GET | `/admin/users/:id` | User detail |
| PATCH | `/admin/users/:id/toggle-block` | Block/unblock user |
| GET | `/admin/captains?search=` | List captains |
| GET | `/admin/captains/pending` | Pending approvals |
| GET | `/admin/captains/:id` | Captain detail |
| PATCH | `/admin/captains/:id/approve` | Approve captain |
| PATCH | `/admin/captains/:id/toggle-suspend` | Suspend/reactivate |
| GET | `/admin/rides?status=&limit=` | All rides |

---

## Socket.IO Events

**Client → Server**
- `join_ride` `{ rideId }` — join a ride room
- `captain_location` `{ captainId, lat, lng }` — broadcast location
- `captain_online` `{ captainId, isOnline }` — status change

**Server → Client**
- `new_ride_request` — new ride available for captains
- `ride_accepted` `{ ride, captain }` — captain accepted
- `ride_started` `{ rideId }` — OTP verified, ride in progress
- `ride_completed` `{ rideId, fare }` — ride done
- `ride_cancelled` `{ rideId }` — ride cancelled
- `captain_location` `{ captainId, lat, lng }` — live location
- `captain_status_changed` `{ captainId, isOnline }` — online/offline
