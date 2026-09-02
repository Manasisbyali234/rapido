import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, type, shadow } from '../../theme/theme';

const menu = [
  { icon: 'wallet-outline', label: 'Payments & wallet' },
  { icon: 'pricetag-outline', label: 'Offers & coupons' },
  { icon: 'shield-checkmark-outline', label: 'Safety center' },
  { icon: 'help-circle-outline', label: 'Help & support' },
  { icon: 'settings-outline', label: 'Settings' },
];

export default function ProfileScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={{ fontSize: 26, fontWeight: '800' }}>AR</Text>
        </View>
        <Text style={type.h2}>Ananya Rao</Text>
        <Text style={type.small}>+91 98765 43210</Text>
      </View>

      <View style={styles.menu}>
        {menu.map(m => (
          <TouchableOpacity key={m.label} style={[styles.item, shadow.card]}>
            <Ionicons name={m.icon} size={20} color={colors.black} />
            <Text style={styles.itemText}>{m.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.grey} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.logout}
          onPress={() => navigation.getParent()?.getParent()?.reset({ index: 0, routes: [{ name: 'RoleSelect' }] })}
        >
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { backgroundColor: colors.yellow, alignItems: 'center', paddingTop: 60, paddingBottom: 28, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  menu: { padding: 20, gap: 10 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.card, padding: 14, borderRadius: radius.md },
  itemText: { fontSize: 15, fontWeight: '600', color: colors.black },
  logout: { marginTop: 16, alignItems: 'center', paddingVertical: 14 },
  logoutText: { color: colors.danger, fontWeight: '700', fontSize: 15 },
});
