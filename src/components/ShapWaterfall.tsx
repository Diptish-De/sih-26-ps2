import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShapDriver, AppLanguage } from '../types';
import { THEME } from '../constants/theme';

interface ShapWaterfallProps {
  drivers: ShapDriver[];
  cowName: string;
  language?: AppLanguage;
}

export const ShapWaterfall: React.FC<ShapWaterfallProps> = ({
  drivers,
  cowName,
  language = 'en',
}) => {
  if (!drivers || drivers.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>All parameters within healthy 30-day baseline.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Explainable AI (SHAP Drivers)</Text>
          <View style={styles.tag}>
            <Text style={styles.tagText}>XGBoost + SHAP</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>
          Ranked physical drivers pushing {cowName}’s forecast into the high-risk zone
        </Text>
      </View>

      <View style={styles.driverList}>
        {drivers.map((driver, index) => {
          const widthPct = Math.round(driver.impactWeight * 100);
          const isDanger = driver.direction === 'increase_risk';
          const displayName =
            language === 'hi'
              ? driver.nameHi || driver.name
              : language === 'bn'
              ? driver.nameBn || driver.name
              : driver.name;

          return (
            <View key={driver.id} style={styles.driverCard}>
              <View style={styles.topRow}>
                <View style={styles.nameBlock}>
                  <Text style={styles.rankNum}>#{index + 1}</Text>
                  <Text style={styles.driverName}>{displayName}</Text>
                </View>
                <View style={styles.impactBadge}>
                  <Text style={styles.impactText}>{driver.deltaValue}</Text>
                </View>
              </View>

              {/* Progress bar representing SHAP importance */}
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${widthPct}%`,
                      backgroundColor: isDanger ? THEME.colors.riskHigh : THEME.colors.riskLow,
                    },
                  ]}
                />
              </View>

              {/* Baseline vs Current */}
              <View style={styles.comparisonRow}>
                <View style={styles.compPill}>
                  <Text style={styles.compLabel}>30d Mean: </Text>
                  <Text style={styles.compValue}>{driver.baselineValue}</Text>
                </View>
                <View style={styles.compPill}>
                  <Text style={styles.compLabel}>Current: </Text>
                  <Text style={[styles.compValue, isDanger && { color: THEME.colors.riskHighText }]}>
                    {driver.currentValue}
                  </Text>
                </View>
                <Text style={styles.weightText}>{Math.round(driver.impactWeight * 100)}% impact</Text>
              </View>

              {/* Physical explanation */}
              <Text style={styles.explanationText}>“{driver.explanation}”</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.footerNote}>
        <Text style={styles.footerNoteText}>
          🔬 <Text style={{ fontWeight: '800' }}>Individualized Baseline:</Text> Drift is evaluated against {cowName}’s own historical mean, catching subclinical inflammation days before visible swelling.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.creamCard,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
    ...THEME.shadows.card,
  },
  header: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  tag: {
    backgroundColor: THEME.colors.goldLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.goldBorder,
  },
  tagText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: THEME.colors.goldAccent,
  },
  subtitle: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 3,
    lineHeight: 15,
  },
  driverList: {
    gap: 12,
  },
  driverCard: {
    backgroundColor: THEME.colors.creamCardSubtle,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nameBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  rankNum: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.textMuted,
  },
  driverName: {
    fontSize: 13.5,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  impactBadge: {
    backgroundColor: THEME.colors.creamCard,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
  },
  impactText: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.colors.riskHighText,
  },
  barTrack: {
    height: 8,
    backgroundColor: THEME.colors.creamBorder,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  compPill: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compLabel: {
    fontSize: 10,
    color: THEME.colors.textSecondary,
  },
  compValue: {
    fontSize: 10.5,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  weightText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: THEME.colors.goldAccent,
  },
  explanationText: {
    fontSize: 11.5,
    color: THEME.colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 16,
    marginTop: 2,
  },
  footerNote: {
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.divider,
  },
  footerNoteText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    lineHeight: 16,
  },
  emptyText: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    fontStyle: 'italic',
  },
});
