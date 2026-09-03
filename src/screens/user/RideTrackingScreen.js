import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, type, shadow, sf } from '../../theme/theme';
import MapView from '../../components/MapView';

export default function RideTrackingScreen({ route, navigation }) {
  const { ride, pickup, drop, driver } = route.params;
  const [status, setStatus] = useState('arriving');
  const { height } = useWindowDimensions();
  const mapHeight = Math.max(160, height * 0.28);
  const otp = '4821';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={[styles.map, { height: mapHeight }]}>
        <MapView
          style={StyleSheet.absoluteFill}
          pickup={{ lat: 12.9352, lng: 77.6245, label: pickup }}
          drop={{ lat: 12.9716, lng: 77.5946, label: drop }}
          driverLat={status === 'arriving' ? 12.9400 : 12.9550}
          driverLng={status === 'arriving' ? 77.6200 : 77.6100}
        />
        <TouchableOpacity style={[styles.backBtn, shadow.card]} onPress={() => navigation.popToTop()}>
          <Ionicons name="arrow-back" size={18} color={colors.black} />
        </TouchableOpacity>
        <View style={[styles.etaBadge, shadow.sm]}>
          <Ionicons name="time-outline" size={13} color={colors.black} />
          <Text style={styles.etaText}>{status === 'arriving' ? '4 min away' : 'On the way'}</Text>
        </View>
      </View>

      <ScrollView style={[styles.sheet, shadow.lg]} showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 10, paddingBottom: 16 }}>
        <View style={styles.sheetHandle} />

        <View style={styles.statusRow}>
          <View style={{ flex: 1 }}>
            <Text style={[type.label, { marginBottom: 4 }]}>
              {status === 'arriving' ? 'CAPTAIN ARRIVING' : 'RIDE IN PROGRESS'}
            </Text>
            <Text style={type.h2}>
              {status === 'arriving' ? `${driver.name.split(' ')[0]} is on the way` : 'Heading to drop'}
            </Text>
          </View>
          <View style={styles.otpPill}>
            <Text style={styles.otpLabel}>OTP</Text>
            <Text style={styles.otpValue}>{otp}</Text>
          </View>
        </View>

        <View style={[styles.driverCard, shadow.card]}>
          <View style={styles.driverAvatar}>
            <Text style={styles.driverAvatarText}>{driver.name[0]}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={type.h3}>{driver.name}</Text>
            <Text style={[type.small, { marginTop: 2 }]}>{driver.vehicle} · {driver.number}</Text>
          </View>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={11} color={colors.yellowDark} />
            <Text style={styles.ratingText}>{driver.rating}</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          {[
            { icon: 'call', label: 'Call', color: colors.black },
            { icon: 'chatbubble-ellipses', label: 'Chat', color: colors.black },
            { icon: 'close-circle', label: 'Cancel', color: colors.danger },
          ].map(a => (
            <TouchableOpacity key={a.label} style={[styles.actionBtn, a.label === 'Cancel' && styles.actionBtnDanger]}>
              <Ionicons name={a.icon} size={17} color={a.color} />
              <Text style={[styles.actionText, { color: a.color }]}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tripBox}>
          <View style={styles.tripRow}>
            <View style={styles.tripDotGreen} />
            <View style={{ flex: 1 }}>
              <Text style={type.label}>PICKUP</Text>
              <Text style={[type.body, { marginTop: 2 }]}>{pickup}</Text>
            </View>
          </View>
          <View style={styles.tripDivider} />
          <View style={styles.tripRow}>
            <View style={styles.tripDotRed} />
            <View style={{ flex: 1 }}>
              <Text style={type.label}>DROP</Text>
              <Text style={[type.body, { marginTop: 2 }]}>{drop}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => status === 'arriving' ? setStatus('ongoing') : navigation.reset({ index: 0, routes: [{ name: 'UserHome' }] })}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>
            {status === 'arriving' ? 'Simulate: Start Ride' : `Simulate: Complete · ₹${ride.price}`}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  map: { backgroundColor: '#C8DDD0', overflow: 'hidden' },
  backBtn: {
    position: 'absolute', top: 12, left: 18,
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: colors.white,
    justifyContent: 'center', alignItems: 'center',
  },
  etaBadge: {
    position: 'absolute', top: 12, right: 18,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: colors.white, borderRadius: radius.pill,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  etaText: { fontSize: sf(11), fontWeight: '700', color: colors.black },
  sheet: {
    backgroundColor: colors.white,
    marginTop: -20, borderTopLeftRadius: 28, borderTopRightRadius: 28,
  },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: 16 },
  statusRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 14 },
  otpPill: {
    backgroundColor: colors.yellowLight, borderRadius: radius.md,
    paddingHorizontal: 14, paddingVertical: 8, alignItems: 'center',
    borderWidth: 1.5, borderColor: colors.yellow,
  },
  otpLabel: { fontSize: sf(9), fontWeight: '700', color: colors.yellowDark, letterSpacing: 0.5 },
  otpValue: { fontSize: sf(20), fontWeight: '900', color: colors.black, letterSpacing: 2 },
  driverCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.greyBg, borderRadius: radius.md,
    padding: 14, marginBottom: 14,
  },
  driverAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.black,
    justifyContent: 'center', alignItems: 'center',
  },
  driverAvatarText: { fontSize: sf(18), fontWeight: '800', color: colors.yellow },
  ratingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.yellowLight, paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: radius.pill,
  },
  ratingText: { fontWeight: '700', fontSize: sf(12), color: colors.black },
  actionRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  actionBtn: {
    flex: 1, flexDirection: 'row', gap: 5,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.sm, paddingVertical: 10,
    backgroundColor: colors.white,
  },
  actionBtnDanger: { borderColor: colors.dangerBg, backgroundColor: colors.dangerBg },
  actionText: { fontWeight: '700', fontSize: sf(12) },
  tripBox: { backgroundColor: colors.greyBg, borderRadius: radius.md, padding: 14, marginBottom: 14 },
  tripRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  tripDotGreen: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.success, marginTop: 4 },
  tripDotRed: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.danger, marginTop: 4 },
  tripDivider: { height: 1, backgroundColor: colors.border, marginVertical: 10, marginLeft: 21 },
  primaryBtn: {
    backgroundColor: colors.yellow, borderRadius: radius.pill,
    paddingVertical: 15, alignItems: 'center',
  },
  primaryBtnText: { fontWeight: '800', fontSize: sf(15), color: colors.black },
});
