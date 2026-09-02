import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, type, shadow } from '../../theme/theme';

export default function ActiveRideScreen({ route, navigation }) {
  const { request } = route.params;
  const [stage, setStage] = useState('toPickup'); // toPickup -> otp -> toDrop -> done
  const [otpInput, setOtpInput] = useState('');

  const finish = () => navigation.reset({ index: 0, routes: [{ name: 'DriverHome' }] });

  return (
    <View style={styles.container}>
      <View style={styles.map}>
        <Ionicons name="navigate" size={36} color={colors.black} />
      </View>

      <View style={styles.sheet}>
        <View style={[styles.riderCard, shadow.card]}>
          <View style={styles.avatar}>
            <Text style={{ fontWeight: '800' }}>{request.riderName.split(' ').map(n => n[0]).join('')}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={type.h3}>{request.riderName}</Text>
            <Text style={type.small}>{request.rideType} • ₹{request.fare}</Text>
          </View>
          <TouchableOpacity style={styles.callBtn}>
            <Ionicons name="call" size={18} color={colors.black} />
          </TouchableOpacity>
        </View>

        {stage === 'toPickup' && (
          <>
            <Text style={[type.h2, { marginTop: 20 }]}>Heading to pickup</Text>
            <Text style={[type.body, { marginBottom: 20 }]}>{request.pickup}</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => setStage('otp')}>
              <Text style={styles.primaryBtnText}>Arrived at pickup</Text>
            </TouchableOpacity>
          </>
        )}

        {stage === 'otp' && (
          <>
            <Text style={[type.h2, { marginTop: 20 }]}>Enter rider's OTP</Text>
            <Text style={[type.body, { marginBottom: 16 }]}>Ask the rider for their 4 digit OTP to start</Text>
            <TextInput
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={4}
              value={otpInput}
              onChangeText={setOtpInput}
              placeholder="0000"
              placeholderTextColor={colors.greyLight}
            />
            <TouchableOpacity
              style={[styles.primaryBtn, { opacity: otpInput.length === 4 ? 1 : 0.4 }]}
              disabled={otpInput.length !== 4}
              onPress={() => setStage('toDrop')}
            >
              <Text style={styles.primaryBtnText}>Start ride</Text>
            </TouchableOpacity>
          </>
        )}

        {stage === 'toDrop' && (
          <>
            <Text style={[type.h2, { marginTop: 20 }]}>On trip to drop</Text>
            <Text style={[type.body, { marginBottom: 20 }]}>{request.drop}</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={finish}>
              <Text style={styles.primaryBtnText}>Complete ride • ₹{request.fare}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  map: { height: '30%', backgroundColor: '#DCEAE2', justifyContent: 'center', alignItems: 'center' },
  sheet: { flex: 1, backgroundColor: colors.white, marginTop: -20, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  riderCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radius.md, padding: 14 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.autoBg, justifyContent: 'center', alignItems: 'center' },
  callBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' },
  primaryBtn: { backgroundColor: colors.yellow, borderRadius: radius.pill, paddingVertical: 16, alignItems: 'center', marginTop: 'auto' },
  primaryBtnText: { fontWeight: '800', fontSize: 15, color: colors.black },
  otpInput: { borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, fontSize: 26, fontWeight: '800', textAlign: 'center', letterSpacing: 10, paddingVertical: 14, marginBottom: 20 },
});
