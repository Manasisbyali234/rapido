import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, type, sf } from '../../theme/theme';

export default function OtpScreen({ route, navigation }) {
  const { phone } = route.params;
  const [digits, setDigits] = useState(['', '', '', '']);
  const inputs = useRef([]);
  const { width } = useWindowDimensions();
  const boxSize = Math.min(62, (width - 48 - 36) / 4); // 4 boxes with gaps

  const setDigit = (val, idx) => {
    const next = [...digits];
    next[idx] = val.slice(-1);
    setDigits(next);
    if (val && idx < 3) inputs.current[idx + 1].focus();
  };

  const handleBackspace = (val, idx) => {
    if (!val && idx > 0) {
      const next = [...digits];
      next[idx - 1] = '';
      setDigits(next);
      inputs.current[idx - 1].focus();
    }
  };

  const filled = digits.every(d => d !== '');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.black} />
        </TouchableOpacity>
        <View style={styles.logoRow}>
          <View style={styles.logoMark}><Ionicons name="flash" size={16} color={colors.black} /></View>
          <Text style={styles.logoText}>Hubli Rider</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="lock-closed" size={28} color={colors.yellow} />
        </View>
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={[type.body, { marginTop: 8, marginBottom: 32, textAlign: 'center', lineHeight: sf(22) }]}>
          Sent to <Text style={{ fontWeight: '700', color: colors.black }}>+91 {phone}</Text>
          {'\n'}
          <Text style={{ color: colors.grey }}>(hint: </Text>
          <Text style={{ fontWeight: '700', color: colors.yellowDark }}>1234</Text>
          <Text style={{ color: colors.grey }}>)</Text>
        </Text>

        <View style={styles.otpRow}>
          {digits.map((d, i) => (
            <TextInput
              key={i}
              ref={r => (inputs.current[i] = r)}
              style={[styles.otpBox, { width: boxSize, height: boxSize + 4 }, d && styles.otpBoxFilled]}
              keyboardType="number-pad"
              maxLength={1}
              value={d}
              onChangeText={val => setDigit(val, i)}
              onKeyPress={({ nativeEvent }) => nativeEvent.key === 'Backspace' && handleBackspace(d, i)}
            />
          ))}
        </View>

        <TouchableOpacity
          disabled={!filled}
          style={[styles.button, !filled && styles.buttonDisabled]}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'UserHome' }] })}
          activeOpacity={0.85}
        >
          <Text style={[styles.buttonText, !filled && styles.buttonTextDisabled]}>Verify & Continue</Text>
          <Ionicons name="arrow-forward" size={18} color={filled ? colors.black : colors.greyLight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.resendRow}>
          <Text style={type.small}>Didn't receive it? </Text>
          <Text style={styles.resendLink}>Resend OTP</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  topBar: {
    backgroundColor: colors.yellow,
    paddingTop: 16, paddingBottom: 20, paddingHorizontal: 24,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  backBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.08)',
    justifyContent: 'center', alignItems: 'center',
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoMark: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: colors.black,
    justifyContent: 'center', alignItems: 'center',
  },
  logoText: { fontSize: sf(18), fontWeight: '900', color: colors.black },
  content: { flex: 1, padding: 24, alignItems: 'center', paddingTop: 40 },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: colors.yellowLight,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 20,
  },
  title: { fontSize: sf(26), fontWeight: '800', color: colors.black, letterSpacing: -0.4 },
  otpRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  otpBox: {
    borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.md,
    textAlign: 'center',
    fontSize: sf(24), fontWeight: '800', color: colors.black,
    backgroundColor: colors.greyBg,
  },
  otpBoxFilled: { borderColor: colors.yellow, backgroundColor: colors.yellowLight },
  button: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
    backgroundColor: colors.yellow, borderRadius: radius.pill,
    paddingVertical: 15, width: '100%', marginBottom: 16,
  },
  buttonDisabled: { backgroundColor: colors.greyBg },
  buttonText: { fontSize: sf(15), fontWeight: '800', color: colors.black },
  buttonTextDisabled: { color: colors.greyLight },
  resendRow: { flexDirection: 'row', alignItems: 'center' },
  resendLink: { fontSize: sf(13), fontWeight: '700', color: colors.yellowDark },
});
