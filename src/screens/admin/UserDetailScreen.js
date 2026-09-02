import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow } from '../../theme/theme';

export default function UserDetailScreen({ route, navigation }) {
  const { user } = route.params;
  const [status, setStatus] = useState(user.status);

  const isActive = status === 'active';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={18} color={colors.black} />
        </TouchableOpacity>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name.split(' ').map(n => n[0]).join('')}</Text>
          </View>
          <View style={[styles.statusRing, { borderColor: isActive ? colors.success : colors.danger }]} />
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.phone}>+91 {user.phone}</Text>
        <View style={[styles.statusBadge, { backgroundColor: isActive ? '#0D2A1A' : '#2A0D0D', borderColor: isActive ? '#1E3A1E' : '#3A1E1E' }]}>
          <View style={[styles.statusDot, { backgroundColor: isActive ? colors.success : colors.danger }]} />
          <Text style={[styles.statusText, { color: isActive ? colors.success : colors.danger }]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { label: 'Total Rides', value: user.rides, icon: 'car-outline', color: '#3B82F6' },
          { label: 'Rating', value: `${user.rating}★`, icon: 'star-outline', color: colors.yellow },
          { label: 'Member Since', value: user.joined.split('-')[0], icon: 'calendar-outline', color: colors.bike },
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

      {/* Info card */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Account Details</Text>
        {[
          { label: 'Full Name', value: user.name, icon: 'person-outline' },
          { label: 'Phone', value: `+91 ${user.phone}`, icon: 'call-outline' },
          { label: 'Joined', value: user.joined, icon: 'calendar-outline' },
          { label: 'Total Rides', value: `${user.rides} rides completed`, icon: 'car-outline' },
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

      {/* Activity timeline */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {['Completed ride to Indiranagar', 'Booked Auto from Koramangala', 'Rated captain 5★', 'Account created'].map((act, i) => (
          <View key={i} style={styles.timelineRow}>
            <View style={styles.timelineCol}>
              <View style={[styles.timelineDot, { backgroundColor: i === 0 ? colors.yellow : '#333' }]} />
              {i < 3 && <View style={styles.timelineLine} />}
            </View>
            <View style={{ flex: 1, paddingBottom: 16 }}>
              <Text style={styles.timelineText}>{act}</Text>
              <Text style={styles.timelineTime}>{i === 0 ? 'Today' : i === 1 ? 'Yesterday' : `${i + 1} days ago`}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Action */}
      <TouchableOpacity
        style={[styles.actionBtn, { backgroundColor: isActive ? '#2A0D0D' : '#0D2A1A', borderColor: isActive ? '#3A1E1E' : '#1E3A1E' }]}
        onPress={() => setStatus(s => s === 'active' ? 'blocked' : 'active')}
        activeOpacity={0.8}
      >
        <Ionicons
          name={isActive ? 'ban-outline' : 'checkmark-circle-outline'}
          size={20}
          color={isActive ? colors.danger : colors.success}
        />
        <Text style={[styles.actionText, { color: isActive ? colors.danger : colors.success }]}>
          {isActive ? 'Block this user' : 'Unblock this user'}
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
  avatar: { width: 76, height: 76, borderRadius: 38, backgroundColor: '#3B82F633', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 26, fontWeight: '900', color: '#3B82F6' },
  statusRing: { position: 'absolute', inset: -3, borderRadius: 42, borderWidth: 2.5, width: 82, height: 82, top: -3, left: -3 },
  name: { fontSize: 20, fontWeight: '800', color: colors.black, marginBottom: 4 },
  phone: { fontSize: 13, color: colors.grey, marginBottom: 12 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: '700' },
  statsRow: { flexDirection: 'row', padding: 14, gap: 10 },
  statCard: { flex: 1, backgroundColor: colors.white, borderRadius: radius.md, padding: 12, alignItems: 'center', gap: 6, borderWidth: 1, borderColor: colors.border },
  statIcon: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  statValue: { fontSize: 16, fontWeight: '800', color: colors.black },
  statLabel: { fontSize: 10, fontWeight: '500', color: colors.grey, textAlign: 'center' },
  infoCard: { backgroundColor: colors.white, marginHorizontal: 14, borderRadius: radius.md, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: colors.grey, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 14 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border },
  infoIcon: { width: 30, height: 30, borderRadius: 8, backgroundColor: colors.greyBg, justifyContent: 'center', alignItems: 'center' },
  infoLabel: { fontSize: 10, fontWeight: '600', color: colors.grey, marginBottom: 2 },
  infoValue: { fontSize: 13, fontWeight: '600', color: colors.black },
  timelineRow: { flexDirection: 'row', gap: 12 },
  timelineCol: { alignItems: 'center', width: 16 },
  timelineDot: { width: 10, height: 10, borderRadius: 5, marginTop: 3 },
  timelineLine: { width: 1.5, flex: 1, backgroundColor: colors.border, marginTop: 4 },
  timelineText: { fontSize: 13, fontWeight: '600', color: colors.black },
  timelineTime: { fontSize: 11, color: colors.grey, marginTop: 2 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginHorizontal: 14, marginTop: 4, paddingVertical: 15, borderRadius: radius.pill, borderWidth: 1 },
  actionText: { fontSize: 15, fontWeight: '800' },
});
