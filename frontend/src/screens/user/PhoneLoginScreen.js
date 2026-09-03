import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, type, shadow, sf } from '../../theme/theme';

export default function PhoneLoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [focused, setFocused] = useState(false);
  const valid = phone.length === 10;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.topBar}>
          <View style={styles.logoRow}>
            <View style={styles.logoMark}><Ionicons name="flash" size={16} color={colors.black} /></View>
            <Text style={styles.logoText}>Hubli Rider</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>What's your{'\n'}mobile number?</Text>
          <Text style={[type.body, { marginTop: 8, marginBottom: 32, lineHeight: sf(22) }]}>
            We'll send a one-time password to verify your number.
          </Text>

          <Text style={type.label}>Mobile number</Text>
          <View style={[styles.inputRow, focused && styles.inputRowFocused, shadow.sm]}>
            <View style={styles.codeBox}>
              <Text style={styles.flag}>🇮🇳</Text>
              <Text style={styles.code}>+91</Text>
              <View style={styles.codeDivider} />
            </View>
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
            disabled={!valid}
            style={[styles.button, !valid && styles.buttonDisabled]}
            onPress={() => navigation.navigate('Otp', { phone })}
            activeOpacity={0.85}
          >
            <Text style={[styles.buttonText, !valid && styles.buttonTextDisabled]}>Get OTP</Text>
            <Ionicons name="arrow-forward" size={18} color={valid ? colors.black : colors.greyLight} />
          </TouchableOpacity>

          <Text style={styles.terms}>
            By continuing, you agree to our{' '}
            <Text style={{ color: colors.black, fontWeight: '600' }}>Terms of Service</Text>
            {' '}&{' '}
            <Text style={{ color: colors.black, fontWeight: '600' }}>Privacy Policy</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  topBar: {
    backgroundColor: colors.yellow,
    paddingTop: 16, paddingBottom: 20, paddingHorizontal: 24,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoMark: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: colors.black,
    justifyContent: 'center', alignItems: 'center',
  },
  logoText: { fontSize: sf(18), fontWeight: '900', color: colors.black },
  content: { padding: 24, flex: 1 },
  title: { fontSize: sf(26), fontWeight: '800', color: colors.black, letterSpacing: -0.5, lineHeight: sf(34), marginTop: 8 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.md, marginTop: 8, marginBottom: 24,
    backgroundColor: colors.white, overflow: 'hidden',
  },
  inputRowFocused: { borderColor: colors.yellow },
  codeBox: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 6 },
  flag: { fontSize: sf(18) },
  code: { fontSize: sf(14), fontWeight: '700', color: colors.black },
  codeDivider: { width: 1, height: 20, backgroundColor: colors.border, marginLeft: 8 },
  input: { flex: 1, paddingHorizontal: 12, paddingVertical: 14, fontSize: sf(16), fontWeight: '600', color: colors.black },
  button: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
    backgroundColor: colors.yellow, borderRadius: radius.pill,
    paddingVertical: 15, marginBottom: 20,
  },
  buttonDisabled: { backgroundColor: colors.greyBg },
  buttonText: { fontSize: sf(15), fontWeight: '800', color: colors.black },
  buttonTextDisabled: { color: colors.greyLight },
  terms: { ...type.small, textAlign: 'center', lineHeight: sf(18) },
});
