import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, sf } from '../../theme/theme';

export default function RegisterUserScreen({ navigation }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [focused, setFocused] = useState(null);

  const valid = form.name.trim() && form.email.includes('@') && form.phone.length === 10;

  function field(key) {
    return {
      value: form[key],
      onChangeText: v => setForm(p => ({ ...p, [key]: v })),
      onFocus: () => setFocused(key),
      onBlur: () => setFocused(null),
    };
  }

  async function handleSendOtp() {
    navigation.navigate('OtpVerify', {
      phone: form.phone.trim(),
      flow: 'registerUser',
      name: form.name.trim(),
      email: form.email.trim(),
    });
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>User Registration</Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.title}>Create Your{'\n'}Rider Account</Text>
          <Text style={styles.subtitle}>Fill in your details to get started</Text>

          <View style={[styles.card, shadow.sm]}>
            {[
              { key: 'name', label: 'Full Name', icon: 'person-outline', placeholder: 'Ananya Rao', keyboard: 'default' },
              { key: 'email', label: 'Email Address', icon: 'mail-outline', placeholder: 'ananya@email.com', keyboard: 'email-address' },
            ].map(({ key, label, icon, placeholder, keyboard }) => (
              <View key={key} style={styles.fieldWrap}>
                <Text style={styles.label}>{label}</Text>
                <View style={[styles.inputRow, focused === key && styles.inputFocused]}>
                  <Ionicons name={icon} size={16} color={colors.grey} style={{ marginRight: 8 }} />
                  <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor={colors.greyLight}
                    keyboardType={keyboard}
                    autoCapitalize={key === 'email' ? 'none' : 'words'}
                    {...field(key)}
                  />
                </View>
              </View>
            ))}

            <View style={styles.fieldWrap}>
              <Text style={styles.label}>Mobile Number</Text>
              <View style={[styles.inputRow, focused === 'phone' && styles.inputFocused]}>
                <Text style={styles.flag}>🇮🇳 +91</Text>
                <View style={styles.divider} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="98765 43210"
                  placeholderTextColor={colors.greyLight}
                  keyboardType="number-pad"
                  maxLength={10}
                  {...field('phone')}
                />
                {form.phone.length === 10 && <Ionicons name="checkmark-circle" size={18} color={colors.success} style={{ marginRight: 8 }} />}
              </View>
            </View>
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

          <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLinkText}>Already have an account? <Text style={{ color: colors.black, fontWeight: '700' }}>Login</Text></Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1 },
  header: {
    backgroundColor: colors.yellow, paddingTop: 16, paddingBottom: 20,
    paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 12,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  backBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.1)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: colors.black },
  body: { padding: 20 },
  title: { fontSize: 24, fontWeight: '900', color: colors.black, letterSpacing: -0.5, lineHeight: 32, marginTop: 8, marginBottom: 4 },
  subtitle: { fontSize: 13, color: colors.grey, marginBottom: 20 },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 20, borderWidth: 1, borderColor: colors.border, marginBottom: 20 },
  fieldWrap: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', color: colors.grey, marginBottom: 6, letterSpacing: 0.4 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.md, backgroundColor: colors.white, overflow: 'hidden',
  },
  inputFocused: { borderColor: colors.yellow },
  flag: { fontSize: 13, fontWeight: '700', color: colors.black, paddingHorizontal: 12 },
  divider: { width: 1, height: 20, backgroundColor: colors.border },
  input: { flex: 1, paddingHorizontal: 12, paddingVertical: 13, fontSize: 14, fontWeight: '500', color: colors.black },
  btn: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
    backgroundColor: colors.yellow, borderRadius: radius.pill, paddingVertical: 15, marginBottom: 16,
  },
  btnDisabled: { backgroundColor: colors.greyBg },
  btnText: { fontSize: 15, fontWeight: '800', color: colors.black },
  btnTextDisabled: { color: colors.greyLight },
  loginLink: { alignItems: 'center' },
  loginLinkText: { fontSize: 13, color: colors.grey },
});
