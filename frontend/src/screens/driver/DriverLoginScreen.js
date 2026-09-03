import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, type, sf } from '../../theme/theme';

export default function DriverLoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const valid = phone.length === 10;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.brandBar}>
        <View style={styles.logoRow}>
          <View style={styles.logoMark}>
            <Ionicons name="bicycle" size={20} color={colors.yellow} />
          </View>
          <Text style={styles.brand}>Hubli Rider Captain</Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={type.h1}>Captain login</Text>
        <Text style={[type.body, { marginTop: 6, marginBottom: 28 }]}>Enter your registered mobile number</Text>

        <View style={styles.inputRow}>
          <View style={styles.codeBox}><Text style={styles.codeText}>🇮🇳 +91</Text></View>
          <TextInput
            style={styles.input}
            placeholder="91112 22223"
            placeholderTextColor={colors.greyLight}
            keyboardType="number-pad"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <TouchableOpacity
          disabled={!valid}
          style={[styles.button, { backgroundColor: valid ? colors.black : colors.border }]}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'DriverHome' }] })}
        >
          <Text style={[styles.buttonText, { color: valid ? colors.white : colors.greyLight }]}>Send OTP & Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  brandBar: { backgroundColor: colors.black, paddingTop: 16, paddingBottom: 24, paddingHorizontal: 24 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoMark: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,196,0,0.15)', justifyContent: 'center', alignItems: 'center' },
  brand: { fontSize: sf(22), fontWeight: '900', color: colors.yellow },
  content: { padding: 24 },
  inputRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  codeBox: { borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: 12, justifyContent: 'center' },
  codeText: { ...type.body, fontWeight: '600' },
  input: { flex: 1, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: 14, fontSize: sf(17), fontWeight: '600', color: colors.black },
  button: { borderRadius: radius.pill, paddingVertical: 15, alignItems: 'center' },
  buttonText: { fontSize: sf(16), fontWeight: '800' },
});
