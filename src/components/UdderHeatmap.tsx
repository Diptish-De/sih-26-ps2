import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { QuarterCode, QuarterData } from '../types';
import { THEME } from '../constants/theme';

interface UdderHeatmapProps {
  quarters: Record<QuarterCode, QuarterData>;
  selectedQuarter?: QuarterCode;
  onSelectQuarter?: (code: QuarterCode) => void;
}

export const UdderHeatmap: React.FC<UdderHeatmapProps> = ({
  quarters,
  selectedQuarter: externalSelected,
  onSelectQuarter,
}) => {
  const [internalSelected, setInternalSelected] = useState<QuarterCode>('LR');
  const activeCode = externalSelected || internalSelected;

  const handleSelect = (code: QuarterCode) => {
    setInternalSelected(code);
    if (onSelectQuarter) onSelectQuarter(code);
  };

  const renderQuarterBlock = (code: QuarterCode, label: string) => {
    const q = quarters[code];
    const isSelected = activeCode === code;
    const isAffected = q?.isAffected;

    let heatColor = THEME.colors.riskHealthy;
    let bgColor = THEME.colors.riskLowBg;
    let borderColor = THEME.colors.primaryBorder;

    if (q.tubeTempDiff >= 1.5 || q.isAffected) {
      heatColor = THEME.colors.riskHigh;
      bgColor = THEME.colors.riskHighBg;
      borderColor = THEME.colors.riskHigh;
    } else if (q.tubeTempDiff >= 0.7) {
      heatColor = THEME.colors.riskModerate;
      bgColor = THEME.colors.riskModerateBg;
      borderColor = THEME.colors.riskModerate;
    }

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleSelect(code)}
        style={[
          styles.quarterCell,
          {
            backgroundColor: bgColor,
            borderColor: isSelected ? THEME.colors.primaryDark : borderColor,
            borderWidth: isSelected ? 2.5 : 1.5,
          },
          isAffected && styles.affectedGlow,
        ]}
      >
        <View style={styles.cellHeader}>
          <Text style={[styles.cellCode, { color: isSelected ? THEME.colors.primaryDark : heatColor }]}>
            {code}
          </Text>
          {isAffected && (
            <View style={styles.alertDot}>
              <Text style={styles.alertDotText}>!</Text>
            </View>
          )}
        </View>
        <Text style={styles.cellName} numberOfLines={1}>{label}</Text>
        <View style={styles.sensorRow}>
          <Text style={[styles.tempText, { color: heatColor }]}>
            {q.tubeTempDiff >= 0 ? `+${q.tubeTempDiff}°C` : `${q.tubeTempDiff}°C`}
          </Text>
          <Text style={styles.ecText}>{q.ecValue} mS</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const selectedData = quarters[activeCode];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1, paddingRight: 6 }}>
          <Text style={styles.title}>4-Quarter Tube Heat & EC Array</Text>
          <Text style={styles.subtitle}>MLX90640 milk-tube thermal array (hair/dung noise free)</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>ICAR r=0.84</Text>
        </View>
      </View>

      <View style={styles.orientationLabels}>
        <Text style={styles.orientationText}>▲ HEAD / FRONT TEATS</Text>
      </View>

      <View style={styles.grid}>
        <View style={styles.gridRow}>
          {renderQuarterBlock('LF', 'Left Front')}
          {renderQuarterBlock('RF', 'Right Front')}
        </View>
        <View style={styles.gridRow}>
          {renderQuarterBlock('LR', 'Left Rear')}
          {renderQuarterBlock('RR', 'Right Rear')}
        </View>
      </View>

      <View style={styles.orientationLabels}>
        <Text style={styles.orientationText}>▼ TAIL / REAR TEATS</Text>
      </View>

      {/* Selected Quarter Detail Callout */}
      {selectedData && (
        <View
          style={[
            styles.detailBanner,
            selectedData.isAffected ? styles.detailBannerAlert : styles.detailBannerNormal,
          ]}
        >
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>
              Selected: <Text style={{ fontWeight: '900' }}>{selectedData.name} ({selectedData.code})</Text>
            </Text>
            <Text
              style={[
                styles.detailStatus,
                { color: selectedData.isAffected ? THEME.colors.riskHighText : THEME.colors.textSecondary },
              ]}
            >
              {selectedData.statusText}
            </Text>
          </View>
          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>TUBE HEAT</Text>
              <Text style={[styles.metricValue, selectedData.isAffected && { color: THEME.colors.riskHighText }]}>
                {selectedData.tubeTempDiff >= 0 ? `+${selectedData.tubeTempDiff}°C` : `${selectedData.tubeTempDiff}°C`}
              </Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>CONDUCTIVITY</Text>
              <Text style={styles.metricValue}>{selectedData.ecValue} mS/cm</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>SCC BAND</Text>
              <Text style={[styles.metricValue, selectedData.isAffected && { color: THEME.colors.riskHighText }]}>
                {selectedData.sccBand}
              </Text>
            </View>
          </View>
        </View>
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 14.5,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 2,
    lineHeight: 15,
  },
  badge: {
    backgroundColor: THEME.colors.primarySurface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.primaryBorder,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.primaryMedium,
  },
  orientationLabels: {
    alignItems: 'center',
    marginVertical: 4,
  },
  orientationText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: THEME.colors.textMuted,
    letterSpacing: 1,
  },
  grid: {
    gap: 10,
    marginVertical: 4,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 10,
  },
  quarterCell: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
    alignItems: 'flex-start',
    minHeight: 82,
    justifyContent: 'space-between',
  },
  affectedGlow: {
    ...THEME.shadows.glowHigh,
  },
  cellHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  cellCode: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  alertDot: {
    backgroundColor: THEME.colors.riskHigh,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertDotText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '900',
  },
  cellName: {
    fontSize: 11.5,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  sensorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginTop: 6,
  },
  tempText: {
    fontSize: 13,
    fontWeight: '900',
  },
  ecText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textMuted,
  },
  detailBanner: {
    marginTop: 12,
    padding: 12,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
  },
  detailBannerAlert: {
    backgroundColor: THEME.colors.riskHighBg,
    borderColor: THEME.colors.riskHighBorder,
  },
  detailBannerNormal: {
    backgroundColor: THEME.colors.creamCardSubtle,
    borderColor: THEME.colors.creamBorder,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailTitle: {
    fontSize: 12.5,
    color: THEME.colors.textPrimary,
  },
  detailStatus: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    alignItems: 'flex-start',
  },
  metricLabel: {
    fontSize: 8.5,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
    marginTop: 2,
  },
});
