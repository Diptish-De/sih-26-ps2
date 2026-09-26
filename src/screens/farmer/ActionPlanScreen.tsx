import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Cow, AppLanguage } from '../../types';
import { THEME } from '../../constants/theme';
import { TRANSLATIONS } from '../../constants/i18n';
import { mockApiService } from '../../services/mockApiService';

interface ActionPlanScreenProps {
  cow: Cow;
  language: AppLanguage;
  onBack: () => void;
  onNavigateToVetView?: () => void;
}

export const ActionPlanScreen: React.FC<ActionPlanScreenProps> = ({
  cow,
  language,
  onBack,
  onNavigateToVetView,
}) => {
  const t = TRANSLATIONS[language];
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [smsSent, setSmsSent] = useState(false);

  const getSteps = () => {
    switch (language) {
      case 'hi':
        return cow.actionPlan.stepsHi;
      case 'bn':
        return cow.actionPlan.stepsBn;
      case 'en':
      default:
        return cow.actionPlan.stepsEn;
    }
  };

  const steps = getSteps();

  const toggleStep = (index: number) => {
    setCompletedSteps(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSendSms = () => {
    mockApiService.dispatchManualSms(cow.id, '+91 98301 24590');
    setSmsSent(true);
    setTimeout(() => {
      setSmsSent(false);
    }, 4000);
  };

  const handleCallVet = () => {
    Alert.alert(
      'Calling Veterinarian',
      'Connecting to Dr. Meera Roy (South Bengal Dairy Veterinary Hub · +91 98301 24590)...',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {/* Top Navigation */}
      <View style={styles.topNavRow}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>← Back to #{cow.id} {cow.name}</Text>
        </TouchableOpacity>
        <View style={styles.urgencyBadge}>
          <Text style={styles.urgencyText}>{cow.actionPlan.urgency} URGENCY</Text>
        </View>
      </View>

      {/* Hero Header */}
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>{t.actionPlan}</Text>
        <Text style={styles.cowTag}>For Cow #{cow.id} · {cow.name} ({cow.primaryQuarter} Quarter)</Text>
        <Text style={styles.headerSubtitle}>
          Immediate hygiene and isolation protocol to mitigate Antimicrobial Resistance (AMR) and protect the bulk milk pool.
        </Text>
      </View>

      {/* Step by Step Checklist */}
      <View style={styles.stepsContainer}>
        {steps.map((step, idx) => {
          const isDone = !!completedSteps[idx];
          return (
            <TouchableOpacity
              key={idx}
              style={[styles.stepItem, isDone && styles.stepItemDone]}
              activeOpacity={0.8}
              onPress={() => toggleStep(idx)}
            >
              <View style={[styles.checkbox, isDone && styles.checkboxDone]}>
                <Text style={[styles.checkMark, isDone && styles.checkMarkDone]}>
                  {isDone ? '✓' : `0${idx + 1}`}
                </Text>
              </View>
              <View style={styles.stepTextContainer}>
                <Text style={[styles.stepNumberLabel, isDone && styles.textDone]}>
                  STEP {idx + 1}
                </Text>
                <Text style={[styles.stepContent, isDone && styles.textDone]}>
                  {step}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Vet Consultation & Hotline Card */}
      <View style={styles.vetCard}>
        <View style={styles.vetHeader}>
          <View style={styles.vetAvatar}>
            <Text style={{ fontSize: 24 }}>👩‍⚕️</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.vetName}>Dr. Meera Roy, MVSc</Text>
            <Text style={styles.vetRole}>Designated Veterinary Officer · Nadia District</Text>
            <Text style={styles.vetHospital}>South Bengal Dairy Health Hub</Text>
          </View>
        </View>

        <View style={styles.vetActionRow}>
          <TouchableOpacity style={styles.callVetBtn} activeOpacity={0.8} onPress={handleCallVet}>
            <Text style={styles.callVetIcon}>📞</Text>
            <Text style={styles.callVetText}>{t.callVet}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.smsVetBtn} activeOpacity={0.8} onPress={handleSendSms}>
            <Text style={styles.smsVetIcon}>✉️</Text>
            <Text style={styles.smsVetText}>
              {smsSent ? 'SMS Sent! ✓' : t.sendSmsAlert}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SMS Fallback Preview */}
      <View style={styles.smsPreviewCard}>
        <View style={styles.smsHeader}>
          <Text style={styles.smsBadge}>GSM / SMS FALLBACK TEMPLATE</Text>
          <Text style={styles.smsLangHint}>Auto-translated (3 languages)</Text>
        </View>
        <Text style={styles.smsText}>
          [KSHEER-RAKSHAK ALERT 06:40 AM] Cow #42 Ganga · HIGH RISK 82% · Left Rear Quarter · Milk LR last in separate pot. Teat dip with iodine. Vet booked tomorrow.
        </Text>
        <Text style={styles.smsHindiText}>
          [क्षीर-रक्षक सूचना] गाय #42 गंगा · उच्च जोखिम 82% · बायाँ पिछला थन · दूध अलग बर्तन में निकालें। टीट-डिप लगाएं।
        </Text>
      </View>

      {/* Switch to Vet Screen CTA */}
      {onNavigateToVetView && (
        <TouchableOpacity style={styles.vetViewBtn} activeOpacity={0.85} onPress={onNavigateToVetView}>
          <Text style={styles.vetViewBtnText}>Switch to Veterinarian Triage Screen →</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.creamBase,
  },
  contentContainer: {
    padding: 18,
    paddingBottom: 28,
    gap: 16,
  },
  topNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: THEME.colors.creamCard,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
  },
  backBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.primaryDark,
  },
  urgencyBadge: {
    backgroundColor: THEME.colors.riskHighBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.riskHighBorder,
  },
  urgencyText: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.riskHighText,
  },
  headerCard: {
    backgroundColor: THEME.colors.primaryDark,
    borderRadius: THEME.radius.xl,
    padding: 16,
    ...THEME.shadows.cardElevated,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFF',
  },
  cowTag: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.goldAccent,
    marginTop: 2,
  },
  headerSubtitle: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 4,
    lineHeight: 16,
  },
  stepsContainer: {
    gap: 10,
  },
  stepItem: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.creamCard,
    borderRadius: THEME.radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
    alignItems: 'flex-start',
    gap: 12,
    ...THEME.shadows.card,
  },
  stepItemDone: {
    backgroundColor: THEME.colors.primarySurface,
    borderColor: THEME.colors.primaryBorder,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.colors.creamCardSubtle,
    borderWidth: 1.5,
    borderColor: THEME.colors.creamBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primaryDark,
  },
  checkMark: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.textMuted,
  },
  checkMarkDone: {
    color: '#FFF',
    fontSize: 15,
  },
  stepTextContainer: {
    flex: 1,
  },
  stepNumberLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: THEME.colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  stepContent: {
    fontSize: 12.5,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
    lineHeight: 17,
  },
  textDone: {
    color: THEME.colors.primaryMedium,
    textDecorationLine: 'line-through',
  },
  vetCard: {
    backgroundColor: THEME.colors.creamCard,
    borderRadius: THEME.radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
    ...THEME.shadows.card,
  },
  vetHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  vetAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.primaryBorder,
  },
  vetName: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  vetRole: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 1,
  },
  vetHospital: {
    fontSize: 10,
    color: THEME.colors.textMuted,
  },
  vetActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  callVetBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.primary,
    paddingVertical: 10,
    borderRadius: THEME.radius.md,
    gap: 6,
  },
  callVetIcon: {
    fontSize: 14,
  },
  callVetText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  smsVetBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.goldLight,
    paddingVertical: 10,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.goldBorder,
    gap: 6,
  },
  smsVetIcon: {
    fontSize: 14,
  },
  smsVetText: {
    color: THEME.colors.primaryDark,
    fontSize: 12,
    fontWeight: '800',
  },
  smsPreviewCard: {
    backgroundColor: THEME.colors.creamCardSubtle,
    borderRadius: THEME.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
  },
  smsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  smsBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: THEME.colors.textMuted,
  },
  smsLangHint: {
    fontSize: 9,
    color: THEME.colors.goldAccent,
    fontWeight: '700',
  },
  smsText: {
    fontSize: 11,
    color: THEME.colors.textPrimary,
    fontFamily: 'monospace',
    lineHeight: 15,
  },
  smsHindiText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 4,
    lineHeight: 15,
  },
  vetViewBtn: {
    backgroundColor: THEME.colors.primaryDark,
    paddingVertical: 14,
    borderRadius: THEME.radius.lg,
    alignItems: 'center',
    marginTop: 4,
  },
  vetViewBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
