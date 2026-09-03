import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors, radius, type, shadow, sf } from '../../theme/theme';
import { adminStats, drivers, users, dummyRideRequests } from '../../data/dummyData';
import { getCaptains, logout, getAdminUser, getAllUsers } from '../../utils/authStore';
import * as api from '../../utils/api';

const weekData = [42, 68, 55, 90, 74, 110, 134];
const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MAX_BAR = 134;

function MiniBarChart() {
  return (
    <View style={chart.wrap}>
      <Text style={chart.title}>Rides this week</Text>
      <View style={chart.bars}>
        {weekData.map((val, i) => (
          <View key={i} style={chart.barCol}>
            <Text style={chart.barVal}>{val}</Text>
            <View style={[chart.bar, { height: (val / MAX_BAR) * 80, backgroundColor: i === 6 ? colors.yellow : colors.greyBg }]} />
            <Text style={chart.barLabel}>{weekLabels[i]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const chart = StyleSheet.create({
  wrap: { backgroundColor: colors.white, borderRadius: radius.md, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  title: { fontSize: 13, fontWeight: '700', color: colors.charcoal, marginBottom: 14 },
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 110 },
  barCol: { flex: 1, alignItems: 'center', gap: 4 },
  barVal: { fontSize: 9, fontWeight: '700', color: colors.grey },
  bar: { width: '100%', borderRadius: 4, minHeight: 4 },
  barLabel: { fontSize: 9, fontWeight: '600', color: colors.greyLight },
});

function StatCard({ label, value, icon, accent, delta }) {
  return (
    <View style={[styles.statCard, shadow.sm]}>
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
  const stats = adminStats();
  const onlineDrivers = drivers.filter(d => d.status === 'online');
  const [pendingCount, setPendingCount] = useState(0);
  const [adminName, setAdminName] = useState('');
  const [totalUsers, setTotalUsers] = useState(adminStats().totalUsers);

  useFocusEffect(useCallback(() => {
    getCaptains().then(list => setPendingCount(list.filter(c => c.status === 'pending').length));
    getAdminUser().then(a => a && setAdminName(a.name || a.email || 'Admin'));
    // Try real backend stats first, fall back to merged local count
    api.adminGetStats()
      .then(s => setTotalUsers(s.totalUsers))
      .catch(() => getAllUsers().then(list => setTotalUsers(list.length)));
  }, []));

  async function handleLogout() {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: 'AdminLogin' }] });
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

          {/* Revenue hero */}
          <View style={styles.revenueBlock}>
            <View style={{ flex: 1 }}>
              <Text style={styles.revenueLabel}>Total Revenue Today</Text>
              <Text style={styles.revenueValue}>₹{stats.revenueToday.toLocaleString('en-IN')}</Text>
              <View style={styles.revenueMeta}>
                <View style={styles.upBadge}>
                  <Ionicons name="trending-up" size={12} color={colors.success} />
                  <Text style={styles.upText}>+12.4% vs yesterday</Text>
                </View>
              </View>
            </View>
            <View style={styles.revenueChart}>
              {[40, 65, 50, 80, 70, 95, 110].map((h, i) => (
                <View key={i} style={[styles.sparkBar, { height: h * 0.5, opacity: i === 6 ? 1 : 0.35 }]} />
              ))}
            </View>
          </View>
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          <StatCard label="Total Riders"   value={totalUsers}         icon="people"           accent="#3B82F6" delta="+3 today" />
          <StatCard label="Captains"       value={stats.totalDrivers}  icon="bicycle"          accent={colors.bike} />
          <StatCard label="Online Now"     value={stats.onlineDrivers} icon="radio-button-on"  accent={colors.success} delta="active" />
          <StatCard label="Rides Today"    value={stats.ridesToday.toLocaleString('en-IN')} icon="car" accent={colors.yellow} delta="+8.2%" />
        </View>

        <View style={styles.section}>
          {/* Bar chart */}
          <MiniBarChart />

          {/* Live drivers */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Online Captains</Text>
              <TouchableOpacity onPress={() => navigation.navigate('DriversList')}>
                <Text style={styles.seeAll}>See all →</Text>
              </TouchableOpacity>
            </View>
            {onlineDrivers.map(d => (
              <TouchableOpacity
                key={d.id}
                style={styles.driverRow}
                onPress={() => navigation.navigate('DriverDetail', { driver: d })}
                activeOpacity={0.7}
              >
                <View style={styles.driverAvatar}>
                  <Text style={styles.driverAvatarText}>{d.name[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.driverName}>{d.name}</Text>
                  <Text style={styles.driverSub}>{d.vehicle} · {d.number}</Text>
                </View>
                <View style={styles.earningsBadge}>
                  <Text style={styles.earningsText}>₹{d.earningsToday}</Text>
                </View>
                <View style={styles.onlinePill}>
                  <View style={styles.onlineDot} />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Recent ride requests */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Requests</Text>
              <View style={styles.livePill}>
                <View style={styles.onlineDot} />
                <Text style={styles.liveText}>Live</Text>
              </View>
            </View>
            {dummyRideRequests.map(r => (
              <View key={r.id} style={styles.rideRow}>
                <View style={styles.rideTypeIcon}>
                  <Ionicons
                    name={r.rideType === 'Auto' ? 'car-sport' : r.rideType === 'Cab Economy' ? 'car' : 'bicycle'}
                    size={18} color={colors.black}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.driverName}>{r.riderName}</Text>
                  <Text style={styles.driverSub} numberOfLines={1}>{r.pickup} → {r.drop}</Text>
                </View>
                <Text style={styles.rideFare}>₹{r.fare}</Text>
              </View>
            ))}
          </View>

          {/* Quick actions */}
          <Text style={styles.sectionTitle2}>Manage</Text>
          <View style={styles.actionGrid}>
            {[
              { screen: 'UsersList',        icon: 'people',   label: 'Users',    count: `${totalUsers} total`,    accent: '#3B82F6' },
              { screen: 'DriversList',      icon: 'bicycle',  label: 'Drivers',  count: `${stats.totalDrivers} total`,  accent: colors.bike },
              { screen: 'PendingCaptains',  icon: 'time',     label: 'Pending',  count: `${pendingCount} pending`,      accent: '#CA8A04' },
            ].map(a => (
              <TouchableOpacity
                key={a.screen}
                style={[styles.actionCard, shadow.card]}
                onPress={() => navigation.navigate(a.screen)}
                activeOpacity={0.8}
              >
                <View style={[styles.actionIcon, { backgroundColor: a.accent + '22' }]}>
                  <Ionicons name={a.icon} size={22} color={a.accent} />
                </View>
                <Text style={styles.actionLabel}>{a.label}</Text>
                <Text style={styles.actionCount}>{a.count}</Text>
                <Ionicons name="chevron-forward" size={14} color="#555" style={{ marginTop: 'auto' }} />
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
  statCard: { width: '47%', backgroundColor: colors.white, borderRadius: radius.md, padding: 14, borderWidth: 1, borderColor: colors.border },
  statIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  statValue: { fontSize: 24, fontWeight: '900', color: colors.black, letterSpacing: -0.5 },
  statLabel: { fontSize: 11, fontWeight: '500', color: colors.grey, marginTop: 2 },
  deltaBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 6 },
  deltaText: { fontSize: 10, fontWeight: '700', color: colors.success },
  section: { paddingHorizontal: 14 },
  sectionCard: { backgroundColor: colors.white, borderRadius: radius.md, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: colors.charcoal },
  sectionTitle2: { fontSize: 13, fontWeight: '700', color: colors.charcoal, marginBottom: 10 },
  seeAll: { fontSize: 12, fontWeight: '600', color: colors.yellow },
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.border },
  driverAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.greyBg, justifyContent: 'center', alignItems: 'center' },
  driverAvatarText: { fontSize: 14, fontWeight: '800', color: colors.yellow },
  driverName: { fontSize: 13, fontWeight: '700', color: colors.black },
  driverSub: { fontSize: 11, fontWeight: '400', color: colors.grey, marginTop: 1 },
  earningsBadge: { backgroundColor: colors.successBg, borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 3 },
  earningsText: { fontSize: 12, fontWeight: '700', color: colors.success },
  onlinePill: { marginLeft: 4 },
  livePill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.successBg, borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 3 },
  liveText: { fontSize: 10, fontWeight: '700', color: colors.success },
  rideRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.border },
  rideTypeIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.greyBg, justifyContent: 'center', alignItems: 'center' },
  rideFare: { fontSize: 14, fontWeight: '800', color: colors.yellow },
  actionGrid: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  actionCard: { flex: 1, backgroundColor: colors.white, borderRadius: radius.md, padding: 16, borderWidth: 1, borderColor: colors.border, gap: 6 },
  actionIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  actionLabel: { fontSize: 15, fontWeight: '800', color: colors.black },
  actionCount: { fontSize: 11, fontWeight: '500', color: colors.grey },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center', paddingVertical: 14, marginBottom: 8, borderWidth: 1, borderColor: colors.dangerBg, borderRadius: radius.pill, backgroundColor: colors.dangerBg },
  logoutText: { fontSize: 14, fontWeight: '700', color: colors.danger },
});
