import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, type, shadow, sf } from '../../theme/theme';

const week = [
  { day: 'Mon', amount: 720 },
  { day: 'Tue', amount: 860 },
  { day: 'Wed', amount: 640 },
  { day: 'Thu', amount: 910 },
  { day: 'Fri', amount: 1120 },
  { day: 'Sat', amount: 1340 },
  { day: 'Sun', amount: 860 },
];
const max = Math.max(...week.map(w => w.amount));

export default function DriverEarningsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Ionicons name="bicycle" size={22} color={colors.black} />
            <Text style={styles.headerTitle}>Hubli Rider</Text>
          </View>
          <Text style={type.small}>This week's earnings</Text>
          <Text style={styles.total}>₹{week.reduce((a, b) => a + b.amount, 0).toLocaleString('en-IN')}</Text>
        </View>

        <View style={[styles.chartCard, shadow.card]}>
          <View style={styles.chartRow}>
            {week.map(w => (
              <View key={w.day} style={styles.barWrap}>
                <View style={[styles.bar, { height: (w.amount / max) * 110 }]} />
                <Text style={styles.barLabel}>{w.day}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Payout summary</Text>
        <View style={[styles.summaryCard, shadow.card]}>
          <Row label="Total trips" value="68" />
          <Row label="Online hours" value="41h 20m" />
          <Row label="Cash collected" value="₹2,140" />
          <Row label="Incentives earned" value="₹450" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={type.body}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { backgroundColor: colors.yellow, paddingTop: 16, paddingBottom: 24, paddingHorizontal: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  headerTitle: { fontSize: sf(18), fontWeight: '900', color: colors.black },
  total: { fontSize: sf(32), fontWeight: '900', color: colors.black, marginTop: 4 },
  chartCard: { backgroundColor: colors.card, margin: 20, borderRadius: radius.md, padding: 16 },
  chartRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 140 },
  barWrap: { alignItems: 'center', gap: 6 },
  bar: { width: 18, backgroundColor: colors.yellow, borderRadius: 6 },
  barLabel: { fontSize: sf(11), color: colors.grey, fontWeight: '600' },
  sectionTitle: { ...type.h3, paddingHorizontal: 20, marginBottom: 10 },
  summaryCard: { backgroundColor: colors.card, marginHorizontal: 20, marginBottom: 30, borderRadius: radius.md, padding: 16, gap: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  rowValue: { fontWeight: '700', color: colors.black },
});
