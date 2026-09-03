import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors, radius, sf } from '../../theme/theme';
import { getCaptains, logout, getAdminUser, getAllUsers } from '../../utils/authStore';
import * as api from '../../utils/api';


function StatCard({ label, value, icon, accent, delta }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: accent + '22' }]}>
        <Ionicons name={icon} size={18} color={accent} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {delta && (
        <View style={styles.deltaBadge}>
          <Ionicons name="trending-up" size={10} color={colors.success} />
          <Text style={styles.deltaText}>{delta}</Text>
        </View>
      )}
    </View>
  );
}

export default function AdminDashboardScreen({ navigation }) {
  const [pendingCount, setPendingCount] = useState(0);
  const [adminName, setAdminName] = useState('');
  const [totalUsers, setTotalUsers] = useState(0);
  const [onlineDrivers, setOnlineDrivers] = useState([]);
  const [totalDrivers, setTotalDrivers] = useState(0);

  useFocusEffect(useCallback(() => {
    getCaptains().then(list => {
      setPendingCount(list.filter(c => c.status === 'pending').length);
      setOnlineDrivers(list.filter(c => c.status === 'online'));
      setTotalDrivers(list.length);
    });
    getAdminUser().then(a => a && setAdminName(a.name || a.email || 'Admin'));
    api.adminGetStats()
      .then(s => setTotalUsers(s.totalUsers))
      .catch(() => getAllUsers().then(list => setTotalUsers(list.length)));
  }, []));

  async function handleLogout() {
    await logout();
    navigation.getParent()?.reset({ index: 0, routes: [{ name: 'AdminLogin' }] });
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.logoRow}>
              <View style={styles.logoMark}>
                <Ionicons name="bicycle" size={16} color={colors.black} />
              </View>
              <View>
                <Text style={styles.brand}>Hubli Rider</Text>
                <Text style={styles.brandSub}>Welcome, {adminName || 'Admin'} 👋</Text>
              </View>
            </View>
            <View style={styles.adminBadge}>
              <View style={styles.onlineDot} />
              <Text style={styles.adminBadgeText}>Live</Text>
            </View>
          </View>

          {/* Summary hero */}
          <View style={styles.revenueBlock}>
            <View style={{ flex: 1 }}>
              <Text style={styles.revenueLabel}>Registered Captains</Text>
              <Text style={styles.revenueValue}>{totalDrivers}</Text>
              <View style={styles.revenueMeta}>
                <View style={styles.upBadge}>
                  <Ionicons name="radio-button-on" size={12} color={colors.success} />
                  <Text style={styles.upText}>{onlineDrivers.length} online now</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          <StatCard label="Total Riders"   value={totalUsers}         icon="people"           accent="#3B82F6" delta="+3 today" />
          <StatCard label="Captains"       value={totalDrivers}        icon="bicycle"          accent={colors.bike} />
          <StatCard label="Online Now"     value={onlineDrivers.length} icon="radio-button-on"  accent={colors.success} delta="active" />
          <StatCard label="Rides Today"    value="—" icon="car" accent={colors.yellow} />
        </View>

        <View style={styles.section}>
          {/* Live drivers */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Online Captains</Text>
              <TouchableOpacity onPress={() => navigation.navigate('DriversList')}>
                <Text style={styles.seeAll}>See all →</Text>
              </TouchableOpacity>
            </View>
            {onlineDrivers.length === 0 ? (
              <Text style={{ color: colors.grey, fontSize: 13, paddingVertical: 8 }}>No captains online</Text>
            ) : onlineDrivers.map(d => (
              <TouchableOpacity
                key={d.id}
                style={styles.driverRow}
                onPress={() => navigation.navigate('DriverDetail', { driver: d })}
                activeOpacity={0.7}
              >
                <View style={styles.driverAvatar}>
                  <Text style={styles.driverAvatarText}>{(d.name || '?')[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.driverName}>{d.name}</Text>
                  <Text style={styles.driverSub}>{d.vehicleType || d.vehicle} · {d.vehicleNumber || d.number}</Text>
                </View>
                <View style={styles.onlinePill}>
                  <View style={styles.onlineDot} />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
            <Ionicons name="log-out-outline" size={16} color={colors.danger} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1 },
  header: {
    backgroundColor: colors.white,
    paddingTop: 16, paddingHorizontal: 18, paddingBottom: 24,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoMark: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.yellow, justifyContent: 'center', alignItems: 'center' },
  brand: { fontSize: sf(18), fontWeight: '900', color: colors.black },
  brandSub: { fontSize: 10, fontWeight: '500', color: colors.grey, marginTop: 1 },
  adminBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.successBg, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: '#BBF7D0' },
  adminBadgeText: { fontSize: 11, fontWeight: '700', color: colors.success },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success },
  revenueBlock: { flexDirection: 'row', alignItems: 'flex-end', gap: 16 },
  revenueLabel: { fontSize: 12, fontWeight: '500', color: colors.grey, marginBottom: 4 },
  revenueValue: { fontSize: sf(34), fontWeight: '900', color: colors.black, letterSpacing: -1 },
  revenueMeta: { marginTop: 8 },
  upBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.successBg, borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-start' },
  upText: { fontSize: 11, fontWeight: '700', color: colors.success },
  revenueChart: { flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 55 },
  sparkBar: { width: 6, backgroundColor: colors.yellow, borderRadius: 3 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 14, gap: 10 },
  statCard: { width: '47%', minWidth: 140, backgroundColor: colors.white, borderRadius: radius.md, padding: 14, borderWidth: 1, borderColor: colors.border },
  statIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  statValue: { fontSize: 24, fontWeight: '900', color: colors.black, letterSpacing: -0.5 },
  statLabel: { fontSize: 11, fontWeight: '500', color: colors.grey, marginTop: 2 },
  deltaBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 6 },
  deltaText: { fontSize: 10, fontWeight: '700', color: colors.success },
  section: { paddingHorizontal: 14 },
  sectionCard: { backgroundColor: colors.white, borderRadius: radius.md, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: colors.charcoal },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center', paddingVertical: 14, marginBottom: 8, borderWidth: 1, borderColor: colors.dangerBg, borderRadius: radius.pill, backgroundColor: colors.dangerBg },
  logoutText: { fontSize: 14, fontWeight: '700', color: colors.danger },
});
