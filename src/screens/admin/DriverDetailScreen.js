import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, sf } from '../../theme/theme';
import { adminToggleSuspend } from '../../utils/api';

export default function DriverDetailScreen({ route, navigation }) {
  const { driver } = route.params;
  const [status, setStatus] = useState(driver.status);

  const isOnline = status === 'online';
  const isSuspended = status === 'suspended';
  const vehicle = driver.vehicleType || driver.vehicle || '—';
  const number = driver.vehicleNumber || driver.number || '—';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(driver.name || '?').split(' ').map(n => n[0]).join('')}</Text>
          </View>
          <View style={[styles.statusRing, {
            borderColor: isOnline ? colors.success : isSuspended ? colors.danger : '#333'
          }]} />
        </View>
        <Text style={styles.name}>{driver.name}</Text>
        <Text style={styles.vehicle}>{vehicle} · {number}</Text>
        <View style={[styles.statusBadge, {
          backgroundColor: isOnline ? '#0D2A1A' : isSuspended ? '#2A0D0D' : '#1A1A1A',
          borderColor: isOnline ? '#1E3A1E' : isSuspended ? '#3A1E1E' : '#2A2A2A',
        }]}>
          <View style={[styles.statusDot, { backgroundColor: isOnline ? colors.success : isSuspended ? colors.danger : '#555' }]} />
          <Text style={[styles.statusText, { color: isOnline ? colors.success : isSuspended ? colors.danger : '#888' }]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { label: 'Total Rides', value: (driver.rides || 0).toLocaleString('en-IN'), icon: 'car-outline', color: '#3B82F6' },
          { label: 'Rating', value: driver.rating ? `${driver.rating}★` : '—', icon: 'star-outline', color: colors.yellow },
          { label: 'Joined', value: driver.createdAt ? new Date(driver.createdAt).getFullYear() : '—', icon: 'calendar-outline', color: colors.success },
        ].map(s => (
          <View key={s.label} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: s.color + '22' }]}>
              <Ionicons name={s.icon} size={16} color={s.color} />
            </View>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Info */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Captain Details</Text>
        {[
          { label: 'Full Name', value: driver.name, icon: 'person-outline' },
          { label: 'Phone', value: `+91 ${driver.phone}`, icon: 'call-outline' },
          { label: 'Vehicle Type', value: vehicle, icon: 'bicycle-outline' },
          { label: 'Vehicle Number', value: number, icon: 'card-outline' },
          { label: 'Licence No.', value: driver.licenceNumber || '—', icon: 'document-outline' },
          { label: 'City', value: driver.city || '—', icon: 'location-outline' },
        ].map(row => (
          <View key={row.label} style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name={row.icon} size={14} color="#666" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>{row.label}</Text>
              <Text style={styles.infoValue}>{row.value}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Action */}
      <TouchableOpacity
        style={[styles.actionBtn, {
          backgroundColor: isSuspended ? '#0D2A1A' : '#2A0D0D',
          borderColor: isSuspended ? '#1E3A1E' : '#3A1E1E',
        }]}
        onPress={async () => {
          try {
            const updated = await adminToggleSuspend(driver._id || driver.id);
            setStatus(updated.status);
          } catch {
            setStatus(s => s === 'suspended' ? 'active' : 'suspended');
          }
        }}
        activeOpacity={0.8}
      >
        <Ionicons
          name={isSuspended ? 'checkmark-circle-outline' : 'ban-outline'}
          size={20}
          color={isSuspended ? colors.success : colors.danger}
        />
        <Text style={[styles.actionText, { color: isSuspended ? colors.success : colors.danger }]}>
          {isSuspended ? 'Reactivate captain' : 'Suspend captain'}
        </Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, backgroundColor: colors.bg },
  header: { alignItems: 'center', backgroundColor: colors.white, paddingTop: 16, paddingBottom: 28, borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { position: 'absolute', top: 16, left: 18, width: 36, height: 36, borderRadius: 10, backgroundColor: colors.greyBg, justifyContent: 'center', alignItems: 'center' },
  avatarWrap: { position: 'relative', marginBottom: 12 },
  avatar: { width: 76, height: 76, borderRadius: 38, backgroundColor: '#FFC40022', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 26, fontWeight: '900', color: colors.yellow },
  statusRing: { position: 'absolute', borderRadius: 42, borderWidth: 2.5, width: 82, height: 82, top: -3, left: -3 },
  name: { fontSize: 20, fontWeight: '800', color: colors.black, marginBottom: 4 },
  vehicle: { fontSize: 13, color: colors.grey, marginBottom: 12 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: '700' },
  statsRow: { flexDirection: 'row', padding: 14, gap: 10 },
  statCard: { flex: 1, backgroundColor: colors.white, borderRadius: radius.md, padding: 12, alignItems: 'center', gap: 6, borderWidth: 1, borderColor: colors.border },
  statIcon: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  statValue: { fontSize: 15, fontWeight: '800', color: colors.black },
  statLabel: { fontSize: 10, fontWeight: '500', color: colors.grey, textAlign: 'center' },
  card: { backgroundColor: colors.white, marginHorizontal: 14, borderRadius: radius.md, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: colors.grey, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 14 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border },
  infoIcon: { width: 30, height: 30, borderRadius: 8, backgroundColor: colors.greyBg, justifyContent: 'center', alignItems: 'center' },
  infoLabel: { fontSize: 10, fontWeight: '600', color: colors.grey, marginBottom: 2 },
  infoValue: { fontSize: 13, fontWeight: '600', color: colors.black },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginHorizontal: 14, marginTop: 4, paddingVertical: 15, borderRadius: radius.pill, borderWidth: 1 },
  actionText: { fontSize: 15, fontWeight: '800' },
});
