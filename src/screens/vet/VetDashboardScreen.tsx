import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Cow, VetCase, AppLanguage } from '../../types';
import { THEME } from '../../constants/theme';
import { StatCard } from '../../components/StatCard';
import { RiskBadge } from '../../components/RiskBadge';
import { VetConfirmCaseModal } from './VetConfirmCaseModal';

interface VetDashboardScreenProps {
  cows: Cow[];
  vetCases: VetCase[];
  language: AppLanguage;
  onSelectCow: (cow: Cow) => void;
  onNavigateToTriage: () => void;
  onRefreshCases: () => void;
}

export const VetDashboardScreen: React.FC<VetDashboardScreenProps> = ({
  cows,
  vetCases,
  language,
  onSelectCow,
  onNavigateToTriage,
  onRefreshCases,
}) => {
  const [selectedCaseForModal, setSelectedCaseForModal] = useState<VetCase | null>(null);

  const pendingCases = vetCases.filter(c => c.status === 'PENDING_REVIEW');
  const confirmedCases = vetCases.filter(c => c.status.startsWith('CONFIRMED'));
  const highRiskCows = cows.filter(c => c.riskScore >= 70);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Command Banner */}
      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View style={styles.heroTextBlock}>
            <View style={styles.vetPill}>
              <Text style={styles.vetPillText}>● VET COMMAND · SOUTH BENGAL HUB</Text>
            </View>
            <Text style={styles.heroTitle}>Dr. Meera Roy, MVSc</Text>
            <Text style={styles.heroSub}>
              Triaging 4 dairy farms & 312 animals. Focus on early subclinical cases needing targeted therapy today.
            </Text>
          </View>
          <View style={styles.avatar}>
            <Text style={{ fontSize: 26 }}>🩺</Text>
          </View>
        </View>

        <View style={styles.loopPill}>
          <Text style={styles.loopPillText}>
            🔄 MLflow Registry: 8 confirmed labels queued for monthly XGBoost retrain
          </Text>
        </View>
      </View>

      {/* 2x2 KPI Stats Grid */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <StatCard label="ACTION TODAY" value={pendingCases.length} subtext="Urgent triage" accentColor={THEME.colors.riskHigh} />
          <StatCard label="CONFIRMED" value={confirmedCases.length} subtext="Targeted cure" accentColor={THEME.colors.primary} />
        </View>
        <View style={styles.statsRow}>
          <StatCard label="FARMS ACTIVE" value="4" subtext="Nadia & Hooghly" accentColor={THEME.colors.textPrimary} />
          <StatCard label="ML LABELS" value="12" subtext="Training loop" accentColor={THEME.colors.goldAccent} />
        </View>
      </View>

      {/* Priority Herd Triage List */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Priority Herd Triage Queue</Text>
            <Text style={styles.sectionSub}>Ranked by calibrated risk % and multi-sensor drift slope</Text>
          </View>
          <TouchableOpacity onPress={onNavigateToTriage}>
            <Text style={styles.seeAllText}>All Cases →</Text>
          </TouchableOpacity>
        </View>

        {highRiskCows.map((cow, idx) => (
          <View key={cow.id} style={styles.triageCard}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankNum}>#{idx + 1}</Text>
            </View>

            <View style={styles.cowInfo}>
              <View style={styles.cowTopRow}>
                <Text style={styles.cowTitle}>Tag #{cow.id} · {cow.name}</Text>
                <RiskBadge score={cow.riskScore} level={cow.riskLevel} size="small" />
              </View>

              <Text style={styles.cowDetails}>
                {cow.breed} · Affected: <Text style={{ fontWeight: '800', color: THEME.colors.riskHighText }}>{cow.primaryQuarter} Quarter</Text> (+{cow.tubeTempDiff}°C)
              </Text>

              <Text style={styles.driverSummary}>
                SHAP Top Drivers: SCC {cow.sccBand} (+38%), Tube Heat (+31%), Rumination (-18%)
              </Text>

              <View style={styles.actionButtonsRow}>
                <TouchableOpacity
                  style={styles.inspectBtn}
                  onPress={() => onSelectCow(cow)}
                >
                  <Text style={styles.inspectBtnText}>Inspect Signals</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmBtn}
                  onPress={() => {
                    const matchingCase = vetCases.find(vc => vc.cowId === cow.id) || {
                      id: `VET-CASE-${cow.id}`,
                      cowId: cow.id,
                      cowName: cow.name,
                      tagNumber: cow.tagNumber,
                      farmName: 'Das Dairy Farm (Arun Das)',
                      district: 'Nadia',
                      riskScore: cow.riskScore,
                      affectedQuarter: cow.primaryQuarter === 'None' ? 'LR' : cow.primaryQuarter,
                      submittedAt: 'Today',
                      status: 'PENDING_REVIEW',
                      labeledForTraining: false,
                    };
                    setSelectedCaseForModal(matchingCase);
                  }}
                >
                  <Text style={styles.confirmBtnText}>Confirm Diagnosis ✓</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Case Workflow Steps Tracker */}
      <View style={styles.workflowCard}>
        <Text style={styles.wfTitle}>Closed-Loop Learning Pipeline</Text>
        <Text style={styles.wfSub}>How field findings improve the XGBoost model</Text>

        <View style={styles.wfStepsRow}>
          <View style={[styles.wfStep, styles.wfDone]}>
            <Text style={styles.wfStepNum}>01</Text>
            <Text style={styles.wfStepLabel}>Drift Alert</Text>
            <Text style={styles.wfStatusIcon}>✓</Text>
          </View>
          <View style={[styles.wfStep, styles.wfActive]}>
            <Text style={styles.wfStepNum}>02</Text>
            <Text style={styles.wfStepLabel}>Vet Triage</Text>
            <Text style={styles.wfStatusIcon}>2 active</Text>
          </View>
          <View style={styles.wfStep}>
            <Text style={styles.wfStepNum}>03</Text>
            <Text style={styles.wfStepLabel}>Diagnosis</Text>
            <Text style={styles.wfStatusIcon}>CMT gel</Text>
          </View>
          <View style={styles.wfStep}>
            <Text style={styles.wfStepNum}>04</Text>
            <Text style={styles.wfStepLabel}>ML Label</Text>
            <Text style={styles.wfStatusIcon}>MLflow</Text>
          </View>
        </View>
      </View>

      {/* Vet Confirmation Modal */}
      <VetConfirmCaseModal
        visible={!!selectedCaseForModal}
        vetCase={selectedCaseForModal}
        onClose={() => setSelectedCaseForModal(null)}
        onCaseUpdated={onRefreshCases}
      />
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
  heroCard: {
    backgroundColor: THEME.colors.primaryDark,
    borderRadius: 20,
    padding: 18,
    ...THEME.shadows.cardElevated,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroTextBlock: {
    flex: 1,
    paddingRight: 10,
  },
  vetPill: {
    marginBottom: 6,
  },
  vetPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.riskHealthy,
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFF',
  },
  heroSub: {
    fontSize: 11.5,
    color: THEME.colors.textMuted,
    marginTop: 4,
    lineHeight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: THEME.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: THEME.colors.goldBorder,
  },
  loopPill: {
    backgroundColor: 'rgba(201, 151, 38, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.radius.sm,
    marginTop: 12,
    borderWidth: 1,
    borderColor: THEME.colors.goldBorder,
  },
  loopPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.goldAccent,
  },
  statsContainer: {
    gap: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  sectionSub: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 1,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.primaryMedium,
  },
  triageCard: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.creamCard,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: THEME.colors.riskHighBorder,
    gap: 12,
    ...THEME.shadows.card,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.colors.riskHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNum: {
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '900',
  },
  cowInfo: {
    flex: 1,
  },
  cowTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cowTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  cowDetails: {
    fontSize: 11.5,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  driverSummary: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.riskHighText,
    marginTop: 4,
    lineHeight: 15,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  inspectBtn: {
    backgroundColor: THEME.colors.creamCardSubtle,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
  },
  inspectBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  confirmBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: THEME.radius.sm,
    flex: 1,
    alignItems: 'center',
  },
  confirmBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFF',
  },
  workflowCard: {
    backgroundColor: THEME.colors.creamCard,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
    ...THEME.shadows.card,
  },
  wfTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  wfSub: {
    fontSize: 10.5,
    color: THEME.colors.textMuted,
    marginTop: 2,
    marginBottom: 12,
  },
  wfStepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  wfStep: {
    flex: 1,
    backgroundColor: THEME.colors.creamCardSubtle,
    padding: 10,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
  },
  wfDone: {
    backgroundColor: THEME.colors.primarySurface,
    borderColor: THEME.colors.primaryBorder,
  },
  wfActive: {
    borderColor: THEME.colors.riskHigh,
    backgroundColor: THEME.colors.riskHighBg,
  },
  wfStepNum: {
    fontSize: 12.5,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
  },
  wfStepLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
    marginVertical: 3,
  },
  wfStatusIcon: {
    fontSize: 9.5,
    fontWeight: '800',
    color: THEME.colors.primaryMedium,
  },
});
