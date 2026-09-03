import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, sf } from '../../theme/theme';
import { getCaptains } from '../../utils/authStore';
import * as api from '../../utils/api';

export default function DriversListScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [allDrivers, setAllDrivers] = useState([]);

  React.useEffect(() => {
    api.adminGetDrivers ? api.adminGetDrivers()
      .then(data => setAllDrivers(data.map(d => ({ ...d, id: d._id || d.id }))))
      .catch(() => getCaptains().then(setAllDrivers))
      : getCaptains().then(setAllDrivers);
  }, []);

  const filtered = useMemo(() => {
    return allDrivers.filter(d => {
      const matchQ = (d.name || '').toLowerCase().includes(query.toLowerCase()) || (d.vehicleNumber || d.number || '').toLowerCase().includes(query.toLowerCase());
      const matchF = filter === 'all' || d.status === filter;
      return matchQ && matchF;
    });
  }, [query, filter, allDrivers]);

  const onlineCount = allDrivers.filter(d => d.status === 'online').length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Captains</Text>
          <View style={styles.onlineBadge}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>{onlineCount} online</Text>
          </View>
        </View>
        <Text style={styles.sub}>{allDrivers.length} total captains registered</Text>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={16} color="#555" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search name or vehicle number..."
            placeholderTextColor="#555"
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={16} color="#555" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.filterRow}>
        {['all', 'online', 'offline'].map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            {f === 'online' && <View style={[styles.filterDot, { backgroundColor: colors.success }]} />}
            {f === 'offline' && <View style={[styles.filterDot, { backgroundColor: '#444' }]} />}
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={d => d.id}
        contentContainerStyle={{ padding: 14, gap: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('DriverDetail', { driver: item })}
            activeOpacity={0.75}
          >
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name.split(' ').map(n => n[0]).join('')}</Text>
              </View>
              <View style={[styles.statusDot, { backgroundColor: item.status === 'online' ? colors.success : '#333' }]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.vehicleText}>{item.vehicle || item.vehicleType} · {item.vehicleNumber || item.number}</Text>
              <View style={styles.metaRow}>
                <Ionicons name="star" size={10} color={colors.yellow} />
                <Text style={styles.metaText}>{item.rating} · {item.rides} rides</Text>
              </View>
            </View>
            <View style={styles.rightCol}>
              {item.earningsToday > 0 ? (
                <Text style={styles.earnings}>₹{item.earningsToday}</Text>
              ) : (
                <Text style={styles.earningsZero}>—</Text>
              )}
              <Text style={styles.earningsLabel}>today</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="bicycle-outline" size={32} color="#333" />
            <Text style={styles.emptyText}>No captains found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingTop: 16, paddingHorizontal: 18, paddingBottom: 16 },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  title: { fontSize: 24, fontWeight: '900', color: colors.black },
  onlineBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.successBg, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: '#BBF7D0' },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success },
  onlineText: { fontSize: 11, fontWeight: '700', color: colors.success },
  sub: { fontSize: 12, color: colors.grey },
  searchRow: { paddingHorizontal: 14, marginBottom: 10 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.white, borderRadius: radius.sm,
    paddingHorizontal: 12, paddingVertical: 10,
    borderWidth: 1, borderColor: colors.border,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.black },
  filterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 14, marginBottom: 6 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  filterBtnActive: { backgroundColor: colors.yellow, borderColor: colors.yellow },
  filterDot: { width: 6, height: 6, borderRadius: 3 },
  filterText: { fontSize: 12, fontWeight: '600', color: colors.grey },
  filterTextActive: { color: colors.black },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.white, borderRadius: radius.md,
    padding: 14, borderWidth: 1, borderColor: colors.border,
  },
  avatarWrap: { position: 'relative' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFC40022', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontWeight: '800', fontSize: 14, color: colors.yellow },
  statusDot: { width: 11, height: 11, borderRadius: 6, borderWidth: 2, borderColor: colors.bg, position: 'absolute', bottom: -1, right: -1 },
  name: { fontSize: 14, fontWeight: '700', color: colors.black },
  vehicleText: { fontSize: 11, color: colors.grey, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  metaText: { fontSize: 11, color: colors.grey },
  rightCol: { alignItems: 'flex-end' },
  earnings: { fontSize: 15, fontWeight: '800', color: colors.yellow },
  earningsZero: { fontSize: 15, fontWeight: '800', color: colors.greyLight },
  earningsLabel: { fontSize: 10, color: colors.grey, marginTop: 2 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyText: { fontSize: 14, color: colors.grey },
});
