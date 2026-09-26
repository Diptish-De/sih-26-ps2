import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Cow, AlertNotification, AppLanguage } from '../../types';
import { THEME } from '../../constants/theme';
import { RiskBadge } from '../../components/RiskBadge';
import { StatCard } from '../../components/StatCard';
import { TRANSLATIONS } from '../../constants/i18n';
import { mockApiService } from '../../services/mockApiService';

interface FarmerDashboardProps {
  cows: Cow[];
  alerts: AlertNotification[];
  language: AppLanguage;
  onSelectCow: (cow: Cow) => void;
  onNavigate: (tab: string) => void;
  onStartDemoFlow: () => void;
}

export const FarmerDashboardScreen: React.FC<FarmerDashboardProps> = ({
  cows,
  alerts,
  language,
  onSelectCow,
  onNavigate,
  onStartDemoFlow,
}) => {
  const t = TRANSLATIONS[language];
  const gateway = mockApiService.getGatewayStatus();
  const offlineStatus = mockApiService.getOfflineStatus();

  // Metrics
  const totalCows = cows.length;
  const highRiskCows = cows.filter(c => c.riskLevel === 'HIGH');
  const watchCows = cows.filter(c => c.riskLevel === 'MODERATE');
  const healthyCows = cows.filter(c => c.riskLevel === 'HEALTHY' || c.riskLevel === 'LOW');
  const primaryHighRisk = highRiskCows[0] || cows[0];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Farm & Herd Overview Hero Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View style={styles.farmTitleBlock}>
            <View style={styles.farmBadge}>
              <Text style={styles.farmBadgeDot}>●</Text>
              <Text style={styles.farmBadgeText}>Das Dairy Farm · Nadia, WB</Text>
            </View>
            <Text style={styles.heroTitle}>Early Mastitis Shield</Text>
            <Text style={styles.heroSubtitle}>
              Monitoring 20 dairy animals against each cow’s individual 30-day baseline.
            </Text>
          </View>
          <View style={styles.healthRing}>
            <Text style={styles.healthScore}>84</Text>
            <Text style={styles.healthLabel}>Herd Index</Text>
          </View>
        </View>

        {/* SIH Story Quick Action Button */}
        <TouchableOpacity
          style={styles.storyHeroBtn}
          activeOpacity={0.85}
          onPress={onStartDemoFlow}
        >
          <View style={styles.storyBtnContent}>
            <Text style={styles.storyIcon}>⚡</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.storyBtnTitle}>Start SIH 2026 Judge Demo Story</Text>
              <Text style={styles.storyBtnSub}>Sense → Edge → Learn → Forecast → Explain → Act</Text>
            </View>
          </View>
          <Text style={styles.storyArrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* 2x2 Clean Grid for KPIs (prevents horizontal squishing) */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <StatCard
            label="TOTAL HERD"
            value={totalCows}
            subtext="Sahiwal, Gir, Murrah"
            accentColor={THEME.colors.textPrimary}
          />
          <StatCard
            label="HIGH RISK"
            value={highRiskCows.length}
            subtext="Action required today"
            accentColor={THEME.colors.riskHigh}
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard
            label="WATCHLIST"
            value={watchCows.length}
            subtext="Drift detected"
            accentColor={THEME.colors.riskModerate}
          />
          <StatCard
            label="HEALTHY"
            value={healthyCows.length}
            subtext="Optimal baseline"
            accentColor={THEME.colors.riskLow}
          />
        </View>
      </View>

      {/* Urgent Action Alert Callout (Ganga & Nandini) */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Urgent Attention Required</Text>
            <Text style={styles.sectionSubtitle}>Drift flagged 7–14 days before visible symptoms</Text>
          </View>
          <TouchableOpacity onPress={() => onNavigate('farmer_herd')}>
            <Text style={styles.seeAllText}>View All ({totalCows}) →</Text>
          </TouchableOpacity>
        </View>

        {highRiskCows.map(cow => (
          <TouchableOpacity
            key={cow.id}
            style={styles.highRiskCard}
            activeOpacity={0.85}
            onPress={() => onSelectCow(cow)}
          >
            <View style={styles.cowAvatar}>
              <Text style={styles.avatarLetter}>{cow.name[0]}</Text>
            </View>
            <View style={styles.cowInfo}>
              <View style={styles.cowNameRow}>
                <Text style={styles.cowName}>#{cow.id} · {cow.name}</Text>
                <RiskBadge score={cow.riskScore} level={cow.riskLevel} size="small" />
              </View>
              <Text style={styles.cowMeta}>
                {cow.breed} · {cow.primaryQuarter} Quarter · Tube Heat +{cow.tubeTempDiff}°C
              </Text>
              <Text style={styles.cowDriverPreview}>
                ⚠️ SCC Band {cow.sccBand} rising; rumination {cow.ruminationDropPct}% drop
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Edge Gateway & Connectivity Diagnostics */}
      <View style={styles.gatewayCard}>
        <View style={styles.gwHeader}>
          <View style={styles.gwBrand}>
            <Text style={styles.gwIcon}>📡</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.gwTitle}>Edge Gateway: {gateway.gatewayId}</Text>
              <Text style={styles.gwSubtitle}>ESP32-C3 · {gateway.protocol} · {gateway.firmwareVersion}</Text>
            </View>
          </View>
          <View style={[styles.gwStatusPill, offlineStatus.isOffline ? styles.gwOffline : styles.gwOnline]}>
            <Text style={styles.gwStatusText}>
              {offlineStatus.isOffline ? 'SD Buffering' : 'Active Live'}
            </Text>
          </View>
        </View>

        <View style={styles.gwMetricsRow}>
          <View style={styles.gwMetric}>
            <Text style={styles.gwMetricLabel}>SOLAR BATTERY</Text>
            <Text style={styles.gwMetricVal}>⚡ {gateway.batteryPercent}%</Text>
          </View>
          <View style={styles.gwMetric}>
            <Text style={styles.gwMetricLabel}>BUFFERED SD PACKETS</Text>
            <Text style={styles.gwMetricVal}>{offlineStatus.pendingSyncCount} pkts</Text>
          </View>
          <View style={styles.gwMetric}>
            <Text style={styles.gwMetricLabel}>LAST SYNC</Text>
            <Text style={styles.gwMetricVal}>{offlineStatus.lastSync}</Text>
          </View>
        </View>

        <View style={styles.gwActionsRow}>
          <TouchableOpacity
            style={styles.gwSyncBtn}
            onPress={async () => {
              await mockApiService.triggerSyncNow();
            }}
          >
            <Text style={styles.gwSyncBtnText}>Sync SD Buffer Now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gwSmsBtn}
            onPress={() => {
              mockApiService.dispatchManualSms(primaryHighRisk.id);
            }}
          >
            <Text style={styles.gwSmsBtnText}>Test GSM/SMS Fallback</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Launchpad Buttons */}
      <View style={styles.actionGrid}>
        <TouchableOpacity
          style={styles.actionBox}
          activeOpacity={0.8}
          onPress={() => onNavigate('farmer_cmt')}
        >
          <Text style={styles.actionBoxIcon}>📷</Text>
          <Text style={styles.actionBoxTitle}>CMT Camera Scan</Text>
          <Text style={styles.actionBoxSub}>₹3 test · on-device TFLite CNN</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBox}
          activeOpacity={0.8}
          onPress={() => onNavigate('farmer_herd')}
        >
          <Text style={styles.actionBoxIcon}>🐄</Text>
          <Text style={styles.actionBoxTitle}>Herd Ranking</Text>
          <Text style={styles.actionBoxSub}>Sort by 14d drift slope</Text>
        </TouchableOpacity>
      </View>

      {/* National Economic Context from Slide 2 & 4 */}
      <View style={styles.economicCard}>
        <View style={styles.ecoIcon}>
          <Text style={{ fontSize: 22 }}>₹</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.ecoTitle}>National Economic Payback</Text>
          <Text style={styles.ecoBody}>
            {t.nationalLossFact}. With KSHEER-RAKSHAK early prediction, save <Text style={{ fontWeight: '800' }}>₹1,390 per cow</Text> every lactation — paying back the ₹375 sensor unit inside a single lactation!
          </Text>
        </View>
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
  farmTitleBlock: {
    flex: 1,
    paddingRight: 10,
  },
  farmBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
  },
  farmBadgeDot: {
    color: THEME.colors.riskHealthy,
    fontSize: 10,
  },
  farmBadgeText: {
    color: '#BDDCD0',
    fontSize: 11,
    fontWeight: '700',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 0.3,
  },
  heroSubtitle: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginTop: 4,
    lineHeight: 16,
  },
  healthRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: THEME.colors.primaryLight,
    borderWidth: 2.5,
    borderColor: THEME.colors.goldAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  healthScore: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFF',
  },
  healthLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: THEME.colors.goldLight,
    textTransform: 'uppercase',
  },
  storyHeroBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME.colors.goldLight,
    borderRadius: THEME.radius.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: THEME.colors.goldBorder,
  },
  storyBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  storyIcon: {
    fontSize: 20,
  },
  storyBtnTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: THEME.colors.primaryDark,
  },
  storyBtnSub: {
    fontSize: 10,
    fontWeight: '600',
    color: THEME.colors.goldAccent,
    marginTop: 1,
  },
  storyArrow: {
    fontSize: 18,
    fontWeight: '900',
    color: THEME.colors.primaryDark,
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
    fontSize: 16,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.primaryMedium,
  },
  highRiskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.creamCard,
    padding: 14,
    borderRadius: THEME.radius.lg,
    borderWidth: 1.5,
    borderColor: THEME.colors.riskHighBorder,
    gap: 12,
    ...THEME.shadows.card,
  },
  cowAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: THEME.colors.riskHighBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: THEME.colors.riskHighBorder,
  },
  avatarLetter: {
    fontSize: 20,
    fontWeight: '900',
    color: THEME.colors.riskHighText,
  },
  cowInfo: {
    flex: 1,
  },
  cowNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  cowName: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  cowMeta: {
    fontSize: 11.5,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
    marginBottom: 2,
  },
  cowDriverPreview: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.riskHighText,
    marginTop: 3,
    lineHeight: 15,
  },
  chevron: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.colors.textMuted,
  },
  gatewayCard: {
    backgroundColor: THEME.colors.creamCard,
    borderRadius: THEME.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
    gap: 12,
    ...THEME.shadows.card,
  },
  gwHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gwBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    paddingRight: 6,
  },
  gwIcon: {
    fontSize: 22,
  },
  gwTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  gwSubtitle: {
    fontSize: 10.5,
    color: THEME.colors.textMuted,
    marginTop: 1,
  },
  gwStatusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.radius.sm,
  },
  gwOnline: {
    backgroundColor: THEME.colors.riskLowBg,
  },
  gwOffline: {
    backgroundColor: THEME.colors.riskModerateBg,
  },
  gwStatusText: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.primaryDark,
  },
  gwMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.creamCardSubtle,
    padding: 12,
    borderRadius: THEME.radius.md,
  },
  gwMetric: {
    alignItems: 'flex-start',
  },
  gwMetricLabel: {
    fontSize: 8.5,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    letterSpacing: 0.4,
  },
  gwMetricVal: {
    fontSize: 12.5,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    marginTop: 3,
  },
  gwActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  gwSyncBtn: {
    flex: 1,
    backgroundColor: THEME.colors.primarySurface,
    paddingVertical: 10,
    borderRadius: THEME.radius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.primaryBorder,
  },
  gwSyncBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: THEME.colors.primaryMedium,
  },
  gwSmsBtn: {
    flex: 1,
    backgroundColor: THEME.colors.creamCardSubtle,
    paddingVertical: 10,
    borderRadius: THEME.radius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
  },
  gwSmsBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBox: {
    flex: 1,
    backgroundColor: THEME.colors.creamCard,
    padding: 14,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
    ...THEME.shadows.card,
  },
  actionBoxIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  actionBoxTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  actionBoxSub: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    marginTop: 2,
    lineHeight: 14,
  },
  economicCard: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.goldLight,
    padding: 16,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.goldBorder,
    alignItems: 'flex-start',
    gap: 12,
  },
  ecoIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.goldBorder,
  },
  ecoTitle: {
    fontSize: 13.5,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
  },
  ecoBody: {
    fontSize: 11.5,
    color: THEME.colors.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },
});
