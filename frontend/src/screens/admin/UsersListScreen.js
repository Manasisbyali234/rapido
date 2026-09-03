import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, type, shadow, sf } from '../../theme/theme';
import { getAllUsers } from '../../utils/authStore';
import * as api from '../../utils/api';

const AVATAR_COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];

export default function UsersListScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await api.adminGetUsers();
      // Normalize Atlas _id → id for compatibility
      setAllUsers(data.map(u => ({ ...u, id: u._id || u.id })));
    } catch {
      // Backend unreachable — fall back to local merged list
      getAllUsers().then(setAllUsers);
    }
  }

  const filtered = useMemo(() => {
    return allUsers.filter(u => {
      const matchQ = u.name.toLowerCase().includes(query.toLowerCase()) || u.phone.includes(query);
      const matchF = filter === 'all' || u.status === filter;
      return matchQ && matchF;
    });
  }, [query, filter, allUsers]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Users</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{allUsers.length}</Text>
        </View>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={16} color="#555" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search name or phone..."
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
        {['all', 'active', 'blocked'].map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={u => u.id}
        contentContainerStyle={{ padding: 14, gap: 8 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('UserDetail', { user: item })}
            activeOpacity={0.75}
          >
            <View style={[styles.avatar, { backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length] + '33' }]}>
              <Text style={[styles.avatarText, { color: AVATAR_COLORS[index % AVATAR_COLORS.length] }]}>
                {item.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.sub}>+91 {item.phone} · {item.rides} rides</Text>
            </View>
            <View style={[styles.badge, item.status === 'active' ? styles.badgeActive : styles.badgeBlocked]}>
              <View style={[styles.badgeDot, { backgroundColor: item.status === 'active' ? colors.success : colors.danger }]} />
              <Text style={[styles.badgeText, { color: item.status === 'active' ? colors.success : colors.danger }]}>
                {item.status}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={32} color="#333" />
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 16, paddingHorizontal: 18, paddingBottom: 16 },
  title: { fontSize: 24, fontWeight: '900', color: colors.black },
  countBadge: { backgroundColor: colors.greyBg, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3 },
  countText: { fontSize: 13, fontWeight: '700', color: colors.charcoal },
  searchRow: { paddingHorizontal: 14, marginBottom: 10 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.white, borderRadius: radius.sm,
    paddingHorizontal: 12, paddingVertical: 10,
    borderWidth: 1, borderColor: colors.border,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.black },
  filterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 14, marginBottom: 6 },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  filterBtnActive: { backgroundColor: colors.yellow, borderColor: colors.yellow },
  filterText: { fontSize: 12, fontWeight: '600', color: colors.grey },
  filterTextActive: { color: colors.black },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.white, borderRadius: radius.md,
    padding: 14, borderWidth: 1, borderColor: colors.border,
  },
  avatar: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontWeight: '800', fontSize: 14 },
  name: { fontSize: 14, fontWeight: '700', color: colors.black },
  sub: { fontSize: 11, fontWeight: '400', color: colors.grey, marginTop: 2 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill },
  badgeActive: { backgroundColor: colors.successBg },
  badgeBlocked: { backgroundColor: colors.dangerBg },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  empty: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyText: { fontSize: 14, color: colors.grey },
});
