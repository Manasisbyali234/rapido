import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { colors, radius, type, shadow } from '../../theme/theme';

const history = [
  { id: '1', label: 'Auto', icon: '🛺', date: 'Today, 9:14 AM', from: 'Koramangala', to: 'Indiranagar', price: 68 },
  { id: '2', label: 'Bike', icon: '🏍️', date: 'Yesterday, 6:40 PM', from: 'HSR Layout', to: 'BTM Layout', price: 38 },
  { id: '3', label: 'Cab Economy', icon: '🚗', date: '3 Sep, 8:02 AM', from: 'Whitefield', to: 'MG Road', price: 245 },
  { id: '4', label: 'Auto', icon: '🛺', date: '1 Sep, 7:15 PM', from: 'Jayanagar', to: 'JP Nagar', price: 54 },
];

export default function RideHistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={[type.h1, { padding: 20, paddingBottom: 8 }]}>Your rides</Text>
      <FlatList
        data={history}
        keyExtractor={i => i.id}
        contentContainerStyle={{ padding: 20, paddingTop: 8, gap: 12 }}
        renderItem={({ item }) => (
          <View style={[styles.card, shadow.card]}>
            <Text style={styles.icon}>{item.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={type.h3}>{item.label}</Text>
              <Text style={type.small}>{item.date}</Text>
              <Text style={type.small} numberOfLines={1}>{item.from} → {item.to}</Text>
            </View>
            <Text style={styles.price}>₹{item.price}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radius.md, padding: 14 },
  icon: { fontSize: 26, width: 36, textAlign: 'center' },
  price: { fontWeight: '800', fontSize: 15, color: colors.black },
});
