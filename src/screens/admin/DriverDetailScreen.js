import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme/theme';

const weekEarnings = [420, 680, 550, 900, 740, 860, 1120];
const weekLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const MAX = 1120;

export default function DriverDetailScreen({ route, navigation }) {
  const { driver } = route.params;
  const [status, setStatus] = useState(driver.status);

  const isOnline = status === 'online';
  const isSuspended = status === 'suspended';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={18} color={colors.black} />
        </TouchableOpacity>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{driver.name.split(' ').map(n => n[0]).join('')}</Text>
          </View>
          <View style={[styles.statusRing, {
            borderColor: isOnline ? colors.success : isSuspended ? colors.danger : '#333'
          }]} />
        </View>
        <Text style={styles.name}>{driver.name}</Text>
        <Text style={styles.vehicle}>{driver.vehicle} · {driver.number}</Text>
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
          { label: 'Total Rides', value: driver.rides.toLocaleString('en-IN'), icon: 'car-outline', color: '#3B82F6' },
          { label: 'Rating', value: `${driver.rating}★`, icon: 'star-outline', color: colors.yellow },
          { label: 'Today', value: `₹${driver.earningsToday}`, icon: 'wallet-outline', color: colors.success },
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

      {/* Weekly earnings chart */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Weekly Earnings</Text>
        <View style={styles.chartRow}>
          {weekEarnings.map((val, i) => (
            <View key={i} style={styles.barCol}>
              <Text style={styles.barVal}>₹{val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val}</Text>
              <View style={[styles.bar, {
                height: (val / MAX) * 70,
                backgroundColor: i === 6 ? colors.yellow : colors.greyBg,
              }]} />
              <Text style={styles.barLabel}>{weekLabels[i]}</Text>
            </View>
          ))}
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Week total</Text>
          <Text style={styles.totalValue}>₹{weekEarnings.reduce((a, b) => a + b, 0).toLocaleString('en-IN')}</Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Captain Details</Text>
        {[
          { label: 'Full Name', value: driver.name, icon: 'person-outline' },
          { label: 'Phone', value: `+91 ${driver.phone}`, icon: 'call-outline' },
          { label: 'Vehicle Type', value: driver.vehicle, icon: 'bicycle-outline' },
          { label: 'Vehicle Number', value: driver.number, icon: 'card-outline' },
          { label: 'Total Rides', value: `${driver.rides} completed`, icon: 'checkmark-circle-outline' },
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
        onPress={() => setStatus(s => s === 'suspended' ? 'online' : 'suspended')}
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { alignItems: 'center', backgroundColor: colors.white, paddingTop: 56, paddingBottom: 28, borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { position: 'absolute', top: 56, left: 18, width: 36, height: 36, borderRadius: 10, backgroundColor: colors.greyBg, justifyContent: 'center', alignItems: 'center' },
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
  chartRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 100, marginBottom: 12 },
  barCol: { flex: 1, alignItems: 'center', gap: 4 },
  barVal: { fontSize: 8, fontWeight: '700', color: colors.grey },
  bar: { width: '100%', borderRadius: 4, minHeight: 4 },
  barLabel: { fontSize: 9, fontWeight: '600', color: colors.grey },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border },
  totalLabel: { fontSize: 12, fontWeight: '600', color: colors.grey },
  totalValue: { fontSize: 18, fontWeight: '900', color: colors.yellow },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border },
  infoIcon: { width: 30, height: 30, borderRadius: 8, backgroundColor: colors.greyBg, justifyContent: 'center', alignItems: 'center' },
  infoLabel: { fontSize: 10, fontWeight: '600', color: colors.grey, marginBottom: 2 },
  infoValue: { fontSize: 13, fontWeight: '600', color: colors.black },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginHorizontal: 14, marginTop: 4, paddingVertical: 15, borderRadius: radius.pill, borderWidth: 1 },
  actionText: { fontSize: 15, fontWeight: '800' },
});
