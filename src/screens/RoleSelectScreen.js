import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, type, shadow } from '../theme/theme';

const options = [
  { key: 'User',   title: 'Rider',   desc: 'Book bike, auto or cab rides',  icon: 'person',            accent: colors.yellow,  bg: colors.yellowLight },
  { key: 'Driver', title: 'Captain', desc: 'Go online and earn money',       icon: 'bicycle',           accent: colors.bike,    bg: colors.bikeBg },
  { key: 'Admin',  title: 'Admin',   desc: 'Manage platform & analytics',    icon: 'shield-checkmark',  accent: colors.cab,     bg: colors.cabBg },
];

export default function RoleSelectScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.yellow} />

      <View style={styles.hero}>
        <View style={styles.logoRow}>
          <View style={styles.logoMark}>
            <Ionicons name="flash" size={20} color={colors.black} />
          </View>
          <Text style={styles.logoText}>Rapydo</Text>
        </View>
        <Text style={styles.heroTitle}>Fast rides,{'\n'}anywhere.</Text>
        <View style={styles.tagRow}>
          {['Bike', 'Auto', 'Cab'].map(t => (
            <View key={t} style={styles.tag}><Text style={styles.tagText}>{t}</Text></View>
          ))}
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.sectionLabel}>Continue as</Text>
        {options.map(opt => (
          <TouchableOpacity
            key={opt.key}
            style={[styles.card, shadow.card]}
            activeOpacity={0.75}
            onPress={() => navigation.navigate(opt.key)}
          >
            <View style={[styles.iconWrap, { backgroundColor: opt.bg }]}>
              <Ionicons name={opt.icon} size={22} color={opt.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={type.h3}>{opt.title}</Text>
              <Text style={[type.small, { marginTop: 2 }]}>{opt.desc}</Text>
            </View>
            <View style={styles.arrow}>
              <Ionicons name="chevron-forward" size={16} color={colors.grey} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.footer}>Demo build · dummy data only</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  hero: {
    backgroundColor: colors.yellow,
    paddingTop: 64,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  logoMark: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: colors.black,
    justifyContent: 'center', alignItems: 'center',
  },
  logoText: { fontSize: 20, fontWeight: '900', color: colors.black, letterSpacing: -0.5 },
  heroTitle: { fontSize: 34, fontWeight: '900', color: colors.black, letterSpacing: -1, lineHeight: 40, marginBottom: 16 },
  tagRow: { flexDirection: 'row', gap: 8 },
  tag: { backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 4 },
  tagText: { fontSize: 12, fontWeight: '700', color: colors.black },
  body: { padding: 20, gap: 12, flex: 1 },
  sectionLabel: { ...type.label, marginBottom: 4, marginTop: 4 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 16,
  },
  iconWrap: {
    width: 44, height: 44, borderRadius: radius.sm,
    justifyContent: 'center', alignItems: 'center',
  },
  arrow: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.greyBg,
    justifyContent: 'center', alignItems: 'center',
  },
  footer: { textAlign: 'center', color: colors.greyLight, marginBottom: 24, fontSize: 11 },
});
