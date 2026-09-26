import React, { useState } from 'react';
import { View, Text, StyleSheet, LayoutChangeEvent } from 'react-native';
import Svg, { Path, Line, Circle, Rect, Text as SvgText } from 'react-native-svg';
import { THEME } from '../constants/theme';

interface TrendChartProps {
  data: number[]; // Array of 14 points (0 - 100)
  title?: string;
  subtitle?: string;
  threshold?: number; // default 70
}

export const TrendChart: React.FC<TrendChartProps> = ({
  data,
  title = '14-Day Mastitis Forecast Trajectory',
  subtitle = 'XGBoost multi-target model · Day −10 lead time window',
  threshold = 70,
}) => {
  const [containerWidth, setContainerWidth] = useState<number>(330);
  const height = 150;
  const paddingX = 24;
  const paddingY = 22;

  const handleLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0 && Math.abs(w - containerWidth) > 5) {
      setContainerWidth(w);
    }
  };

  const chartW = Math.max(containerWidth - paddingX * 2, 200);
  const chartH = height - paddingY * 2;

  // Build SVG path
  const points = data.map((val, idx) => {
    const x = paddingX + (idx / (data.length - 1)) * chartW;
    const y = paddingY + chartH - (val / 100) * chartH;
    return { x, y, val };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  // Fill area under path
  const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingY + chartH} L ${points[0].x} ${paddingY + chartH} Z`;

  // Threshold Y
  const threshY = paddingY + chartH - (threshold / 100) * chartH;
  const lastPoint = points[points.length - 1];

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <View style={styles.header}>
        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Lead-time 7–14d</Text>
        </View>
      </View>

      <View style={styles.chartWrapper}>
        <Svg width={containerWidth} height={height} viewBox={`0 0 ${containerWidth} ${height}`}>
          {/* Background grid lines */}
          <Line x1={paddingX} y1={paddingY} x2={paddingX + chartW} y2={paddingY} stroke="#EFE7DA" strokeWidth="1" />
          <Line x1={paddingX} y1={threshY} x2={paddingX + chartW} y2={threshY} stroke="#F87171" strokeWidth="1" strokeDasharray="4,4" />
          <Line x1={paddingX} y1={paddingY + chartH} x2={paddingX + chartW} y2={paddingY + chartH} stroke="#EFE7DA" strokeWidth="1" />

          {/* Shaded area */}
          <Path d={areaD} fill="rgba(211, 47, 47, 0.12)" />

          {/* Main trend line */}
          <Path d={pathD} fill="none" stroke={lastPoint.val >= 70 ? THEME.colors.riskHigh : THEME.colors.primary} strokeWidth="3" strokeLinecap="round" />

          {/* Dots on points */}
          {points.map((pt, i) => (
            (i === 0 || i === Math.floor(points.length / 2) || i === points.length - 1) && (
              <Circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r={i === points.length - 1 ? 5 : 3.5}
                fill={i === points.length - 1 ? THEME.colors.riskHigh : THEME.colors.primary}
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
            )
          ))}

          {/* Threshold Label */}
          <SvgText x={paddingX + 4} y={threshY - 4} fontSize="9" fill={THEME.colors.riskHighText} fontWeight="700">
            Escalation Threshold (70%)
          </SvgText>

          {/* Current Score Tag */}
          <Rect x={Math.min(lastPoint.x - 22, containerWidth - 40)} y={lastPoint.y - 20} width="32" height="15" rx="4" fill={THEME.colors.riskHigh} />
          <SvgText x={Math.min(lastPoint.x - 6, containerWidth - 24)} y={lastPoint.y - 9} fontSize="9" fill="#FFF" fontWeight="800" textAnchor="middle">
            {lastPoint.val}%
          </SvgText>
        </Svg>
      </View>

      <View style={styles.axisRow}>
        <Text style={styles.axisText}>Day −14</Text>
        <Text style={styles.axisTextCenter}>▲ ICAR Proof: Day −10 Drift Detectable</Text>
        <Text style={styles.axisText}>Today</Text>
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
  chartWrapper: {
    alignItems: 'center',
    marginVertical: 4,
    width: '100%',
  },
  axisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginTop: 6,
  },
  axisText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.textMuted,
  },
  axisTextCenter: {
    fontSize: 9.5,
    fontWeight: '700',
    color: THEME.colors.goldAccent,
  },
});
