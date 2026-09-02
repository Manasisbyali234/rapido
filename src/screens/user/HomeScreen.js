import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, type, shadow } from '../../theme/theme';
import { rideTypes } from '../../data/dummyData';
import MapView from '../../components/MapView';

export default function HomeScreen({ navigation }) {
  const [pickup, setPickup] = useState('Koramangala 5th Block');
  const [drop, setDrop] = useState('');
  const [selected, setSelected] = useState('auto');
  const [dropFocused, setDropFocused] = useState(false);

  const selectedRide = rideTypes.find(r => r.id === selected);

  const rideAccent = { bike: colors.bike, auto: colors.yellow, cab_economy: colors.cab, cab_premium: colors.cab };
  const rideBg = { bike: colors.bikeBg, auto: colors.autoBg, cab_economy: colors.cabBg, cab_premium: colors.cabBg };

  return (
    <View style={styles.container}>
      <View style={styles.map}>
        <MapView
          style={StyleSheet.absoluteFill}
          pickup={{ lat: 12.9352, lng: 77.6245, label: pickup || 'Pickup' }}
        />
        <TouchableOpacity style={[styles.menuBtn, shadow.card]}>
          <Ionicons name="menu" size={20} color={colors.black} />
        </TouchableOpacity>
        <View style={[styles.mapBadge, shadow.sm]}>
          <View style={styles.onlineDot} />
          <Text style={styles.mapBadgeText}>Live tracking</Text>
        </View>
      </View>

      {/* Bottom sheet */}
      <View style={[styles.sheet, shadow.lg]}>
        <View style={styles.sheetHandle} />

        {/* Location inputs */}
        <View style={[styles.locBox, shadow.sm]}>
          <View style={styles.locRow}>
            <View style={styles.dotGreen} />
            <TextInput
              style={styles.locInput}
              value={pickup}
              onChangeText={setPickup}
              placeholder="Pickup location"
              placeholderTextColor={colors.greyLight}
            />
          </View>
          <View style={styles.locDivider}>
            <View style={styles.locDividerLine} />
            <Ionicons name="swap-vertical" size={14} color={colors.grey} style={styles.swapIcon} />
          </View>
          <View style={styles.locRow}>
            <View style={styles.dotRed} />
            <TextInput
              style={[styles.locInput, dropFocused && { color: colors.black }]}
              value={drop}
              onChangeText={setDrop}
              placeholder="Where to?"
              placeholderTextColor={colors.greyLight}
              onFocus={() => setDropFocused(true)}
              onBlur={() => setDropFocused(false)}
            />
            {drop.length > 0 && (
              <TouchableOpacity onPress={() => setDrop('')}>
                <Ionicons name="close-circle" size={16} color={colors.greyLight} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Text style={styles.sectionLabel}>Choose a ride</Text>

        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {rideTypes.map(r => {
            const isActive = selected === r.id;
            return (
              <TouchableOpacity
                key={r.id}
                style={[styles.rideCard, isActive && { borderColor: rideAccent[r.id] || colors.yellow, backgroundColor: rideBg[r.id] || colors.yellowLight }]}
                onPress={() => setSelected(r.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.rideIconWrap, { backgroundColor: isActive ? (rideBg[r.id] || colors.yellowLight) : colors.greyBg }]}>
                  <Text style={styles.rideIcon}>{r.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={type.h3}>{r.label}</Text>
                  <Text style={[type.small, { marginTop: 2 }]}>{r.desc} · {r.eta} away</Text>
                </View>
                <View style={styles.priceCol}>
                  <Text style={styles.ridePrice}>₹{r.price}</Text>
                  {isActive && <View style={styles.selectedDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
          <View style={{ height: 8 }} />
        </ScrollView>

        <TouchableOpacity
          style={[styles.bookBtn, !drop && styles.bookBtnDisabled]}
          disabled={!drop}
          onPress={() => navigation.navigate('Finding', { ride: selectedRide, pickup, drop })}
          activeOpacity={0.85}
        >
          <Text style={[styles.bookBtnText, !drop && { color: colors.greyLight }]}>
            {drop ? `Book ${selectedRide.label}  ·  ₹${selectedRide.price}` : 'Enter a drop location'}
          </Text>
          {drop && <Ionicons name="arrow-forward" size={18} color={colors.black} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  map: { height: '34%', backgroundColor: '#C8DDD0', overflow: 'hidden' },
  menuBtn: {
    position: 'absolute', top: 48, left: 18,
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: colors.white,
    justifyContent: 'center', alignItems: 'center',
  },
  mapBadge: {
    position: 'absolute', top: 52, right: 18,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: colors.white, borderRadius: radius.pill,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success },
  mapBadgeText: { fontSize: 11, fontWeight: '600', color: colors.black },
  sheet: {
    flex: 1, backgroundColor: colors.white,
    marginTop: -20, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 18, paddingTop: 10, paddingBottom: 16,
  },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: 14 },
  locBox: {
    borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.md, marginBottom: 16,
    backgroundColor: colors.white,
  },
  locRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 11, gap: 10 },
  dotGreen: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.success },
  dotRed: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.danger },
  locInput: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.black },
  locDivider: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 },
  locDividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  swapIcon: { marginHorizontal: 8 },
  sectionLabel: { ...type.label, marginBottom: 10 },
  rideCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 12, borderRadius: radius.md,
    borderWidth: 1.5, borderColor: colors.border,
    marginBottom: 8,
  },
  rideIconWrap: { width: 44, height: 44, borderRadius: radius.sm, justifyContent: 'center', alignItems: 'center' },
  rideIcon: { fontSize: 24 },
  priceCol: { alignItems: 'flex-end', gap: 4 },
  ridePrice: { fontSize: 15, fontWeight: '800', color: colors.black },
  selectedDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.yellow },
  bookBtn: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
    backgroundColor: colors.yellow, borderRadius: radius.pill,
    paddingVertical: 15, marginTop: 4,
  },
  bookBtnDisabled: { backgroundColor: colors.greyBg },
  bookBtnText: { fontSize: 15, fontWeight: '800', color: colors.black },
});
