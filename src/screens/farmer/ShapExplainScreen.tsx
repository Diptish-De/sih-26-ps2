import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Cow, AppLanguage } from '../../types';
import { THEME } from '../../constants/theme';
import { ShapWaterfall } from '../../components/ShapWaterfall';
import { RiskBadge } from '../../components/RiskBadge';
import { TRANSLATIONS } from '../../constants/i18n';

interface ShapExplainScreenProps {
  cow: Cow;
  language: AppLanguage;
  onBack: () => void;
  onProceedToActionPlan: () => void;
}

export const ShapExplainScreen: React.FC<ShapExplainScreenProps> = ({
  cow,
  language,
  onBack,
  onProceedToActionPlan,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {/* Top Navigation */}
      <View style={styles.topNavRow}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>← Back to #{cow.id} {cow.name}</Text>
        </TouchableOpacity>
        <RiskBadge score={cow.riskScore} level={cow.riskLevel} size="small" />
      </View>

      {/* Header Banner */}
      <View style={styles.headerCard}>
        <View style={styles.iconCircle}>
          <Text style={{ fontSize: 24 }}>🧠</Text>
        </View>
        <Text style={styles.headerTitle}>{t.whyAtRisk}</Text>
        <Text style={styles.headerSubtitle}>
          Instead of an unexplainable black-box score, KSHEER-RAKSHAK reveals the precise physiological factors causing this alert.
        </Text>
      </View>

      {/* Primary Plain-Language Reason Quote */}
      <View style={styles.plainReasonCard}>
        <Text style={styles.quoteMark}>“</Text>
        <Text style={styles.plainReasonText}>
          {cow.name} is showing a <Text style={{ fontWeight: '800' }}>synchronized drift across 4 distinct sensors</Text> compared to her own healthy 30-day baseline. The <Text style={{ fontWeight: '800', color: THEME.colors.riskHighText }}>{cow.primaryQuarter} quarter</Text> is hyperthermic (+{cow.tubeTempDiff}°C) and milk electrical conductivity has elevated, confirming early subclinical inflammation.
        </Text>
      </View>

      {/* SHAP Waterfall Interactive Breakdown */}
      <ShapWaterfall
        drivers={cow.shapDrivers}
        cowName={cow.name}
        language={language}
      />

      {/* ICAR-NDRI Research Proof Card */}
      <View style={styles.proofCard}>
        <View style={styles.proofHeader}>
          <Text style={styles.proofIcon}>📜</Text>
          <Text style={styles.proofTitle}>Scientific Research Grounding</Text>
        </View>
        <Text style={styles.proofBody}>
          ICAR-NDRI Karnal (Satheesan et al. 2024, Journal of Thermal Biology) demonstrated that thermography flags mastitis infection in Indian Sahiwal cows from <Text style={{ fontWeight: '800' }}>Day −10 with SCC correlation r = 0.84</Text>. Gayathri et al. (2023) established that milk-tube thermograms elevate by <Text style={{ fontWeight: '800' }}>+1.11°C</Text> in subclinical cases.
        </Text>
      </View>

      {/* Action CTA */}
      <TouchableOpacity
        style={styles.actionBtn}
        activeOpacity={0.85}
        onPress={onProceedToActionPlan}
      >
        <Text style={styles.actionBtnText}>Proceed to Action Plan: What To Do Today →</Text>
      </TouchableOpacity>
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
  headerCard: {
    backgroundColor: THEME.colors.primaryDark,
    borderRadius: THEME.radius.xl,
    padding: 16,
    alignItems: 'center',
    textAlign: 'center',
    ...THEME.shadows.cardElevated,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: THEME.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: THEME.colors.goldBorder,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
    paddingHorizontal: 10,
  },
  plainReasonCard: {
    backgroundColor: THEME.colors.creamCard,
    borderRadius: THEME.radius.lg,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: THEME.colors.goldAccent,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
    ...THEME.shadows.card,
  },
  quoteMark: {
    fontSize: 28,
    fontWeight: '900',
    color: THEME.colors.goldAccent,
    lineHeight: 28,
  },
  plainReasonText: {
    fontSize: 12.5,
    color: THEME.colors.textPrimary,
    lineHeight: 18,
    marginTop: -8,
  },
  proofCard: {
    backgroundColor: THEME.colors.goldLight,
    borderRadius: THEME.radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.goldBorder,
  },
  proofHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  proofIcon: {
    fontSize: 16,
  },
  proofTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
  },
  proofBody: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    lineHeight: 15,
  },
  actionBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 14,
    borderRadius: THEME.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...THEME.shadows.card,
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
