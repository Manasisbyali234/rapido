import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, sf } from '../../theme/theme';

const VEHICLE_TYPES = ['Bike', 'Auto', 'Sedan', 'Hatchback', 'SUV'];
const STEPS = ['Personal', 'Identity', 'Vehicle', 'Additional'];

// Defined OUTSIDE the parent so it never gets a new component identity on re-render
function Field({ label, fkey, placeholder, keyboard, maxLength, form, focused, onChange, onFocus, onBlur }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, focused === fkey && styles.inputFocused]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.greyLight}
          maxLength={maxLength}
          autoCapitalize="none"
          keyboardType={keyboard || 'default'}
          value={form[fkey]}
          onChangeText={v => onChange(fkey, v)}
          onFocus={() => onFocus(fkey)}
          onBlur={onBlur}
        />
      </View>
    </View>
  );
}

export default function RegisterCaptainScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [focused, setFocused] = useState(null);
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    licenceNumber: '', aadhaarNumber: '',
    licenceFile: null, aadhaarFile: null,
    vehicleNumber: '', vehicleType: '', seats: '', vehicleMake: '', vehicleModel: '', vehicleYear: '',
    experience: '', city: '', address: '',
  });

  function set(key, val) { setForm(p => ({ ...p, [key]: val })); }
  const onFocus = key => setFocused(key);
  const onBlur = () => setFocused(null);

  const fieldProps = { form, focused, onChange: set, onFocus, onBlur };

  function canProceed() {
    if (step === 0) return form.name.trim() && form.phone.length === 10 && form.email.includes('@');
    if (step === 1) return form.licenceNumber.trim() && form.aadhaarNumber.length >= 12;
    if (step === 2) return form.vehicleNumber.trim() && form.vehicleType && form.seats && form.vehicleMake && form.vehicleModel && form.vehicleYear;
    if (step === 3) return form.experience.trim() && form.city.trim() && form.address.trim();
    return false;
  }

  function handleNext() {
    if (step < 3) { setStep(s => s + 1); return; }
    navigation.navigate('OtpVerify', {
      phone: form.phone,
      flow: 'registerCaptain',
      captainData: form,
    });
  }

  function renderStep() {
    if (step === 0) return (
      <>
        <Field label="Full Name" fkey="name" placeholder="Suresh Kumar" {...fieldProps} />
        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Mobile Number</Text>
          <View style={[styles.inputRow, focused === 'phone' && styles.inputFocused]}>
            <Text style={styles.flag}>🇮🇳 +91</Text>
            <View style={styles.divider} />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="91112 22223"
              placeholderTextColor={colors.greyLight}
              keyboardType="number-pad"
              maxLength={10}
              value={form.phone}
              onChangeText={v => set('phone', v)}
              onFocus={() => setFocused('phone')}
              onBlur={() => setFocused(null)}
            />
          </View>
        </View>
        <Field label="Email Address" fkey="email" placeholder="suresh@email.com" keyboard="email-address" {...fieldProps} />
      </>
    );

    if (step === 1) return (
      <>
        <Field label="Driving Licence Number" fkey="licenceNumber" placeholder="KA0520230012345" maxLength={20} {...fieldProps} />
        <Field label="Aadhaar Number" fkey="aadhaarNumber" placeholder="1234 5678 9012" keyboard="number-pad" maxLength={12} {...fieldProps} />

        {[
          { key: 'licenceFile', label: 'Upload Driving Licence' },
          { key: 'aadhaarFile', label: 'Upload Aadhaar Card' },
        ].map(({ key, label }) => (
          <View key={key} style={styles.fieldWrap}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity
              style={[styles.uploadBtn, form[key] && styles.uploadBtnDone]}
              onPress={() => set(key, `${key}_preview.jpg`)}
              activeOpacity={0.8}
            >
              <Ionicons name={form[key] ? 'checkmark-circle' : 'cloud-upload-outline'} size={20} color={form[key] ? colors.success : colors.grey} />
              <Text style={[styles.uploadText, form[key] && { color: colors.success }]}>
                {form[key] ? 'File selected (preview only)' : 'Tap to select file'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </>
    );

    if (step === 2) return (
      <>
        <Field label="Vehicle Number / Number Plate" fkey="vehicleNumber" placeholder="KA05 AB 1234" {...fieldProps} />
        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Vehicle Type</Text>
          <View style={styles.typeGrid}>
            {VEHICLE_TYPES.map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.typePill, form.vehicleType === t && styles.typePillActive]}
                onPress={() => set('vehicleType', t)}
              >
                <Text style={[styles.typePillText, form.vehicleType === t && styles.typePillTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <Field label="Number of Seats" fkey="seats" placeholder="4" keyboard="number-pad" maxLength={2} {...fieldProps} />
        <Field label="Vehicle Make" fkey="vehicleMake" placeholder="Honda" {...fieldProps} />
        <Field label="Vehicle Model" fkey="vehicleModel" placeholder="Activa 6G" {...fieldProps} />
        <Field label="Vehicle Year" fkey="vehicleYear" placeholder="2022" keyboard="number-pad" maxLength={4} {...fieldProps} />
      </>
    );

    if (step === 3) return (
      <>
        <Field label="Driving Experience (years)" fkey="experience" placeholder="3" keyboard="number-pad" maxLength={2} {...fieldProps} />
        <Field label="City" fkey="city" placeholder="Hubli" {...fieldProps} />
        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Address</Text>
          <View style={[styles.inputRow, styles.textArea, focused === 'address' && styles.inputFocused]}>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
              placeholder="123, Main Road, Hubli - 580001"
              placeholderTextColor={colors.greyLight}
              multiline
              value={form.address}
              onChangeText={v => set('address', v)}
              onFocus={() => setFocused('address')}
              onBlur={() => setFocused(null)}
            />
          </View>
        </View>
      </>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => step > 0 ? setStep(s => s - 1) : navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Captain Registration</Text>
        </View>

        <View style={styles.body}>
          {/* Step indicator */}
          <View style={styles.stepRow}>
            {STEPS.map((s, i) => (
              <View key={s} style={styles.stepItem}>
                <View style={[styles.stepDot, i <= step && styles.stepDotActive, i < step && styles.stepDotDone]}>
                  {i < step
                    ? <Ionicons name="checkmark" size={12} color={colors.black} />
                    : <Text style={[styles.stepNum, i === step && styles.stepNumActive]}>{i + 1}</Text>
                  }
                </View>
                <Text style={[styles.stepLabel, i === step && styles.stepLabelActive]}>{s}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.stepTitle}>Step {step + 1}: {STEPS[step]} Details</Text>

          <View style={[styles.card, shadow.sm]}>
            {renderStep()}
          </View>

          <TouchableOpacity
            style={[styles.btn, !canProceed() && styles.btnDisabled]}
            disabled={!canProceed()}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text style={[styles.btnText, !canProceed() && styles.btnTextDisabled]}>
              {step < 3 ? 'Continue' : 'Register as Captain'}
            </Text>
            <Ionicons name={step < 3 ? 'arrow-forward' : 'checkmark'} size={18} color={canProceed() ? colors.black : colors.greyLight} />
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
    backgroundColor: colors.black, paddingTop: 16, paddingBottom: 20,
    paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 12,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  backBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: colors.yellow },
  body: { padding: 20 },
  stepRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, marginTop: 4 },
  stepItem: { alignItems: 'center', flex: 1 },
  stepDot: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.greyBg, borderWidth: 2, borderColor: colors.border,
    justifyContent: 'center', alignItems: 'center', marginBottom: 4,
  },
  stepDotActive: { borderColor: colors.yellow, backgroundColor: colors.yellow },
  stepDotDone: { borderColor: colors.success, backgroundColor: colors.success },
  stepNum: { fontSize: 12, fontWeight: '700', color: colors.grey },
  stepNumActive: { color: colors.black },
  stepLabel: { fontSize: 10, fontWeight: '600', color: colors.greyLight, textAlign: 'center' },
  stepLabelActive: { color: colors.black },
  stepTitle: { fontSize: 18, fontWeight: '800', color: colors.black, marginBottom: 16 },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 20, borderWidth: 1, borderColor: colors.border, marginBottom: 20 },
  fieldWrap: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', color: colors.grey, marginBottom: 6, letterSpacing: 0.4 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.md, backgroundColor: colors.white, overflow: 'hidden',
  },
  textArea: { alignItems: 'flex-start', paddingTop: 4 },
  inputFocused: { borderColor: colors.yellow },
  flag: { fontSize: 13, fontWeight: '700', color: colors.black, paddingHorizontal: 12 },
  divider: { width: 1, height: 20, backgroundColor: colors.border },
  input: { flex: 1, paddingHorizontal: 12, paddingVertical: 13, fontSize: 14, fontWeight: '500', color: colors.black },
  uploadBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1.5, borderColor: colors.border, borderStyle: 'dashed',
    borderRadius: radius.md, padding: 14, backgroundColor: colors.greyBg,
  },
  uploadBtnDone: { borderColor: colors.success, backgroundColor: colors.successBg, borderStyle: 'solid' },
  uploadText: { fontSize: 13, fontWeight: '500', color: colors.grey },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typePill: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.border,
    backgroundColor: colors.white,
  },
  typePillActive: { backgroundColor: colors.yellow, borderColor: colors.yellow },
  typePillText: { fontSize: 13, fontWeight: '600', color: colors.grey },
  typePillTextActive: { color: colors.black },
  btn: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
    backgroundColor: colors.yellow, borderRadius: radius.pill, paddingVertical: 15, marginBottom: 16,
  },
  btnDisabled: { backgroundColor: colors.greyBg },
  btnText: { fontSize: 15, fontWeight: '800', color: colors.black },
  btnTextDisabled: { color: colors.greyLight },
});
