import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, shadow, type } from '../theme/theme';

export default function StatCard({ label, value, accent = colors.yellow }) {
  return (
    <View style={[styles.card, shadow.card]}>
      <View style={[styles.bar, { backgroundColor: accent }]} />
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: '47%',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 12,
    overflow: 'hidden',
  },
  bar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  value: { ...type.h1, fontSize: 24, marginLeft: 6 },
  label: { ...type.small, marginLeft: 6, marginTop: 2 },
});
