import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Alert, ActivityIndicator, Modal, TextInput, KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, CommonActions } from '@react-navigation/native';
import { colors, radius, shadow } from '../../theme/theme';
import { logout } from '../../utils/authStore';
import * as api from '../../utils/api';

const INFO_ROWS = [
  { key: 'phone',     label: 'Mobile Number', icon: 'call-outline',   editable: false },
  { key: 'email',     label: 'Email Address', icon: 'mail-outline',   editable: true  },
];

function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ProfileScreen({ navigation }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({ name: '', email: '' });
  const [saving, setSaving]   = useState(false);

  async function fetchProfile() {
    setLoading(true); setError(null);
    try {
      const res = await api.getProfile();
      setUser(res.user);
      setForm({ name: res.user.name || '', email: res.user.email || '' });
    } catch (e) {
      setError(e.message || 'Could not load profile');
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(useCallback(() => { fetchProfile(); }, []));

  async function handleSave() {
    if (!form.name.trim()) { Alert.alert('Validation', 'Name cannot be empty'); return; }
    setSaving(true);
    try {
      const res = await api.updateProfile({ name: form.name.trim(), email: form.email.trim() });
      setUser(res.user);
      setEditing(false);
    } catch (e) {
      Alert.alert('Update Failed', e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out', style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.dispatch(
            CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] })
          );
        },
      },
    ]);
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.yellow} />
        <Text style={styles.loadingText}>Loading profile…</Text>
      </View>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="cloud-offline-outline" size={48} color={colors.greyLight} />
        <Text style={styles.errorTitle}>Couldn't load profile</Text>
        <Text style={styles.errorSub}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchProfile}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <Ionicons name="bicycle" size={18} color={colors.black} />
            <Text style={styles.brandText}>Hubli Rider</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.initials}>{initials}</Text>
          </View>
          <Text style={styles.name}>{user?.name || '—'}</Text>
          <Text style={styles.phone}>+91 {user?.phone || '—'}</Text>
          <View style={styles.memberBadge}>
            <Ionicons name="checkmark-circle" size={13} color={colors.success} />
            <Text style={styles.memberText}>Verified Member</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { icon: 'car-outline',    label: 'Total Rides', value: user?.rides ?? 0 },
            { icon: 'star-outline',   label: 'Rating',      value: user?.rating ?? '5.0' },
            { icon: 'wallet-outline', label: 'Wallet',      value: '₹0' },
          ].map(s => (
            <View key={s.label} style={[styles.statCard, shadow.sm]}>
              <Ionicons name={s.icon} size={18} color={colors.yellow} />
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Account Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Account Details</Text>
            <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(true)} activeOpacity={0.8}>
              <Ionicons name="pencil-outline" size={13} color={colors.black} />
              <Text style={styles.editBtnText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.detailCard, shadow.sm]}>
            {/* Name */}
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="person-outline" size={16} color={colors.black} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Full Name</Text>
                <Text style={styles.detailValue}>{user?.name || '—'}</Text>
              </View>
            </View>
            <View style={styles.separator} />

            {/* Phone */}
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="call-outline" size={16} color={colors.black} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Mobile Number</Text>
                <View style={styles.detailValueRow}>
                  <Text style={styles.detailValue}>+91 {user?.phone || '—'}</Text>
                  <View style={styles.verifiedPill}>
                    <Ionicons name="checkmark-circle" size={11} color={colors.success} />
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.separator} />

            {/* Email */}
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="mail-outline" size={16} color={colors.black} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Email Address</Text>
                {user?.email
                  ? <Text style={styles.detailValue}>{user.email}</Text>
                  : <Text style={styles.notSet}>Not added</Text>}
              </View>
            </View>
            <View style={styles.separator} />

            {/* Member Since */}
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="calendar-outline" size={16} color={colors.black} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Member Since</Text>
                <Text style={styles.detailValue}>{formatDate(user?.createdAt) || '—'}</Text>
              </View>
            </View>

            {/* Account Status */}
            <View style={styles.separator} />
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="shield-checkmark-outline" size={16} color={colors.black} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Account Status</Text>
                <View style={[styles.statusPill, user?.status === 'active' ? styles.statusActive : styles.statusBlocked]}>
                  <Text style={[styles.statusText, user?.status === 'active' ? styles.statusActiveText : styles.statusBlockedText]}>
                    {user?.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'Active'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Logout */}
        <View style={[styles.section, { marginBottom: 32 }]}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
            <Ionicons name="log-out-outline" size={18} color={colors.danger} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={editing} animationType="slide" transparent onRequestClose={() => setEditing(false)}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditing(false)}>
                <Ionicons name="close" size={22} color={colors.black} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>Full Name</Text>
              <TextInput
                style={styles.modalInput}
                value={form.name}
                onChangeText={v => setForm(p => ({ ...p, name: v }))}
                placeholder="Your full name"
                placeholderTextColor={colors.greyLight}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>Email Address</Text>
              <TextInput
                style={styles.modalInput}
                value={form.email}
                onChangeText={v => setForm(p => ({ ...p, email: v }))}
                placeholder="your@email.com"
                placeholderTextColor={colors.greyLight}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>Mobile Number</Text>
              <View style={[styles.modalInput, styles.modalInputDisabled]}>
                <Text style={styles.modalInputDisabledText}>+91 {user?.phone}</Text>
                <Text style={styles.modalInputHint}>Cannot be changed</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.85}
            >
              {saving
                ? <ActivityIndicator size="small" color={colors.black} />
                : <Text style={styles.saveBtnText}>Save Changes</Text>}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg, gap: 12, padding: 32 },
  loadingText: { fontSize: 14, color: colors.grey, marginTop: 8 },
  errorTitle: { fontSize: 17, fontWeight: '700', color: colors.black, marginTop: 12 },
  errorSub: { fontSize: 13, color: colors.grey, textAlign: 'center' },
  retryBtn: { marginTop: 8, backgroundColor: colors.yellow, borderRadius: radius.pill, paddingHorizontal: 28, paddingVertical: 12 },
  retryText: { fontSize: 14, fontWeight: '700', color: colors.black },

  header: {
    backgroundColor: colors.yellow, alignItems: 'center',
    paddingTop: 24, paddingBottom: 28,
    borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  brandText: { fontSize: 15, fontWeight: '900', color: colors.black },
  avatar: {
    width: 76, height: 76, borderRadius: 38,
    backgroundColor: colors.black,
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  initials: { fontSize: 28, fontWeight: '800', color: colors.yellow },
  name: { fontSize: 20, fontWeight: '800', color: colors.black },
  phone: { fontSize: 13, fontWeight: '500', color: 'rgba(0,0,0,0.55)', marginTop: 3 },
  memberBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: colors.successBg, borderRadius: radius.pill,
    paddingHorizontal: 10, paddingVertical: 4, marginTop: 10,
  },
  memberText: { fontSize: 11, fontWeight: '700', color: colors.success },

  statsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginTop: 16 },
  statCard: {
    flex: 1, backgroundColor: colors.white, borderRadius: radius.md,
    padding: 14, alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: colors.border,
  },
  statValue: { fontSize: 18, fontWeight: '800', color: colors.black },
  statLabel: { fontSize: 10, fontWeight: '500', color: colors.grey },

  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: colors.grey, letterSpacing: 0.6, textTransform: 'uppercase' },
  editBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: colors.yellow, borderRadius: radius.pill,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  editBtnText: { fontSize: 12, fontWeight: '700', color: colors.black },

  detailCard: {
    backgroundColor: colors.white, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
  },
  detailRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  detailIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: colors.greyBg, justifyContent: 'center', alignItems: 'center',
  },
  detailContent: { flex: 1 },
  detailLabel: { fontSize: 11, fontWeight: '600', color: colors.grey, marginBottom: 3, letterSpacing: 0.3 },
  detailValue: { fontSize: 14, fontWeight: '600', color: colors.black },
  detailValueRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  notSet: { fontSize: 14, fontWeight: '500', color: colors.greyLight, fontStyle: 'italic' },
  separator: { height: 1, backgroundColor: colors.border, marginLeft: 66 },
  verifiedPill: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: colors.successBg, borderRadius: radius.pill,
    paddingHorizontal: 7, paddingVertical: 2,
  },
  verifiedText: { fontSize: 10, fontWeight: '700', color: colors.success },
  statusPill: { borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start' },
  statusActive: { backgroundColor: colors.successBg },
  statusBlocked: { backgroundColor: colors.dangerBg },
  statusText: { fontSize: 12, fontWeight: '700' },
  statusActiveText: { color: colors.success },
  statusBlockedText: { color: colors.danger },

  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: colors.dangerBg, borderRadius: radius.pill,
    paddingVertical: 14, borderWidth: 1, borderColor: '#FECACA',
  },
  logoutText: { fontSize: 14, fontWeight: '700', color: colors.danger },

  // Modal
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalSheet: {
    backgroundColor: colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, paddingBottom: 40,
  },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: colors.black },
  modalField: { marginBottom: 16 },
  modalLabel: { fontSize: 12, fontWeight: '600', color: colors.grey, marginBottom: 6, letterSpacing: 0.4 },
  modalInput: {
    borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md,
    paddingHorizontal: 14, paddingVertical: 13,
    fontSize: 14, fontWeight: '500', color: colors.black,
    backgroundColor: colors.white,
  },
  modalInputDisabled: {
    backgroundColor: colors.greyBg, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
  },
  modalInputDisabledText: { fontSize: 14, fontWeight: '600', color: colors.charcoal },
  modalInputHint: { fontSize: 11, color: colors.greyLight },
  saveBtn: {
    backgroundColor: colors.yellow, borderRadius: radius.pill,
    paddingVertical: 15, alignItems: 'center', marginTop: 8,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { fontSize: 15, fontWeight: '800', color: colors.black },
});
