import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, FlatList, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, type, shadow, sf } from '../../theme/theme';
import { dummyRideRequests } from '../../data/dummyData';
import { getCurrentUser, logout } from '../../utils/authStore';

export default function DriverHomeScreen({ navigation }) {
  const [online, setOnline] = useState(true);
  const [captain, setCaptain] = useState(null);
  const { width } = useWindowDimensions();

  useEffect(() => {
    getCurrentUser().then(setCaptain);
  }, []);

  async function handleLogout() {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <View style={styles.topLeft}>
          <View style={styles.avatar}>
            <Ionicons name="bicycle" size={20} color={colors.yellow} />
          </View>
          <View>
            <Text style={styles.greeting}>Hubli Rider</Text>
            <Text style={styles.name}>{captain?.name || 'Captain'}</Text>
          </View>
        </View>
        <View style={styles.toggleWrap}>
          <Text style={[styles.toggleLabel, { color: online ? colors.success : colors.grey }]}>
            {online ? 'Online' : 'Offline'}
          </Text>
          <Switch
            value={online}
            onValueChange={setOnline}
            trackColor={{ false: colors.border, true: colors.success }}
            thumbColor={colors.white}
          />
        </View>
        <TouchableOpacity onPress={handleLogout} style={{ marginLeft: 8 }}>
          <Ionicons name="log-out-outline" size={20} color={colors.black} />
        </TouchableOpacity>
      </View>

      <View style={styles.statRow}>
        {[
          { icon: 'wallet-outline', bg: colors.yellowLight, color: colors.yellowDark, value: '₹860', label: "Today's earnings" },
          { icon: 'checkmark-circle-outline', bg: colors.bikeBg, color: colors.bike, value: '12', label: 'Rides done' },
          { icon: 'star-outline', bg: colors.infoBg, color: colors.info, value: '4.8', label: 'Rating' },
        ].map(s => (
          <View key={s.label} style={[styles.statCard, shadow.card]}>
            <View style={[styles.statIcon, { backgroundColor: s.bg }]}>
              <Ionicons name={s.icon} size={18} color={s.color} />
            </View>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={type.small}>{s.label}</Text>
          </View>
        ))}
      </View>

      {online ? (
        <>
          <View style={styles.sectionRow}>
            <Text style={type.h3}>Nearby requests</Text>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Live</Text>
            </View>
          </View>
          <FlatList
            data={dummyRideRequests}
            keyExtractor={i => i.id}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingBottom: 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.reqCard, shadow.card]}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('IncomingRide', { request: item })}
              >
                <View style={styles.reqTop}>
                  <View style={styles.rideTypeBadge}>
                    <Text style={styles.rideTypeText}>{item.rideType}</Text>
                  </View>
                  <Text style={styles.fare}>₹{item.fare}</Text>
                </View>
                <View style={styles.routeWrap}>
                  <View style={styles.routeIconCol}>
                    <View style={styles.routeDotGreen} />
                    <View style={styles.routeLine} />
                    <View style={styles.routeDotRed} />
                  </View>
                  <View style={{ flex: 1, gap: 8 }}>
                    <Text style={type.body} numberOfLines={1}>{item.pickup}</Text>
                    <Text style={type.body} numberOfLines={1}>{item.drop}</Text>
                  </View>
                </View>
                <View style={styles.reqFooter}>
                  <Ionicons name="navigate-outline" size={12} color={colors.grey} />
                  <Text style={type.small}>{item.distance} · {item.eta}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </>
      ) : (
        <View style={styles.offlineWrap}>
          <View style={styles.offlineIcon}>
            <Ionicons name="moon" size={32} color={colors.greyLight} />
          </View>
          <Text style={[type.h3, { color: colors.grey, marginTop: 16 }]}>You're offline</Text>
          <Text style={[type.small, { marginTop: 6, textAlign: 'center' }]}>Toggle online to start receiving ride requests</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.yellow,
    paddingTop: 12, paddingHorizontal: 18, paddingBottom: 20,
    borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
  },
  topLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: colors.black,
    justifyContent: 'center', alignItems: 'center',
  },
  greeting: { fontSize: sf(11), fontWeight: '500', color: 'rgba(0,0,0,0.55)' },
  name: { fontSize: sf(15), fontWeight: '800', color: colors.black },
  toggleWrap: { alignItems: 'flex-end', gap: 2 },
  toggleLabel: { fontSize: sf(11), fontWeight: '700' },
  statRow: { flexDirection: 'row', gap: 10, padding: 16, flexWrap: 'wrap' },
  statCard: {
    flex: 1, backgroundColor: colors.card,
    borderRadius: radius.md, padding: 12, alignItems: 'flex-start', gap: 6,
  },
  statIcon: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  statValue: { fontSize: sf(20), fontWeight: '800', color: colors.black },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 10 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.successBg, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success },
  liveText: { fontSize: sf(11), fontWeight: '700', color: colors.success },
  reqCard: { backgroundColor: colors.card, borderRadius: radius.md, padding: 14 },
  reqTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  rideTypeBadge: { backgroundColor: colors.greyBg, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  rideTypeText: { fontSize: sf(12), fontWeight: '700', color: colors.charcoal },
  fare: { fontSize: sf(18), fontWeight: '800', color: colors.black },
  routeWrap: { flexDirection: 'row', gap: 12, marginBottom: 10 },
  routeIconCol: { alignItems: 'center', paddingTop: 3, gap: 2 },
  routeDotGreen: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
  routeLine: { width: 1.5, height: 18, backgroundColor: colors.border },
  routeDotRed: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.danger },
  reqFooter: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  offlineWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  offlineIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.greyBg, justifyContent: 'center', alignItems: 'center' },
});
