import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RiskLevel } from '../types';
import { THEME } from '../constants/theme';

interface RiskBadgeProps {
  score: number;
  level?: RiskLevel;
  size?: 'small' | 'medium' | 'large';
  showPercent?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  score,
  level,
  size = 'medium',
  showPercent = true,
}) => {
  const computedLevel: RiskLevel =
    level || (score >= 70 ? 'HIGH' : score >= 45 ? 'MODERATE' : score >= 20 ? 'LOW' : 'HEALTHY');

  const getColors = () => {
    switch (computedLevel) {
      case 'HIGH':
        return {
          bg: THEME.colors.riskHighBg,
          border: THEME.colors.riskHighBorder,
          text: THEME.colors.riskHighText,
          pillBg: THEME.colors.riskHigh,
        };
      case 'MODERATE':
        return {
          bg: THEME.colors.riskModerateBg,
          border: THEME.colors.riskModerateBorder,
          text: THEME.colors.riskModerateText,
          pillBg: THEME.colors.riskModerate,
        };
      case 'LOW':
        return {
          bg: THEME.colors.riskLowBg,
          border: THEME.colors.riskLowBorder,
          text: THEME.colors.riskLowText,
          pillBg: THEME.colors.riskLow,
        };
      case 'HEALTHY':
      default:
        return {
          bg: THEME.colors.riskHealthyBg,
          border: THEME.colors.riskLowBorder,
          text: THEME.colors.riskLowText,
          pillBg: THEME.colors.riskHealthy,
        };
    }
  };

  const colors = getColors();

  if (size === 'small') {
    return (
      <View style={[styles.badgeSmall, { backgroundColor: colors.bg, borderColor: colors.border }]}>
        <View style={[styles.dot, { backgroundColor: colors.pillBg }]} />
        <Text style={[styles.textSmall, { color: colors.text }]}>
          {showPercent ? `${score}%` : computedLevel}
        </Text>
      </View>
    );
  }

  if (size === 'large') {
    return (
      <View style={[styles.badgeLarge, { backgroundColor: colors.bg, borderColor: colors.border }]}>
        <View style={[styles.dotLarge, { backgroundColor: colors.pillBg }]} />
        <View>
          <Text style={[styles.scoreLarge, { color: colors.text }]}>{score}%</Text>
          <Text style={[styles.labelLarge, { color: colors.text }]}>{computedLevel} RISK</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.badgeMedium, { backgroundColor: colors.bg, borderColor: colors.border }]}>
      <View style={[styles.dot, { backgroundColor: colors.pillBg }]} />
      <Text style={[styles.textMediumBold, { color: colors.text }]}>{score}%</Text>
      <Text style={[styles.textMedium, { color: colors.text }]}>{computedLevel}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badgeSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
  },
  badgeMedium: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    gap: 5,
  },
  badgeLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: THEME.radius.lg,
    borderWidth: 1.5,
    gap: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  dotLarge: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  textSmall: {
    fontSize: 11,
    fontWeight: '700',
  },
  textMediumBold: {
    fontSize: 13,
    fontWeight: '800',
  },
  textMedium: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  scoreLarge: {
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 22,
  },
  labelLarge: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
