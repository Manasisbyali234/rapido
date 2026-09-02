import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, type } from '../../theme/theme';

export default function DriverLoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const valid = phone.length === 10;

  return (
    <View style={styles.container}>
      <View style={styles.brandBar}>
        <Text style={styles.brand}>Rapydo Captain</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  brandBar: { backgroundColor: colors.black, paddingTop: 60, paddingBottom: 24, paddingHorizontal: 24 },
  brand: { fontSize: 24, fontWeight: '900', color: colors.yellow },
  content: { padding: 24 },
  inputRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  codeBox: { borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: 12, justifyContent: 'center' },
  codeText: { ...type.body, fontWeight: '600' },
  input: { flex: 1, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: 14, fontSize: 17, fontWeight: '600', color: colors.black },
  button: { borderRadius: radius.pill, paddingVertical: 15, alignItems: 'center' },
  buttonText: { fontSize: 16, fontWeight: '800' },
});
