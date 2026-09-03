import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, sf } from '../../theme/theme';
import { registerCaptain, loginUser, loginCaptain } from '../../utils/authStore';
import * as api from '../../utils/api';

const DEMO_OTP = '1234';

export default function OtpVerifyScreen({ navigation, route }) {
  const { phone, flow, role, name, email, captainData } = route.params;
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  function handleChange(val, idx) {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 3) inputs.current[idx + 1]?.focus();
  }

  function handleKeyPress(e, idx) {
    if (e.nativeEvent.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  }

  function resend() {
    setTimer(30);
    setOtp(['', '', '', '']);
    inputs.current[0]?.focus();
  }

  const filled = otp.every(d => d !== '');

  async function handleVerify() {
    if (!filled) return;
    const entered = otp.join('');
    if (entered !== DEMO_OTP) {
      Alert.alert('Wrong OTP', 'Enter the demo OTP: 1234');
      return;
    }
    setLoading(true);

    if (flow === 'registerUser') {
      try {
        const res = await api.registerUser(name.trim(), phone.trim(), email.trim());
        await api.saveSession(res.token, res.user);
      } catch (e) {
        Alert.alert('Registration Failed', e.message); setLoading(false); return;
      }
      navigation.reset({ index: 0, routes: [{ name: 'User' }] });
      return;
    }

    if (flow === 'registerCaptain') {
      const { error } = await registerCaptain({ ...captainData, verified: true });
      if (error) { Alert.alert('Registration Failed', error); setLoading(false); return; }
      navigation.reset({ index: 0, routes: [{ name: 'CaptainPending' }] });
      return;
    }

    if (flow === 'login') {
      let destination = null;

      const localUser = await loginUser(phone);
      if (!localUser.error) destination = 'User';

      if (!destination) {
        const localCaptain = await loginCaptain(phone);
        if (!localCaptain.error)
          destination = localCaptain.captain.status === 'approved' ? 'Driver' : 'CaptainPending';
      }

      if (!destination) {
        Alert.alert('Not Found', 'No account found for this number. Please register first.');
        setLoading(false); return;
      }
      navigation.reset({ index: 0, routes: [{ name: destination }] });
    }

    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={colors.black} />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <View style={styles.iconWrap}>
          <Ionicons name="phone-portrait-outline" size={32} color={colors.black} />
        </View>
        <Text style={styles.title}>Verify your{'\n'}mobile number</Text>
        <Text style={styles.subtitle}>{`Enter the 4-digit OTP sent to\n`}<Text style={styles.phoneText}>+91 {phone}</Text></Text>

        {/* Demo hint banner */}
        <View style={styles.smsBanner}>
          <Ionicons name="information-circle-outline" size={16} color={colors.black} />
          <Text style={styles.smsText}><Text style={styles.smsBold}>Demo OTP: </Text><Text style={styles.smsCode}>{DEMO_OTP}</Text></Text>
        </View>

        <View style={styles.otpRow}>
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={r => inputs.current[i] = r}
              style={[styles.otpBox, digit && styles.otpBoxFilled]}
              value={digit}
              onChangeText={v => handleChange(v, i)}
              onKeyPress={e => handleKeyPress(e, i)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.btn, (!filled || loading) && styles.btnDisabled]}
          disabled={!filled || loading}
          onPress={handleVerify}
          activeOpacity={0.85}
        >
          <Text style={[styles.btnText, (!filled || loading) && styles.btnTextDisabled]}>
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </Text>
          {!loading && <Ionicons name="checkmark" size={18} color={filled ? colors.black : colors.greyLight} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resendBtn}
          disabled={timer > 0}
          onPress={resend}
          activeOpacity={0.7}
        >
          <Text style={[styles.resendText, timer > 0 && styles.resendDisabled]}>
            {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
          </Text>
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  header: {
    backgroundColor: colors.yellow, paddingTop: 16, paddingBottom: 20,
    paddingHorizontal: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  backBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.1)', justifyContent: 'center', alignItems: 'center' },
  body: { flex: 1, padding: 28, alignItems: 'center' },
  iconWrap: { width: 64, height: 64, borderRadius: 20, backgroundColor: colors.yellowLight, justifyContent: 'center', alignItems: 'center', marginTop: 24, marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '900', color: colors.black, textAlign: 'center', letterSpacing: -0.5, lineHeight: 34, marginBottom: 10 },
  subtitle: { fontSize: 14, color: colors.grey, textAlign: 'center', lineHeight: 22, marginBottom: 16 },
  phoneText: { fontWeight: '700', color: colors.black },
  smsBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.yellowLight, borderRadius: radius.md,
    borderWidth: 1.5, borderColor: colors.yellow,
    paddingHorizontal: 14, paddingVertical: 10,
    marginBottom: 28, width: '100%',
  },
  smsText: { fontSize: 13, color: colors.black },
  smsBold: { fontWeight: '700' },
  smsCode: { fontWeight: '900', fontSize: 15, letterSpacing: 4 },
  otpRow: { flexDirection: 'row', gap: 14, marginBottom: 28 },
  otpBox: {
    width: 58, height: 64, borderRadius: radius.md,
    borderWidth: 2, borderColor: colors.border,
    textAlign: 'center', fontSize: sf(26), fontWeight: '800', color: colors.black,
    backgroundColor: colors.greyBg,
  },
  otpBoxFilled: { borderColor: colors.yellow, backgroundColor: colors.yellowLight },
  btn: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
    backgroundColor: colors.yellow, borderRadius: radius.pill,
    paddingVertical: 15, width: '100%', marginBottom: 16,
  },
  btnDisabled: { backgroundColor: colors.greyBg },
  btnText: { fontSize: 15, fontWeight: '800', color: colors.black },
  btnTextDisabled: { color: colors.greyLight },
  resendBtn: { paddingVertical: 8 },
  resendText: { fontSize: 14, fontWeight: '600', color: colors.black },
  resendDisabled: { color: colors.greyLight },
});
