import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, LayoutChangeEvent } from 'react-native';
import { THEME } from '../../constants/theme';
import { StatCard } from '../../components/StatCard';
import Svg, { Path, Line, Text as SvgText } from 'react-native-svg';

export const AnalyticsScreen: React.FC = () => {
  const [chartWidth, setChartWidth] = useState<number>(330);
  const chartHeight = 140;

  const handleLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0 && Math.abs(w - chartWidth) > 5) {
      setChartWidth(w);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Banner */}
      <View style={styles.topCard}>
        <Text style={styles.topCardTitle}>Herd Analytics & AI Drift Signals</Text>
        <Text style={styles.topCardSubtitle}>
          Statistical tracking across 20 cows over the past 30 days. Detecting subclinical trends before clinical onset.
        </Text>
      </View>

      {/* 30-day Herd Risk Trend Graph */}
      <View style={styles.chartCard} onLayout={handleLayout}>
        <View style={styles.chartHeader}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.chartTitle}>30-Day Herd Average Risk Trend</Text>
            <Text style={styles.chartSub}>Average calibrated risk index across milking sessions</Text>
          </View>
          <View style={styles.trendBadge}>
            <Text style={styles.trendBadgeText}>-14% vs Last Month</Text>
          </View>
        </View>

        <View style={styles.svgWrapper}>
          <Svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
            {/* Grid */}
            <Line x1="10" y1="30" x2={chartWidth - 10} y2="30" stroke="#F0E8DC" strokeWidth="1" />
            <Line x1="10" y1="70" x2={chartWidth - 10} y2="70" stroke="#F0E8DC" strokeWidth="1" />
            <Line x1="10" y1="110" x2={chartWidth - 10} y2="110" stroke="#F0E8DC" strokeWidth="1" />

            {/* Smooth herd risk path */}
            <Path
              d={`M 15 90 C 50 100 80 85 120 75 S 180 60 220 50 S 270 40 ${chartWidth - 25} 32 L ${chartWidth - 25} 130 L 15 130 Z`}
              fill="rgba(15, 56, 42, 0.08)"
            />
            <Path
              d={`M 15 90 C 50 100 80 85 120 75 S 180 60 220 50 S 270 40 ${chartWidth - 25} 32`}
              fill="none"
              stroke={THEME.colors.primary}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <SvgText x="15" y="125" fontSize="9" fill={THEME.colors.textMuted} fontWeight="700">Day -30</SvgText>
            <SvgText x={chartWidth / 2 - 15} y="125" fontSize="9" fill={THEME.colors.textMuted} fontWeight="700">Day -15</SvgText>
            <SvgText x={chartWidth - 45} y="125" fontSize="9" fill={THEME.colors.textMuted} fontWeight="700">Today</SvgText>
          </Svg>
        </View>
      </View>

      {/* Signal Mix Attribution */}
      <View style={styles.signalCard}>
        <View style={styles.signalHeader}>
          <Text style={styles.signalTitle}>Multi-Sensor Signal Attribution</Text>
          <Text style={styles.signalSub}>Weighted contribution of sensors in mastitis forecasting</Text>
        </View>

        <View style={styles.barGroup}>
          <View style={styles.barRow}>
            <View style={styles.barLabelRow}>
              <Text style={styles.barLabel}>SCC / CMT Gel Viscosity</Text>
              <Text style={styles.barVal}>38%</Text>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: '38%', backgroundColor: THEME.colors.primary }]} />
            </View>
          </View>

          <View style={styles.barRow}>
            <View style={styles.barLabelRow}>
              <Text style={styles.barLabel}>MLX90640 Milk-Tube Thermal Heat</Text>
              <Text style={styles.barVal}>31%</Text>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: '31%', backgroundColor: THEME.colors.riskHigh }]} />
            </View>
          </View>

          <View style={styles.barRow}>
            <View style={styles.barLabelRow}>
              <Text style={styles.barLabel}>Neck Collar Rumination & Activity</Text>
              <Text style={styles.barVal}>19%</Text>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: '19%', backgroundColor: THEME.colors.goldAccent }]} />
            </View>
          </View>

          <View style={styles.barRow}>
            <View style={styles.barLabelRow}>
              <Text style={styles.barLabel}>Milk Conductivity (EC) + Temp Compensation</Text>
              <Text style={styles.barVal}>12%</Text>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: '12%', backgroundColor: THEME.colors.riskModerate }]} />
            </View>
          </View>
        </View>
      </View>

      {/* Research Performance Scorecards (2x2 Grid) */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricsRow}>
          <StatCard label="LEAD-TIME TARGET" value="7–14d" subtext="Forecast horizon" accentColor={THEME.colors.primaryDark} />
          <StatCard label="ALERT PRECISION" value="91.4%" subtext="Last 30 reviewed" accentColor={THEME.colors.riskLow} />
        </View>
        <View style={styles.metricsRow}>
          <StatCard label="DATA HEALTH" value="98.2%" subtext="1,204 packets" accentColor={THEME.colors.primary} />
          <StatCard label="LABELS LOGGED" value="8" subtext="Fed into MLflow" accentColor={THEME.colors.goldAccent} />
        </View>
      </View>

      {/* Economic Impact Summary */}
      <View style={styles.paybackCard}>
        <Text style={styles.paybackTitle}>💰 Farm Savings Ledger</Text>
        <Text style={styles.paybackBody}>
          By catching subclinical cases 7–14 days ahead, Das Dairy Farm prevented an estimated <Text style={{ fontWeight: '800' }}>₹13,900 in discarded milk and veterinary emergency antibiotic costs</Text> over the current lactation cycle.
        </Text>
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
  topCard: {
    backgroundColor: THEME.colors.primaryDark,
    borderRadius: 20,
    padding: 18,
    ...THEME.shadows.cardElevated,
  },
  topCardTitle: {
    fontSize: 16.5,
    fontWeight: '900',
    color: '#FFF',
  },
  topCardSubtitle: {
    fontSize: 11.5,
    color: THEME.colors.textMuted,
    marginTop: 4,
    lineHeight: 16,
  },
  chartCard: {
    backgroundColor: THEME.colors.creamCard,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
    ...THEME.shadows.card,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  chartSub: {
    fontSize: 10.5,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  trendBadge: {
    backgroundColor: THEME.colors.riskLowBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.sm,
  },
  trendBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.riskLowText,
  },
  svgWrapper: {
    alignItems: 'center',
    marginVertical: 4,
    width: '100%',
  },
  signalCard: {
    backgroundColor: THEME.colors.creamCard,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
    ...THEME.shadows.card,
  },
  signalHeader: {
    marginBottom: 14,
  },
  signalTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  signalSub: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  barGroup: {
    gap: 12,
  },
  barRow: {
    gap: 5,
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  barVal: {
    fontSize: 11.5,
    fontWeight: '800',
    color: THEME.colors.primaryDark,
  },
  barTrack: {
    height: 9,
    backgroundColor: THEME.colors.creamBorder,
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
  metricsContainer: {
    gap: 10,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  paybackCard: {
    backgroundColor: THEME.colors.goldLight,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: THEME.colors.goldBorder,
  },
  paybackTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
  },
  paybackBody: {
    fontSize: 11.5,
    color: THEME.colors.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },
});
