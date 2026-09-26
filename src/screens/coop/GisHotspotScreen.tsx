import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { DistrictHotspot, AppLanguage } from '../../types';
import { THEME } from '../../constants/theme';
import Svg, { Circle, Rect, Line, Text as SvgText, G } from 'react-native-svg';

interface GisHotspotScreenProps {
  hotspots: DistrictHotspot[];
  language: AppLanguage;
}

export const GisHotspotScreen: React.FC<GisHotspotScreenProps> = ({
  hotspots,
  language,
}) => {
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('dist-nadia');

  const selectedHotspot = hotspots.find(h => h.id === selectedDistrictId) || hotspots[0];

  const mapWidth = 330;
  const mapHeight = 220;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {/* Top Banner */}
      <View style={styles.topCard}>
        <View style={styles.topRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.topTitle}>Regional GIS Risk Clusters</Text>
            <Text style={styles.topSub}>
              Aggregated spatial lag model (T3 Herd Target) mapping mastitis clusters without exposing farm identities.
            </Text>
          </View>
          <View style={styles.gisBadge}>
            <Text style={styles.gisBadgeText}>T3 Spatial Lag</Text>
          </View>
        </View>
      </View>

      {/* Interactive SVG Map Canvas */}
      <View style={styles.mapCard}>
        <View style={styles.mapHeader}>
          <Text style={styles.mapLabel}>EASTERN & NORTHERN LIVESTOCK CORRIDOR</Text>
          <Text style={styles.mapHint}>Tap district point to inspect</Text>
        </View>

        <View style={styles.svgContainer}>
          <Svg width={mapWidth} height={mapHeight} viewBox={`0 0 ${mapWidth} ${mapHeight}`}>
            {/* Background Map Grid */}
            <Rect x="0" y="0" width={mapWidth} height={mapHeight} fill="#091E16" rx="16" />

            {/* Grid coordinate lines */}
            <Line x1="0" y1="55" x2={mapWidth} y2="55" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4,4" />
            <Line x1="0" y1="110" x2={mapWidth} y2="110" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4,4" />
            <Line x1="0" y1="165" x2={mapWidth} y2="165" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4,4" />
            <Line x1="82" y1="0" x2="82" y2={mapHeight} stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4,4" />
            <Line x1="165" y1="0" x2="165" y2={mapHeight} stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4,4" />
            <Line x1="247" y1="0" x2="247" y2={mapHeight} stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4,4" />

            {/* Connecting milk routes */}
            <Line x1="125" y1="70" x2="145" y2="105" stroke="rgba(201, 151, 38, 0.4)" strokeWidth="2" strokeDasharray="2,2" />
            <Line x1="145" y1="105" x2="165" y2="136" stroke="rgba(201, 151, 38, 0.4)" strokeWidth="2" strokeDasharray="2,2" />
            <Line x1="145" y1="105" x2="204" y2="92" stroke="rgba(201, 151, 38, 0.4)" strokeWidth="2" strokeDasharray="2,2" />

            {/* Hotspot points */}
            {hotspots.map(h => {
              const cx = (h.coordinates.x / 100) * mapWidth;
              const cy = (h.coordinates.y / 100) * mapHeight;
              const isSelected = h.id === selectedDistrictId;
              const isHot = h.status === 'ALERT_HOTSPOT';
              const isMod = h.status === 'MONITOR';

              const pinColor = isHot ? THEME.colors.riskHigh : isMod ? THEME.colors.riskModerate : THEME.colors.riskLow;

              return (
                <G key={h.id} onPress={() => setSelectedDistrictId(h.id)}>
                  {/* Outer pulse circle for hotspot */}
                  {isHot && (
                    <Circle cx={cx} cy={cy} r="18" fill="rgba(211, 47, 47, 0.25)" />
                  )}
                  {isSelected && (
                    <Circle cx={cx} cy={cy} r="14" fill="none" stroke="#FFF" strokeWidth="2" />
                  )}

                  {/* Pin core */}
                  <Circle cx={cx} cy={cy} r="8" fill={pinColor} />

                  {/* Label */}
                  <SvgText
                    x={cx}
                    y={cy + 18}
                    fill={isSelected ? '#FFF' : '#BDDCD0'}
                    fontSize="9"
                    fontWeight={isSelected ? '900' : '700'}
                    textAnchor="middle"
                  >
                    {h.districtName.split(' ')[0]} ({h.highRiskAlerts})
                  </SvgText>
                </G>
              );
            })}
          </Svg>
        </View>

        {/* Legend Row */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: THEME.colors.riskHigh }]} />
            <Text style={styles.legendText}>Hotspot (&gt;60% Risk)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: THEME.colors.riskModerate }]} />
            <Text style={styles.legendText}>Watch Cluster</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: THEME.colors.riskLow }]} />
            <Text style={styles.legendText}>Normal Grade A</Text>
          </View>
        </View>
      </View>

      {/* Selected District Drilldown Card */}
      <View style={styles.detailCard}>
        <View style={styles.detailHeader}>
          <View>
            <View style={styles.titleWithPill}>
              <Text style={styles.districtName}>{selectedHotspot.districtName}</Text>
              <View style={[styles.statusBadge, selectedHotspot.status === 'ALERT_HOTSPOT' ? styles.bgDanger : styles.bgNormal]}>
                <Text style={styles.statusBadgeText}>{selectedHotspot.status.replace('_', ' ')}</Text>
              </View>
            </View>
            <Text style={styles.stateText}>{selectedHotspot.state} Milk Union Zone</Text>
          </View>
          <View style={styles.rScoreBlock}>
            <Text style={styles.rScoreVal}>{selectedHotspot.herdRiskIndex}%</Text>
            <Text style={styles.rScoreLabel}>Risk Index</Text>
          </View>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricBlock}>
            <Text style={styles.mLabel}>FARMS REPORTING</Text>
            <Text style={styles.mVal}>{selectedHotspot.farmsCount} Dairy Farms</Text>
          </View>
          <View style={styles.metricBlock}>
            <Text style={styles.mLabel}>ANIMALS MONITORED</Text>
            <Text style={styles.mVal}>{selectedHotspot.cowsMonitored} Cattle</Text>
          </View>
          <View style={styles.metricBlock}>
            <Text style={styles.mLabel}>HIGH RISK ALERTS</Text>
            <Text style={[styles.mVal, { color: THEME.colors.riskHighText }]}>
              {selectedHotspot.highRiskAlerts} Active Alerts
            </Text>
          </View>
          <View style={styles.metricBlock}>
            <Text style={styles.mLabel}>BULK TANK SCC</Text>
            <Text style={styles.mVal}>
              {(selectedHotspot.bulkTankScc / 1000).toFixed(0)}k/mL (Grade {selectedHotspot.milkQualityGrade})
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.dispatchBtn}
          activeOpacity={0.85}
          onPress={() => {
            alert(`Mobile Veterinary Unit dispatched to ${selectedHotspot.districtName} cluster.`);
          }}
        >
          <Text style={styles.dispatchBtnText}>
            🚑 Dispatch Mobile Vet Unit to {selectedHotspot.districtName} Hotspot
          </Text>
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
    gap: 16,
  },
  topCard: {
    backgroundColor: THEME.colors.primaryDark,
    borderRadius: THEME.radius.xl,
    padding: 16,
    ...THEME.shadows.cardElevated,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  topTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFF',
  },
  topSub: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 4,
    lineHeight: 16,
  },
  gisBadge: {
    backgroundColor: THEME.colors.goldLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.goldBorder,
  },
  gisBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: THEME.colors.goldAccent,
  },
  mapCard: {
    backgroundColor: '#0F261D',
    borderRadius: THEME.radius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    ...THEME.shadows.cardElevated,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  mapLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: THEME.colors.goldAccent,
    letterSpacing: 0.5,
  },
  mapHint: {
    fontSize: 9.5,
    color: '#A7F3D0',
  },
  svgContainer: {
    alignItems: 'center',
    marginVertical: 4,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#BDDCD0',
  },
  detailCard: {
    backgroundColor: THEME.colors.creamCard,
    borderRadius: THEME.radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
    gap: 12,
    ...THEME.shadows.card,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleWithPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  districtName: {
    fontSize: 16,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.radius.xs,
  },
  bgDanger: {
    backgroundColor: THEME.colors.riskHighBg,
  },
  bgNormal: {
    backgroundColor: THEME.colors.primarySurface,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  stateText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  rScoreBlock: {
    alignItems: 'flex-end',
  },
  rScoreVal: {
    fontSize: 20,
    fontWeight: '900',
    color: THEME.colors.primaryDark,
  },
  rScoreLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    textTransform: 'uppercase',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metricBlock: {
    width: '48%',
    backgroundColor: THEME.colors.creamCardSubtle,
    padding: 10,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
  },
  mLabel: {
    fontSize: 8.5,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    letterSpacing: 0.5,
  },
  mVal: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    marginTop: 2,
  },
  dispatchBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 12,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
  },
  dispatchBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
