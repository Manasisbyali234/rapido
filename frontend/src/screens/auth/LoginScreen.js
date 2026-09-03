import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, type, shadow, sf } from '../../theme/theme';
import { loginUser, loginCaptain } from '../../utils/authStore';

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [focused, setFocused] = useState(false);
  const valid = phone.length === 10;

  async function handleSendOtp() {
    if (!valid) return;
    // Just go to OTP — we verify identity after OTP is confirmed
    navigation.navigate('OtpVerify', { phone, flow: 'login', role: 'user' });
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={styles.logoMark}><Ionicons name="flash" size={20} color={colors.black} /></View>
            <Text style={styles.logoText}>Hubli Rider</Text>
          </View>
          <Text style={styles.tagline}>Fast rides across Hubli</Text>
        </View>

        {/* Card */}
        <View style={[styles.card, shadow.card]}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Login to continue to Hubli Rider</Text>

          <Text style={styles.label}>Mobile Number</Text>
          <View style={[styles.inputRow, focused && styles.inputFocused]}>
            <Text style={styles.flag}>🇮🇳 +91</Text>
            <View style={styles.divider} />
            <TextInput
              style={styles.input}
              placeholder="98765 43210"
              placeholderTextColor={colors.greyLight}
              keyboardType="number-pad"
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
            {valid && <Ionicons name="checkmark-circle" size={20} color={colors.success} style={{ marginRight: 12 }} />}
          </View>

          <TouchableOpacity
            style={[styles.btn, !valid && styles.btnDisabled]}
            disabled={!valid}
            onPress={handleSendOtp}
            activeOpacity={0.85}
          >
            <Text style={[styles.btnText, !valid && styles.btnTextDisabled]}>Send OTP</Text>
            <Ionicons name="arrow-forward" size={18} color={valid ? colors.black : colors.greyLight} />
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.line} /><Text style={styles.orText}>OR</Text><View style={styles.line} />
          </View>

          <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.navigate('Register')} activeOpacity={0.8}>
            <Text style={styles.secondaryBtnText}>Create New Account</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.adminLink} onPress={() => navigation.navigate('Admin')} activeOpacity={0.7}>
            <Ionicons name="shield-checkmark-outline" size={14} color={colors.grey} />
            <Text style={styles.adminLinkText}>Admin Login</Text>
          </TouchableOpacity>
        </View>

          <Text style={styles.footer}>Hubli Rider · Demo build</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1, padding: 20 },
  header: {
    backgroundColor: colors.yellow,
    marginHorizontal: -20, marginTop: -20,
    paddingTop: 32, paddingBottom: 40, paddingHorizontal: 24,
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
    marginBottom: 28, alignItems: 'center',
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  logoMark: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.black, justifyContent: 'center', alignItems: 'center' },
  logoText: { fontSize: 26, fontWeight: '900', color: colors.black, letterSpacing: -0.5 },
  tagline: { fontSize: 14, fontWeight: '500', color: 'rgba(0,0,0,0.6)' },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 24, borderWidth: 1, borderColor: colors.border },
  title: { fontSize: 22, fontWeight: '800', color: colors.black, marginBottom: 4 },
  subtitle: { fontSize: 13, color: colors.grey, marginBottom: 24 },
  label: { fontSize: 12, fontWeight: '600', color: colors.grey, marginBottom: 8, letterSpacing: 0.4 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.md, backgroundColor: colors.white,
    marginBottom: 20, overflow: 'hidden',
  },
  inputFocused: { borderColor: colors.yellow },
  flag: { fontSize: 14, fontWeight: '700', color: colors.black, paddingHorizontal: 12 },
  divider: { width: 1, height: 20, backgroundColor: colors.border },
  input: { flex: 1, paddingHorizontal: 12, paddingVertical: 14, fontSize: 16, fontWeight: '600', color: colors.black },
  btn: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
    backgroundColor: colors.yellow, borderRadius: radius.pill, paddingVertical: 15,
  },
  btnDisabled: { backgroundColor: colors.greyBg },
  btnText: { fontSize: 15, fontWeight: '800', color: colors.black },
  btnTextDisabled: { color: colors.greyLight },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 18 },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  orText: { fontSize: 11, fontWeight: '700', color: colors.greyLight },
  secondaryBtn: {
    borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.pill,
    paddingVertical: 14, alignItems: 'center',
  },
  secondaryBtnText: { fontSize: 15, fontWeight: '700', color: colors.black },
  adminLink: { flexDirection: 'row', alignItems: 'center', gap: 5, justifyContent: 'center', marginTop: 16 },
  adminLinkText: { fontSize: 12, color: colors.grey, fontWeight: '500' },
  footer: { textAlign: 'center', color: colors.greyLight, marginTop: 24, fontSize: 11 },
});
