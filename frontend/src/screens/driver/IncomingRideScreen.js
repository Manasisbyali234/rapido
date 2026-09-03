import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, type, shadow, sf } from '../../theme/theme';
import SwipeButton from '../../components/SwipeButton';

export default function IncomingRideScreen({ route, navigation }) {
  const { request } = route.params;
  const [seconds, setSeconds] = useState(15);

  useEffect(() => {
    const t = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) { clearInterval(t); navigation.goBack(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.inner}>
        <View style={styles.timerRow}>
          <Text style={type.label}>NEW RIDE REQUEST</Text>
          <View style={styles.timerBadge}>
            <Text style={styles.timerText}>{seconds}s</Text>
          </View>
        </View>

        <View style={[styles.card, shadow.card]}>
          <View style={styles.riderRow}>
            <View style={styles.avatar}>
              <Text style={{ fontWeight: '800', fontSize: sf(18) }}>{request.riderName.split(' ').map(n => n[0]).join('')}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={type.h3}>{request.riderName}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name="star" size={12} color={colors.yellowDark} />
                <Text style={type.small}>{request.riderRating}</Text>
              </View>
            </View>
            <Text style={styles.fare}>₹{request.fare}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.routeRow}>
            <Ionicons name="ellipse" size={8} color={colors.success} />
            <Text style={[type.body, { flex: 1 }]}>{request.pickup}</Text>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.routeRow}>
            <Ionicons name="location" size={12} color={colors.danger} />
            <Text style={[type.body, { flex: 1 }]}>{request.drop}</Text>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={type.label}>DISTANCE</Text>
              <Text style={type.h3}>{request.distance}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={type.label}>RIDE TYPE</Text>
              <Text style={type.h3}>{request.rideType}</Text>
            </View>
          </View>
        </View>

        <View style={styles.swipeWrap}>
          <SwipeButton
            label="Swipe to accept ride"
            color={colors.success}
            onSwipeSuccess={() => navigation.replace('ActiveRide', { request })}
          />
          <TouchableOpacity style={styles.declineBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.declineText}>Decline</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  inner: { flex: 1, padding: 20, paddingTop: 16 },
  timerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  timerBadge: { backgroundColor: colors.black, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 5 },
  timerText: { color: colors.white, fontWeight: '800', fontSize: sf(13) },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 18 },
  riderRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.autoBg, justifyContent: 'center', alignItems: 'center' },
  fare: { fontSize: sf(20), fontWeight: '800', color: colors.black },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 16 },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  routeLine: { width: 1, height: 18, backgroundColor: colors.border, marginLeft: 4, marginVertical: 2 },
  metaRow: { flexDirection: 'row', gap: 24, marginTop: 18 },
  metaItem: { gap: 2 },
  swipeWrap: { marginTop: 'auto', marginBottom: 16, alignItems: 'center', gap: 14 },
  declineBtn: { paddingVertical: 8 },
  declineText: { color: colors.danger, fontWeight: '700', fontSize: sf(14) },
});
