# Rapydo — Rapido-style Ride Booking App (React Native / Expo)

A 3-in-1 demo app (Rider / Captain / Admin) built with React Native + Expo, styled after
Rapido's UI (yellow/black brand, rounded bottom-sheet cards, pill buttons). All data is
dummy/in-memory — no backend required.

## What's included

**Rider app** (`/User`)
- Phone number login → OTP screen (any 4 digits work, hint shown: `1234`)
- Home screen: pickup/drop, choose Bike / Auto / Cab Economy / Cab Premium with live fare & ETA
- "Finding driver" animated searching screen
- Ride tracking screen with driver card, OTP-to-start, call/message/cancel actions
- Ride history tab + profile tab

**Captain (driver) app** (`/Driver`)
- Phone login
- Online/offline toggle, today's earnings & rides stat cards
- Incoming ride request list → full-screen request card with a **swipe-to-accept** slider
  (built with `PanResponder`, no extra native deps) and a 15s auto-decline countdown
- Active ride flow: drive to pickup → enter rider OTP → drive to drop → complete ride
- Earnings tab with a simple bar chart and payout summary

**Admin console** (`/Admin`)
- Login screen
- Dashboard with live-computed stats (riders, captains, online now, revenue) from dummy data
- **Users** list (search) → user detail with block/unblock toggle
- **Drivers** list (search, online-status dot) → driver detail with suspend/reactivate toggle

## Run it

```bash
npm install
npx expo start
```

Then scan the QR code with the Expo Go app (Android/iOS), or press `a` / `i` for an emulator.

## Project structure

```
App.js
src/
  theme/theme.js         # colors, spacing, typography tokens (Rapido yellow/black)
  data/dummyData.js       # dummy users, drivers, ride types, ride requests
  components/
    SwipeButton.js        # swipe-to-accept slider
    StatCard.js
  navigation/
    RootNavigator.js       # role picker + 3 app stacks
    UserNavigator.js
    DriverNavigator.js
    AdminNavigator.js
  screens/
    RoleSelectScreen.js    # pick Rider / Captain / Admin
    user/...
    driver/...
    admin/...
```

## Notes for going from demo → real app

- Replace the flat-colour "map" placeholders with `react-native-maps`.
- Replace dummy OTP with a real SMS OTP provider (Firebase Auth, MSG91, Twilio Verify...).
- Replace `src/data/dummyData.js` with real API calls (React Query / Redux Toolkit Query).
- Add real-time ride matching + driver location updates via sockets (Socket.IO / Firebase RTDB).
- Add role-based auth guarding the `/Admin` stack.
