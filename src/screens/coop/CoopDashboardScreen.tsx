import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { DistrictHotspot, AppLanguage } from '../../types';
import { THEME } from '../../constants/theme';
import { StatCard } from '../../components/StatCard';

interface CoopDashboardScreenProps {
  hotspots: DistrictHotspot[];
  language: AppLanguage;
  onNavigateToHotspots: () => void;
}

export const CoopDashboardScreen: React.FC<CoopDashboardScreenProps> = ({
  hotspots,
  language,
  onNavigateToHotspots,
}) => {
  const totalFarms = hotspots.reduce((acc, h) => acc + h.farmsCount, 0);
  const totalCows = hotspots.reduce((acc, h) => acc + h.cowsMonitored, 0);
  const totalHighAlerts = hotspots.reduce((acc, h) => acc + h.highRiskAlerts, 0);
  const avgDistrictRisk = Math.round(
    hotspots.reduce((acc, h) => acc + h.herdRiskIndex, 0) / hotspots.length
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Regional Hero Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <View style={styles.pill}>
              <Text style={styles.pillText}>● COOPERATIVE & DAHD MONITORING</Text>
            </View>
            <Text style={styles.heroTitle}>District Milk Union</Text>
            <Text style={styles.heroSub}>
              South Bengal Regional Federation. Real-time milk quality, bulk tank SCC, and proactive veterinary dispatch.
            </Text>
          </View>
          <View style={styles.regionRing}>
            <Text style={styles.regionScore}>{avgDistrictRisk}%</Text>
            <Text style={styles.regionScoreLabel}>Avg Risk</Text>
          </View>
        </View>

        <View style={styles.privacyNote}>
          <Text style={styles.privacyText}>
            🔒 Anonymized Spatial Rollup: Privacy-preserving aggregation protects smallholder identities while enabling herd interventions.
          </Text>
        </View>
      </View>

      {/* 2x2 KPI Row */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <StatCard label="CO-OP FARMS" value={totalFarms} subtext="Reporting live" accentColor={THEME.colors.textPrimary} />
          <StatCard label="COWS MONITORED" value={totalCows} subtext="In district pool" accentColor={THEME.colors.primary} />
        </View>
        <View style={styles.statsRow}>
          <StatCard label="CLUSTER ALERTS" value={totalHighAlerts} subtext="Past 7 days" accentColor={THEME.colors.riskHigh} />
          <StatCard label="DATA COVERAGE" value="96.4%" subtext="Gateways active" accentColor={THEME.colors.riskLow} />
        </View>
      </View>

      {/* Bulk Tank SCC Quality Grade */}
      <View style={styles.qualityCard}>
        <View style={styles.qualityHeader}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.qualityTitle}>Bulk Tank SCC & Milk Grading</Text>
            <Text style={styles.qualitySub}>Safeguarding cooperative collection centers from antibiotic milk</Text>
          </View>
          <View style={styles.gradeBadge}>
            <Text style={styles.gradeText}>Grade A Premium</Text>
          </View>
        </View>

        <View style={styles.qualityMetricsRow}>
          <View style={styles.qMetric}>
            <Text style={styles.qLabel}>BULK TANK SCC</Text>
            <Text style={styles.qVal}>260,000 /mL</Text>
            <Text style={styles.qSub}>Safe &lt; 400k</Text>
          </View>
          <View style={styles.qMetric}>
            <Text style={styles.qLabel}>REJECTED BATCHES</Text>
            <Text style={[styles.qVal, { color: THEME.colors.riskLowText }]}>0 Batches</Text>
            <Text style={styles.qSub}>-85% vs baseline</Text>
          </View>
          <View style={styles.qMetric}>
            <Text style={styles.qLabel}>AMR COMPLIANCE</Text>
            <Text style={[styles.qVal, { color: THEME.colors.primaryDark }]}>99.2%</Text>
            <Text style={styles.qSub}>Adherence</Text>
          </View>
        </View>
      </View>

      {/* Proactive Response Queue */}
      <View style={styles.responseCard}>
        <View style={styles.resHeader}>
          <Text style={styles.resTitle}>Actionable Cooperative Response Queue</Text>
          <Text style={styles.resSub}>AI-directed veterinary and extension worker routing</Text>
        </View>

        <View style={styles.resList}>
          <View style={styles.resItem}>
            <View style={styles.resNumBox}>
              <Text style={styles.resNum}>3</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.resItemTitle}>Targeted Vet Dispatches to Nadia Hotspot</Text>
              <Text style={styles.resItemSub}>Cluster of 7 high-risk alerts detected in Nakashipara cluster.</Text>
            </View>
          </View>

          <View style={styles.resItem}>
            <View style={[styles.resNumBox, { backgroundColor: THEME.colors.goldLight }]}>
              <Text style={[styles.resNum, { color: THEME.colors.goldAccent }]}>2</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.resItemTitle}>Solar Gateway Telemetry Checks</Text>
              <Text style={styles.resItemSub}>Hooghly station KR-04 reporting intermittent GSM fallback.</Text>
            </View>
          </View>

          <View style={styles.resItem}>
            <View style={[styles.resNumBox, { backgroundColor: THEME.colors.primarySurface }]}>
              <Text style={[styles.resNum, { color: THEME.colors.primaryMedium }]}>15</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.resItemTitle}>Subsidized Teat-Dip & Reagent Delivery</Text>
              <Text style={styles.resItemSub}>₹3 CMT reagent packs dispatched to cooperative milk chilling centers.</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.mapCtaBtn} activeOpacity={0.85} onPress={onNavigateToHotspots}>
          <Text style={styles.mapCtaText}>Inspect Regional GIS Hotspot Map →</Text>
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
  pill: {
    marginBottom: 4,
  },
  pillText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: THEME.colors.goldAccent,
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
  regionRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: THEME.colors.primaryLight,
    borderWidth: 2,
    borderColor: THEME.colors.goldAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  regionScore: {
    fontSize: 19,
    fontWeight: '900',
    color: '#FFF',
  },
  regionScoreLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: THEME.colors.goldLight,
    textTransform: 'uppercase',
  },
  privacyNote: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 10,
    borderRadius: THEME.radius.md,
    marginTop: 12,
  },
  privacyText: {
    fontSize: 10.5,
    color: '#BDDCD0',
    lineHeight: 14,
  },
  statsContainer: {
    gap: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  qualityCard: {
    backgroundColor: THEME.colors.creamCard,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
    ...THEME.shadows.card,
  },
  qualityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  qualityTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  qualitySub: {
    fontSize: 10.5,
    color: THEME.colors.textMuted,
    marginTop: 1,
  },
  gradeBadge: {
    backgroundColor: THEME.colors.riskLowBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.riskLowBorder,
  },
  gradeText: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.riskLowText,
  },
  qualityMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.creamCardSubtle,
    padding: 12,
    borderRadius: THEME.radius.md,
  },
  qMetric: {
    alignItems: 'flex-start',
  },
  qLabel: {
    fontSize: 8.5,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    letterSpacing: 0.5,
  },
  qVal: {
    fontSize: 13.5,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
    marginVertical: 2,
  },
  qSub: {
    fontSize: 9.5,
    color: THEME.colors.textSecondary,
  },
  responseCard: {
    backgroundColor: THEME.colors.creamCard,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
    ...THEME.shadows.card,
  },
  resHeader: {
    marginBottom: 12,
  },
  resTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  resSub: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  resList: {
    gap: 10,
    marginBottom: 14,
  },
  resItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    backgroundColor: THEME.colors.creamCardSubtle,
    padding: 12,
    borderRadius: THEME.radius.md,
  },
  resNumBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.colors.riskHighBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resNum: {
    fontSize: 14,
    fontWeight: '900',
    color: THEME.colors.riskHighText,
  },
  resItemTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  resItemSub: {
    fontSize: 10.5,
    color: THEME.colors.textSecondary,
    marginTop: 2,
    lineHeight: 14,
  },
  mapCtaBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 12,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
  },
  mapCtaText: {
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
});
