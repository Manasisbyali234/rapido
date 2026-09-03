import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow } from '../../theme/theme';

export default function SuccessScreen({ navigation, route }) {
  const role = route.params?.role || 'user';

  return (
    <View style={styles.root}>
      <View style={[styles.card, shadow.lg]}>
        <View style={styles.iconWrap}>
          <Ionicons name="checkmark-circle" size={56} color={colors.success} />
        </View>
        <Text style={styles.title}>Registration{'\n'}Successful!</Text>
        <Text style={styles.subtitle}>
          Welcome to Hubli Rider!{'\n'}Your account has been created.
        </Text>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: role === 'user' ? 'User' : 'Driver' }] })}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>Go to Dashboard</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.black} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', padding: 24 },
  card: {
    backgroundColor: colors.white, borderRadius: radius.xl,
    padding: 32, alignItems: 'center', borderWidth: 1, borderColor: colors.border,
  },
  iconWrap: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.successBg, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 26, fontWeight: '900', color: colors.black, textAlign: 'center', letterSpacing: -0.5, lineHeight: 34, marginBottom: 12 },
  subtitle: { fontSize: 14, color: colors.grey, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  btn: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
    backgroundColor: colors.yellow, borderRadius: radius.pill,
    paddingVertical: 15, paddingHorizontal: 32,
  },
  btnText: { fontSize: 15, fontWeight: '800', color: colors.black },
});
