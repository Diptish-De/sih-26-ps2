import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Cow, AppLanguage } from '../../types';
import { THEME } from '../../constants/theme';
import { RiskBadge } from '../../components/RiskBadge';
import { UdderHeatmap } from '../../components/UdderHeatmap';
import { TrendChart } from '../../components/TrendChart';
import { TRANSLATIONS } from '../../constants/i18n';

interface CowDetailScreenProps {
  cow: Cow;
  language: AppLanguage;
  onBack: () => void;
  onOpenShap: () => void;
  onOpenActionPlan: () => void;
  onOpenCmtScan: () => void;
}

export const CowDetailScreen: React.FC<CowDetailScreenProps> = ({
  cow,
  language,
  onBack,
  onOpenShap,
  onOpenActionPlan,
  onOpenCmtScan,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Back button & Tag Row */}
      <View style={styles.topNavRow}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>← Back to Herd</Text>
        </TouchableOpacity>
        <View style={styles.tagBadge}>
          <Text style={styles.tagText}>{cow.tagNumber}</Text>
        </View>
      </View>

      {/* Cow Identity & Risk Banner */}
      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.cowAvatar}>
            <Text style={styles.avatarChar}>{cow.name[0]}</Text>
          </View>
          <View style={styles.profileMeta}>
            <Text style={styles.cowName}>#{cow.id} · {cow.name}</Text>
            <Text style={styles.breedLine}>
              {cow.breed} · Female · {cow.ageYears} yrs · Parity {cow.parity}
            </Text>
            <Text style={styles.lactationLine}>
              Lactation Day {cow.lactationDay} · Daily Yield {cow.currentMilkYield} L (avg {cow.avgMilkYield} L)
            </Text>
          </View>
        </View>

        <View style={styles.riskBannerRow}>
          <View style={styles.riskInfoBlock}>
            <Text style={styles.riskPromptLabel}>CALIBRATED FORECAST RISK</Text>
            <Text style={styles.riskSubLead}>{t.forecastLead}</Text>
          </View>
          <RiskBadge score={cow.riskScore} level={cow.riskLevel} size="large" />
        </View>

        {/* Explainable AI trigger prompt */}
        <TouchableOpacity style={styles.whyButton} activeOpacity={0.85} onPress={onOpenShap}>
          <View style={styles.whyBtnContent}>
            <Text style={styles.whyIcon}>💡</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.whyTitle}>{t.whyAtRisk}</Text>
              <Text style={styles.whySubtitle}>Inspect 4 SHAP-attributed physical drivers</Text>
            </View>
          </View>
          <Text style={styles.whyArrow}>Explain →</Text>
        </TouchableOpacity>
      </View>

      {/* 4-Quarter Tube Heatmap */}
      <UdderHeatmap quarters={cow.quarters} />

      {/* Sensor Signals vs 30-Day Own Baseline */}
      <View style={styles.signalsCard}>
        <View style={styles.signalsHeader}>
          <View>
            <Text style={styles.signalsTitle}>Drift vs Own 30-Day Healthy Baseline</Text>
            <Text style={styles.signalsSubtitle}>Individualized z-score drift tracking</Text>
          </View>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>{cow.sensorStatus}</Text>
          </View>
        </View>

        <View style={styles.sensorGrid}>
          <View style={styles.sensorItem}>
            <Text style={styles.sensorLabel}>SOMATIC CELL (SCC)</Text>
            <Text style={[styles.sensorVal, cow.sccCellsPerMl > 400000 && { color: THEME.colors.riskHighText }]}>
              {(cow.sccCellsPerMl / 100000).toFixed(1)} Lakh/mL
            </Text>
            <Text style={styles.sensorStatus}>Band: {cow.sccBand}</Text>
          </View>

          <View style={styles.sensorItem}>
            <Text style={styles.sensorLabel}>TUBE HEAT DIFF</Text>
            <Text style={[styles.sensorVal, cow.tubeTempDiff >= 1.0 && { color: THEME.colors.riskHighText }]}>
              {cow.tubeTempDiff >= 0 ? `+${cow.tubeTempDiff}°C` : `${cow.tubeTempDiff}°C`}
            </Text>
            <Text style={styles.sensorStatus}>Gayathri 2023 proof</Text>
          </View>

          <View style={styles.sensorItem}>
            <Text style={styles.sensorLabel}>MILK EC (CONDUCTIVITY)</Text>
            <Text style={styles.sensorVal}>{cow.milkEc} mS/cm</Text>
            <Text style={styles.sensorStatus}>Temp-compensated</Text>
          </View>

          <View style={styles.sensorItem}>
            <Text style={styles.sensorLabel}>RUMINATION TIME</Text>
            <Text style={[styles.sensorVal, cow.ruminationDropPct > 10 && { color: THEME.colors.riskHighText }]}>
              {cow.ruminationMin} min/day
            </Text>
            <Text style={styles.sensorStatus}>-{cow.ruminationDropPct}% collar drop</Text>
          </View>
        </View>

        <View style={styles.thiNote}>
          <Text style={styles.thiText}>
            🌡️ <Text style={{ fontWeight: '700' }}>Barn THI Index: {cow.thiIndex}</Text> (Temperature-Humidity Index). Outlier clipping applied at ESP32-C3 edge gateway.
          </Text>
        </View>
      </View>

      {/* 14-Day Trajectory Curve */}
      <TrendChart data={cow.forecast14Days} />

      {/* Action Bar */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.cmtActionBtn} activeOpacity={0.8} onPress={onOpenCmtScan}>
          <Text style={styles.cmtActionIcon}>📷</Text>
          <Text style={styles.cmtActionText}>Run CMT Camera Scan</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.planActionBtn} activeOpacity={0.8} onPress={onOpenActionPlan}>
          <Text style={styles.planActionIcon}>📋</Text>
          <Text style={styles.planActionText}>View Action Plan</Text>
        </TouchableOpacity>
      </View>
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
    gap: 18,
  },
  topNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
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
  tagBadge: {
    backgroundColor: THEME.colors.primarySurface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.primaryBorder,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.colors.primaryDark,
  },
  profileCard: {
    backgroundColor: THEME.colors.creamCard,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
    ...THEME.shadows.cardElevated,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  cowAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: THEME.colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: THEME.colors.primaryBorder,
  },
  avatarChar: {
    fontSize: 26,
    fontWeight: '900',
    color: THEME.colors.primaryDark,
  },
  profileMeta: {
    flex: 1,
  },
  cowName: {
    fontSize: 19,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
  },
  breedLine: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  lactationLine: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  riskBannerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME.colors.creamCardSubtle,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
    marginBottom: 14,
  },
  riskInfoBlock: {
    flex: 1,
    paddingRight: 10,
  },
  riskPromptLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: THEME.colors.textMuted,
    letterSpacing: 0.6,
  },
  riskSubLead: {
    fontSize: 11.5,
    fontWeight: '700',
    color: THEME.colors.primaryDark,
    marginTop: 3,
  },
  whyButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME.colors.primarySurface,
    borderRadius: THEME.radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.primaryBorder,
  },
  whyBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  whyIcon: {
    fontSize: 22,
  },
  whyTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: THEME.colors.primaryDark,
  },
  whySubtitle: {
    fontSize: 10.5,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  whyArrow: {
    fontSize: 12,
    fontWeight: '900',
    color: THEME.colors.primaryMedium,
  },
  signalsCard: {
    backgroundColor: THEME.colors.creamCard,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
    ...THEME.shadows.card,
  },
  signalsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  signalsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  signalsSubtitle: {
    fontSize: 10.5,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  statusPill: {
    backgroundColor: THEME.colors.riskLowBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.sm,
  },
  statusPillText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: THEME.colors.riskLowText,
  },
  sensorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  sensorItem: {
    width: '48%',
    backgroundColor: THEME.colors.creamCardSubtle,
    padding: 12,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
    justifyContent: 'space-between',
    minHeight: 74,
  },
  sensorLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    color: THEME.colors.textMuted,
    letterSpacing: 0.5,
  },
  sensorVal: {
    fontSize: 15,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
    marginVertical: 2,
  },
  sensorStatus: {
    fontSize: 10,
    color: THEME.colors.textSecondary,
    fontWeight: '600',
  },
  thiNote: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.divider,
  },
  thiText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    lineHeight: 15,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  cmtActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.primaryDark,
    paddingVertical: 14,
    borderRadius: THEME.radius.lg,
    gap: 8,
  },
  cmtActionIcon: {
    fontSize: 16,
  },
  cmtActionText: {
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  planActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.goldAccent,
    paddingVertical: 14,
    borderRadius: THEME.radius.lg,
    gap: 8,
  },
  planActionIcon: {
    fontSize: 16,
  },
  planActionText: {
    color: '#000',
    fontSize: 12.5,
    fontWeight: '800',
  },
});
