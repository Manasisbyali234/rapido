import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, type, radius, sf } from '../../theme/theme';
import { drivers } from '../../data/dummyData';

export default function FindingDriverScreen({ route, navigation }) {
  const { ride, pickup, drop } = route.params;
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 1400, easing: Easing.linear, useNativeDriver: true })
    ).start();

    const t = setTimeout(() => {
      const pool = drivers.filter(d => d.status === 'online');
      const driver = pool[Math.floor(Math.random() * pool.length)];
      navigation.replace('Tracking', { ride, pickup, drop, driver });
    }, 2600);

    return () => clearTimeout(t);
  }, []);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.inner}>
        <View style={styles.spinnerWrap}>
          <Animated.View style={[styles.ring, { transform: [{ rotate }] }]} />
          <View style={styles.iconWrap}>
            <Ionicons name={ride.ionicon || 'bicycle'} size={36} color={colors.black} />
          </View>
        </View>
        <Text style={type.h2}>Finding your {ride.label}</Text>
        <Text style={[type.body, { marginTop: 6, textAlign: 'center' }]}>Matching you with a nearby Hubli Rider captain...</Text>

        <View style={styles.tripCard}>
          <Text style={type.label}>PICKUP</Text>
          <Text style={type.body}>{pickup}</Text>
          <View style={{ height: 10 }} />
          <Text style={type.label}>DROP</Text>
          <Text style={type.body}>{drop}</Text>
        </View>

        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel search</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  spinnerWrap: { width: 120, height: 120, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  ring: {
    position: 'absolute',
    width: 120, height: 120,
    borderRadius: 60,
    borderWidth: 6,
    borderColor: colors.yellow,
    borderTopColor: colors.border,
  },
  iconWrap: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: colors.yellowLight,
    justifyContent: 'center', alignItems: 'center',
  },
  tripCard: {
    width: '100%',
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    padding: 16,
    marginTop: 32,
  },
  cancelBtn: { marginTop: 28, paddingVertical: 12, paddingHorizontal: 24 },
  cancelText: { color: colors.danger, fontWeight: '700', fontSize: sf(15) },
});
