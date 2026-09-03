import React from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, type, shadow, sf } from '../../theme/theme';
import MapView from '../../components/MapView';

const STATUS_COLOR = {
  searching:   colors.info,
  accepted:    colors.yellow,
  otp_verified: colors.yellow,
  in_progress: colors.bike,
  completed:   colors.success,
  cancelled:   colors.danger,
};

const STATUS_LABEL = {
  searching:   'Searching Driver',
  accepted:    'Driver Accepted',
  otp_verified:'OTP Verified',
  in_progress: 'In Progress',
  completed:   'Completed',
  cancelled:   'Cancelled',
};

export default function AdminUserRideTrackingScreen({ route }) {
  const { ride } = route.params;
  const { height } = useWindowDimensions();
  const mapHeight = Math.max(180, height * 0.3);
  const statusColor = STATUS_COLOR[ride.status] || colors.grey;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={{ height: mapHeight }}>
        <MapView
          style={StyleSheet.absoluteFill}
          pickup={{ lat: 12.9352, lng: 77.6245, label: ride.pickup }}
          drop={{ lat: 12.9716, lng: 77.5946, label: ride.drop }}
          driverLat={ride.status === 'in_progress' ? 12.955 : null}
          driverLng={ride.status === 'in_progress' ? 77.610 : null}
        />
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '22', borderColor: statusColor }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>{STATUS_LABEL[ride.status] ?? ride.status}</Text>
        </View>
      </View>

      <ScrollView style={styles.sheet} contentContainerStyle={{ padding: 18, gap: 14 }}>
        <View style={styles.sheetHandle} />

        {/* Ride type + fare */}
        <View style={styles.row}>
          <Text style={type.h2}>{ride.rideType?.toUpperCase()}</Text>
          <Text style={styles.fare}>₹{ride.fare}</Text>
        </View>

        {/* Route */}
        <View style={[styles.card, shadow.card]}>
          <View style={styles.routeRow}>
            <View style={styles.dotGreen} />
            <View style={{ flex: 1 }}>
              <Text style={type.label}>PICKUP</Text>
              <Text style={[type.body, { marginTop: 2 }]}>{ride.pickup}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.routeRow}>
            <View style={styles.dotRed} />
            <View style={{ flex: 1 }}>
              <Text style={type.label}>DROP</Text>
              <Text style={[type.body, { marginTop: 2 }]}>{ride.drop}</Text>
            </View>
          </View>
        </View>

        {/* Captain */}
        {ride.captain ? (
          <View style={[styles.card, shadow.card]}>
            <Text style={[type.label, { marginBottom: 10 }]}>CAPTAIN</Text>
            <View style={styles.row}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{ride.captain.name?.[0] ?? '?'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={type.h3}>{ride.captain.name}</Text>
                <Text style={type.small}>+91 {ride.captain.phone}</Text>
              </View>
              <View style={styles.vehicleBadge}>
                <Ionicons name="bicycle" size={13} color={colors.black} />
                <Text style={styles.vehicleText}>{ride.captain.vehicle}</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={[styles.card, { alignItems: 'center', paddingVertical: 18 }]}>
            <Ionicons name="person-outline" size={22} color={colors.grey} />
            <Text style={[type.small, { marginTop: 6 }]}>No captain assigned yet</Text>
          </View>
        )}

        {/* Meta */}
        <View style={[styles.card, shadow.card]}>
          {[
            { label: 'Ride ID', value: ride._id ?? ride.id },
            { label: 'Distance', value: ride.distance ?? '—' },
            { label: 'OTP', value: ride.otp ?? '—' },
            { label: 'Booked', value: ride.createdAt ? new Date(ride.createdAt).toLocaleString('en-IN') : '—' },
            { label: 'Started', value: ride.startedAt ? new Date(ride.startedAt).toLocaleString('en-IN') : '—' },
            { label: 'Completed', value: ride.completedAt ? new Date(ride.completedAt).toLocaleString('en-IN') : '—' },
          ].map(r => (
            <View key={r.label} style={styles.metaRow}>
              <Text style={styles.metaLabel}>{r.label}</Text>
              <Text style={styles.metaValue}>{r.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: 4 },
  statusBadge: {
    position: 'absolute', top: 12, right: 14,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1,
  },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: sf(11), fontWeight: '700' },
  sheet: { backgroundColor: colors.white, marginTop: -20, borderTopLeftRadius: 28, borderTopRightRadius: 28 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  fare: { fontSize: sf(22), fontWeight: '900', color: colors.black },
  card: { backgroundColor: colors.white, borderRadius: radius.md, padding: 14, borderWidth: 1, borderColor: colors.border },
  routeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  dotGreen: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.success, marginTop: 4 },
  dotRed: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.danger, marginTop: 4 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 10, marginLeft: 21 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.black, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { fontSize: sf(16), fontWeight: '800', color: colors.yellow },
  vehicleBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.greyBg, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 5 },
  vehicleText: { fontSize: sf(11), fontWeight: '700', color: colors.black },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: colors.border },
  metaLabel: { fontSize: sf(12), fontWeight: '600', color: colors.grey },
  metaValue: { fontSize: sf(12), fontWeight: '700', color: colors.black, maxWidth: '60%', textAlign: 'right' },
});
