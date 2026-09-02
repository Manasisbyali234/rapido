import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, type } from '../../theme/theme';

export default function AdminLoginScreen({ navigation }) {
  const [email, setEmail] = useState('admin@rapydo.com');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.logoWrap}>
          <Ionicons name="flash" size={28} color={colors.black} />
        </View>
        <Text style={styles.brand}>Rapydo</Text>
        <Text style={styles.brandSub}>Admin Console</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sign in</Text>
        <Text style={[type.small, { color: '#888', marginBottom: 24 }]}>
          Access the platform management dashboard
        </Text>

        <Text style={styles.label}>Email address</Text>
        <View style={[styles.inputWrap, focusedField === 'email' && styles.inputFocused]}>
          <Ionicons name="mail-outline" size={16} color="#666" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#555"
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        <Text style={styles.label}>Password</Text>
        <View style={[styles.inputWrap, focusedField === 'pass' && styles.inputFocused]}>
          <Ionicons name="lock-closed-outline" size={16} color="#666" style={{ marginRight: 8 }} />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPass}
            placeholder="••••••••"
            placeholderTextColor="#555"
            onFocus={() => setFocusedField('pass')}
            onBlur={() => setFocusedField(null)}
          />
          <TouchableOpacity onPress={() => setShowPass(p => !p)}>
            <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={16} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'AdminDashboard' }] })}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Sign in to Console</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.black} />
        </TouchableOpacity>

        <View style={styles.hint}>
          <Ionicons name="information-circle-outline" size={13} color="#555" />
          <Text style={styles.hintText}>Demo: any password works</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', padding: 24 },
  topSection: { alignItems: 'center', marginBottom: 32 },
  logoWrap: {
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: colors.yellow,
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  brand: { fontSize: 26, fontWeight: '900', color: colors.black, letterSpacing: -0.5 },
  brandSub: { fontSize: 13, fontWeight: '500', color: colors.grey, marginTop: 4 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 24, padding: 24,
    borderWidth: 1, borderColor: colors.border,
  },
  cardTitle: { fontSize: 20, fontWeight: '800', color: colors.black, marginBottom: 4 },
  label: { fontSize: 12, fontWeight: '600', color: colors.grey, marginBottom: 6, marginTop: 16, letterSpacing: 0.4 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.greyBg, borderRadius: radius.sm,
    paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1.5, borderColor: colors.border,
  },
  inputFocused: { borderColor: colors.yellow },
  input: { flex: 1, color: colors.black, fontSize: 14, fontWeight: '500' },
  button: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
    backgroundColor: colors.yellow, borderRadius: radius.pill,
    paddingVertical: 14, marginTop: 24,
  },
  buttonText: { fontSize: 15, fontWeight: '800', color: colors.black },
  hint: { flexDirection: 'row', alignItems: 'center', gap: 5, justifyContent: 'center', marginTop: 14 },
  hintText: { fontSize: 11, color: '#555' },
});
