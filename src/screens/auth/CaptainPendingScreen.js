import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, sf } from '../../theme/theme';
import { logout } from '../../utils/authStore';

export default function CaptainPendingScreen({ navigation }) {
  async function handleLogout() {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoMark}><Ionicons name="bicycle" size={20} color={colors.yellow} /></View>
          <Text style={styles.logoText}>Hubli Rider</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={[styles.card, shadow.card]}>
          <View style={styles.iconWrap}>
            <Ionicons name="time-outline" size={48} color={colors.yellow} />
          </View>
          <Text style={styles.title}>Registration{'\n'}Submitted</Text>
          <Text style={styles.subtitle}>
            Your captain account is pending admin approval.{'\n\n'}
            We'll notify you once your account is reviewed. This usually takes 24–48 hours.
          </Text>

          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Pending Review</Text>
          </View>

          <View style={styles.stepsWrap}>
            {[
              { icon: 'checkmark-circle', label: 'Registration submitted', done: true },
              { icon: 'time-outline', label: 'Admin review in progress', done: false },
              { icon: 'bicycle-outline', label: 'Start accepting rides', done: false },
            ].map((s, i) => (
              <View key={i} style={styles.stepRow}>
                <Ionicons name={s.icon} size={20} color={s.done ? colors.success : colors.greyLight} />
                <Text style={[styles.stepText, !s.done && { color: colors.greyLight }]}>{s.label}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
            <Ionicons name="log-out-outline" size={16} color={colors.grey} />
            <Text style={styles.logoutText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: {
    backgroundColor: colors.black, paddingTop: 16, paddingBottom: 24,
    paddingHorizontal: 24, borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoMark: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,196,0,0.15)', justifyContent: 'center', alignItems: 'center' },
  logoText: { fontSize: 22, fontWeight: '900', color: colors.yellow },
  body: { flex: 1, padding: 20, justifyContent: 'center' },
  card: { backgroundColor: colors.white, borderRadius: radius.xl, padding: 28, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  iconWrap: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.yellowLight, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '900', color: colors.black, textAlign: 'center', letterSpacing: -0.5, lineHeight: 32, marginBottom: 12 },
  subtitle: { fontSize: 13, color: colors.grey, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FEF9C3', borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 7, marginBottom: 24 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#CA8A04' },
  statusText: { fontSize: 12, fontWeight: '700', color: '#92400E' },
  stepsWrap: { width: '100%', gap: 12, marginBottom: 28 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepText: { fontSize: 13, fontWeight: '500', color: colors.black },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoutText: { fontSize: 13, fontWeight: '600', color: colors.grey },
});
