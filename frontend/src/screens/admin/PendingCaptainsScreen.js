import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors, radius, shadow, sf } from '../../theme/theme';
import { getCaptains, updateCaptainStatus } from '../../utils/authStore';

const STATUS_COLORS = {
  pending:  { bg: '#FEF9C3', text: '#92400E', dot: '#CA8A04' },
  approved: { bg: colors.successBg, text: colors.success, dot: colors.success },
  rejected: { bg: colors.dangerBg, text: colors.danger, dot: colors.danger },
};

export default function PendingCaptainsScreen({ navigation }) {
  const [captains, setCaptains] = useState([]);

  useFocusEffect(useCallback(() => {
    getCaptains().then(setCaptains);
  }, []));

  async function handleAction(id, action) {
    Alert.alert(
      action === 'approved' ? 'Approve Captain' : 'Reject Captain',
      `Are you sure you want to ${action === 'approved' ? 'approve' : 'reject'} this captain?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action === 'approved' ? 'Approve' : 'Reject',
          style: action === 'rejected' ? 'destructive' : 'default',
          onPress: async () => {
            await updateCaptainStatus(id, action);
            setCaptains(prev => prev.map(c => c.id === id ? { ...c, status: action } : c));
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={colors.black} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Captain Approvals</Text>
          <Text style={styles.headerSub}>{captains.filter(c => c.status === 'pending').length} pending review</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {captains.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="bicycle-outline" size={48} color={colors.greyLight} />
            <Text style={styles.emptyText}>No captain registrations yet</Text>
          </View>
        ) : (
          captains.map(c => {
            const sc = STATUS_COLORS[c.status] || STATUS_COLORS.pending;
            return (
              <View key={c.id} style={[styles.card, shadow.sm]}>
                {/* Top row */}
                <View style={styles.cardTop}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{c.name?.[0] || '?'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{c.name}</Text>
                    <Text style={styles.phone}>{c.phone}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
                    <View style={[styles.statusDot, { backgroundColor: sc.dot }]} />
                    <Text style={[styles.statusText, { color: sc.text }]}>{c.status}</Text>
                  </View>
                </View>

                {/* Details grid */}
                <View style={styles.detailGrid}>
                  {[
                    { label: 'Email', value: c.email },
                    { label: 'Licence', value: c.licenceNumber },
                    { label: 'Aadhaar', value: c.aadhaarNumber ? `****${c.aadhaarNumber.slice(-4)}` : '-' },
                    { label: 'Vehicle No.', value: c.vehicleNumber },
                    { label: 'Vehicle Type', value: c.vehicleType },
                    { label: 'Seats', value: c.seats },
                    { label: 'Make/Model', value: `${c.vehicleMake || ''} ${c.vehicleModel || ''}`.trim() || '-' },
                    { label: 'City', value: c.city },
                    { label: 'Registered', value: c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : '-' },
                  ].map(({ label, value }) => (
                    <View key={label} style={styles.detailItem}>
                      <Text style={styles.detailLabel}>{label}</Text>
                      <Text style={styles.detailValue} numberOfLines={1}>{value || '-'}</Text>
                    </View>
                  ))}
                </View>

                {/* Actions */}
                {c.status === 'pending' && (
                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.rejectBtn]}
                      onPress={() => handleAction(c.id, 'rejected')}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="close" size={16} color={colors.danger} />
                      <Text style={[styles.actionBtnText, { color: colors.danger }]}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.approveBtn]}
                      onPress={() => handleAction(c.id, 'approved')}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="checkmark" size={16} color={colors.black} />
                      <Text style={styles.actionBtnText}>Approve</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })
        )}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: {
    backgroundColor: colors.white, paddingTop: 16, paddingBottom: 20,
    paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 14,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.greyBg, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: colors.black },
  headerSub: { fontSize: 12, color: colors.grey, marginTop: 2 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16 },
  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 14, color: colors.greyLight, fontWeight: '500' },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: colors.border },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.yellowLight, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 18, fontWeight: '800', color: colors.black },
  name: { fontSize: 15, fontWeight: '700', color: colors.black },
  phone: { fontSize: 12, color: colors.grey, marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 5 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 0, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12, marginBottom: 12 },
  detailItem: { width: '50%', paddingVertical: 4, paddingRight: 8 },
  detailLabel: { fontSize: 10, fontWeight: '600', color: colors.greyLight, letterSpacing: 0.4, textTransform: 'uppercase' },
  detailValue: { fontSize: 13, fontWeight: '500', color: colors.black, marginTop: 1 },
  actions: { flexDirection: 'row', gap: 10, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 },
  actionBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, borderRadius: radius.pill, paddingVertical: 10 },
  rejectBtn: { backgroundColor: colors.dangerBg, borderWidth: 1, borderColor: '#FECACA' },
  approveBtn: { backgroundColor: colors.yellow },
  actionBtnText: { fontSize: 14, fontWeight: '700', color: colors.black },
});
