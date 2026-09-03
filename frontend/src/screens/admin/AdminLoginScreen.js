import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, sf } from '../../theme/theme';
import { adminLogin } from '../../utils/authStore';
import * as api from '../../utils/api';

export default function AdminLoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    try {
      const res = await api.adminLogin(email.trim(), password);
      await api.saveSession(res.token, { email: email.trim(), name: 'Admin', role: 'admin' });
      navigation.reset({ index: 0, routes: [{ name: 'AdminDashboard' }] });
    } catch (e) {
      const ok = await adminLogin(email.trim(), password);
      if (ok) {
        navigation.reset({ index: 0, routes: [{ name: 'AdminDashboard' }] });
      } else {
        Alert.alert('Login Failed', e.message || 'Invalid credentials.');
      }
    }
    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={20} color={colors.grey} />
      </TouchableOpacity>

      <View style={styles.topSection}>
        <View style={styles.logoWrap}>
          <Ionicons name="bicycle" size={28} color={colors.black} />
        </View>
        <Text style={styles.brand}>Hubli Rider</Text>
        <Text style={styles.brandSub}>Admin Console</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Admin Sign In</Text>
        <Text style={styles.cardSub}>Access the Hubli Rider management dashboard</Text>

        <Text style={styles.label}>Email address</Text>
        <View style={[styles.inputWrap, focused === 'email' && styles.inputFocused]}>
          <Ionicons name="mail-outline" size={16} color={colors.grey} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="admin@hublirider.com"
            placeholderTextColor={colors.greyLight}
            onFocus={() => setFocused('email')}
            onBlur={() => setFocused(null)}
          />
        </View>

        <Text style={styles.label}>Password</Text>
        <View style={[styles.inputWrap, focused === 'pass' && styles.inputFocused]}>
          <Ionicons name="lock-closed-outline" size={16} color={colors.grey} style={{ marginRight: 8 }} />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPass}
            placeholder="••••••••"
            placeholderTextColor={colors.greyLight}
            onFocus={() => setFocused('pass')}
            onBlur={() => setFocused(null)}
          />
          <TouchableOpacity onPress={() => setShowPass(p => !p)}>
            <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={16} color={colors.grey} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Sign in to Console'}</Text>
          {!loading && <Ionicons name="arrow-forward" size={16} color={colors.black} />}
        </TouchableOpacity>

        <View style={styles.hint}>
          <Ionicons name="information-circle-outline" size={13} color={colors.grey} />
          <Text style={styles.hintText}>Demo: admin@hublirider.com / 1234</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', padding: 24 },
  backBtn: { position: 'absolute', top: 56, left: 20, width: 36, height: 36, borderRadius: 10, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  topSection: { alignItems: 'center', marginBottom: 32 },
  logoWrap: { width: 56, height: 56, borderRadius: 16, backgroundColor: colors.yellow, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  brand: { fontSize: sf(26), fontWeight: '900', color: colors.black, letterSpacing: -0.5 },
  brandSub: { fontSize: sf(13), fontWeight: '500', color: colors.grey, marginTop: 4 },
  card: { backgroundColor: colors.white, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: colors.border },
  cardTitle: { fontSize: sf(20), fontWeight: '800', color: colors.black, marginBottom: 4 },
  cardSub: { fontSize: sf(12), color: colors.grey, marginBottom: 20 },
  label: { fontSize: sf(12), fontWeight: '600', color: colors.grey, marginBottom: 6, marginTop: 14, letterSpacing: 0.4 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.greyBg, borderRadius: radius.sm,
    paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1.5, borderColor: colors.border,
  },
  inputFocused: { borderColor: colors.yellow },
  input: { flex: 1, color: colors.black, fontSize: sf(14), fontWeight: '500' },
  button: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
    backgroundColor: colors.yellow, borderRadius: radius.pill,
    paddingVertical: 14, marginTop: 24,
  },
  buttonText: { fontSize: sf(15), fontWeight: '800', color: colors.black },
  hint: { flexDirection: 'row', alignItems: 'center', gap: 5, justifyContent: 'center', marginTop: 14 },
  hintText: { fontSize: sf(11), color: colors.grey },
});
