import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, sf } from '../../theme/theme';

export default function RegisterScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scroll}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={colors.black} />
        </TouchableOpacity>
        <View style={styles.logoRow}>
          <View style={styles.logoMark}><Ionicons name="flash" size={18} color={colors.black} /></View>
          <Text style={styles.logoText}>Hubli Rider</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>Create Your{'\n'}Hubli Rider Account</Text>
        <Text style={styles.subtitle}>Choose how you want to use Hubli Rider</Text>

        {/* User card */}
        <TouchableOpacity
          style={[styles.card, shadow.card]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('RegisterUser')}
        >
          <View style={[styles.iconWrap, { backgroundColor: colors.yellowLight }]}>
            <Ionicons name="person" size={28} color={colors.yellow} />
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>User</Text>
            <Text style={styles.cardDesc}>Book rides quickly and safely</Text>
            <View style={styles.featureRow}>
              {['Bike', 'Auto', 'Cab'].map(f => (
                <View key={f} style={styles.featurePill}>
                  <Text style={styles.featurePillText}>{f}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.arrow}>
            <Ionicons name="chevron-forward" size={18} color={colors.black} />
          </View>
        </TouchableOpacity>

        {/* Captain card */}
        <TouchableOpacity
          style={[styles.card, styles.captainCard, shadow.card]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('RegisterCaptain')}
        >
          <View style={[styles.iconWrap, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <Ionicons name="bicycle" size={28} color={colors.yellow} />
          </View>
          <View style={styles.cardBody}>
            <Text style={[styles.cardTitle, { color: colors.white }]}>Captain</Text>
            <Text style={[styles.cardDesc, { color: 'rgba(255,255,255,0.7)' }]}>Drive with Hubli Rider and earn money</Text>
            <View style={styles.featureRow}>
              {['Flexible hours', 'Daily payouts'].map(f => (
                <View key={f} style={[styles.featurePill, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
                  <Text style={[styles.featurePillText, { color: colors.yellow }]}>{f}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={[styles.arrow, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <Ionicons name="chevron-forward" size={18} color={colors.white} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLinkText}>Already have an account? <Text style={{ color: colors.black, fontWeight: '700' }}>Login</Text></Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1 },
  header: {
    backgroundColor: colors.yellow,
    paddingTop: 16, paddingBottom: 24, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
  },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.1)', justifyContent: 'center', alignItems: 'center' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoMark: { width: 30, height: 30, borderRadius: 8, backgroundColor: colors.black, justifyContent: 'center', alignItems: 'center' },
  logoText: { fontSize: 20, fontWeight: '900', color: colors.black },
  body: { padding: 20 },
  title: { fontSize: 26, fontWeight: '900', color: colors.black, letterSpacing: -0.5, lineHeight: 34, marginTop: 8, marginBottom: 6 },
  subtitle: { fontSize: 14, color: colors.grey, marginBottom: 28 },
  card: {
    backgroundColor: colors.white, borderRadius: radius.lg,
    padding: 20, marginBottom: 16,
    flexDirection: 'row', alignItems: 'center', gap: 16,
    borderWidth: 1, borderColor: colors.border,
  },
  captainCard: { backgroundColor: colors.black, borderColor: colors.black },
  iconWrap: { width: 56, height: 56, borderRadius: radius.md, justifyContent: 'center', alignItems: 'center' },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: colors.black, marginBottom: 4 },
  cardDesc: { fontSize: 13, color: colors.grey, marginBottom: 10 },
  featureRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  featurePill: { backgroundColor: colors.greyBg, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3 },
  featurePillText: { fontSize: 11, fontWeight: '600', color: colors.charcoal },
  arrow: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.greyBg, justifyContent: 'center', alignItems: 'center' },
  loginLink: { alignItems: 'center', marginTop: 8 },
  loginLinkText: { fontSize: 13, color: colors.grey },
});
