import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { AlertNotification, AppLanguage } from '../../types';
import { THEME } from '../../constants/theme';
import { RiskBadge } from '../../components/RiskBadge';
import { mockApiService } from '../../services/mockApiService';

interface AlertsScreenProps {
  alerts: AlertNotification[];
  language: AppLanguage;
  onOpenCow: (cowId: number) => void;
}

export const AlertsScreen: React.FC<AlertsScreenProps> = ({
  alerts,
  language,
  onOpenCow,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'HIGH' | 'MODERATE'>('ALL');

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'HIGH') return a.riskLevel === 'HIGH';
    if (filter === 'MODERATE') return a.riskLevel === 'MODERATE';
    return true;
  });

  const getAlertTitle = (a: AlertNotification) => {
    if (language === 'hi') return a.titleHi;
    if (language === 'bn') return a.titleBn;
    return a.titleEn;
  };

  const getAlertReason = (a: AlertNotification) => {
    if (language === 'hi') return a.reasonHi;
    if (language === 'bn') return a.reasonBn;
    return a.reasonEn;
  };

  const getAlertAction = (a: AlertNotification) => {
    if (language === 'hi') return a.actionHi;
    if (language === 'bn') return a.actionBn;
    return a.actionEn;
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Alert Banner Callout */}
      <View style={styles.alertBanner}>
        <View style={styles.bannerIcon}>
          <Text style={{ fontSize: 22 }}>⚠️</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTitle}>2 High-Risk Alerts Active</Text>
          <Text style={styles.bannerDesc}>
            Multi-signal drift detected before clinical swelling. Isolate affected quarters today.
          </Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsRow}>
        {(['ALL', 'HIGH', 'MODERATE'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabBtn, filter === tab && styles.tabBtnActive]}
            onPress={() => setFilter(tab)}
          >
            <Text style={[styles.tabBtnText, filter === tab && styles.tabBtnTextActive]}>
              {tab === 'ALL' ? 'All Alerts' : `${tab} Risk`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Alerts Timeline */}
      <View style={styles.alertsList}>
        {filteredAlerts.map(alert => (
          <View key={alert.id} style={styles.alertCard}>
            <View style={styles.cardHeader}>
              <View style={styles.timeTag}>
                <Text style={styles.timeText}>{alert.timestamp}</Text>
                {alert.smsDispatched && (
                  <View style={styles.smsPill}>
                    <Text style={styles.smsPillText}>SMS Sent (GSM)</Text>
                  </View>
                )}
              </View>
              <RiskBadge score={alert.riskScore} level={alert.riskLevel} size="small" />
            </View>

            <Text style={styles.alertTitle}>{getAlertTitle(alert)}</Text>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>WHICH QUARTER:</Text>
              <Text style={styles.metaValue}>{alert.quarter} Quarter</Text>
            </View>

            <View style={styles.reasonBox}>
              <Text style={styles.reasonLabel}>WHY THIS ALERT (AI EVIDENCE):</Text>
              <Text style={styles.reasonContent}>{getAlertReason(alert)}</Text>
            </View>

            <View style={styles.actionBox}>
              <Text style={styles.actionLabel}>RECOMMENDED ACTION (DO TODAY):</Text>
              <Text style={styles.actionContent}>{getAlertAction(alert)}</Text>
            </View>

            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.reviewBtn}
                onPress={() => mockApiService.markAlertRead(alert.id)}
              >
                <Text style={styles.reviewBtnText}>{alert.read ? 'Reviewed ✓' : 'Mark Reviewed'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.openCowBtn}
                onPress={() => onOpenCow(alert.cowId)}
              >
                <Text style={styles.openCowBtnText}>Open Cow #{alert.cowId} →</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  alertBanner: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.riskHighBg,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: THEME.colors.riskHighBorder,
    alignItems: 'center',
    gap: 14,
  },
  bannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: THEME.colors.riskHighText,
  },
  bannerDesc: {
    fontSize: 11.5,
    color: THEME.colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.creamCard,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
  },
  tabBtnActive: {
    backgroundColor: THEME.colors.primaryDark,
    borderColor: THEME.colors.primaryDark,
  },
  tabBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
  },
  tabBtnTextActive: {
    color: '#FFF',
  },
  alertsList: {
    gap: 14,
  },
  alertCard: {
    backgroundColor: THEME.colors.creamCard,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
    gap: 10,
    ...THEME.shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textMuted,
  },
  smsPill: {
    backgroundColor: THEME.colors.goldLight,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: THEME.colors.goldBorder,
  },
  smsPillText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: THEME.colors.goldAccent,
  },
  alertTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: THEME.colors.textMuted,
    letterSpacing: 0.4,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.riskHighText,
  },
  reasonBox: {
    backgroundColor: THEME.colors.creamCardSubtle,
    padding: 12,
    borderRadius: 12,
  },
  reasonLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: THEME.colors.textMuted,
    letterSpacing: 0.5,
  },
  reasonContent: {
    fontSize: 12,
    color: THEME.colors.textPrimary,
    marginTop: 3,
    lineHeight: 16,
  },
  actionBox: {
    backgroundColor: THEME.colors.primarySurface,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.colors.primaryBorder,
  },
  actionLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: THEME.colors.primaryMedium,
    letterSpacing: 0.5,
  },
  actionContent: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.primaryDark,
    marginTop: 3,
    lineHeight: 17,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.divider,
  },
  reviewBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  reviewBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: THEME.colors.textMuted,
  },
  openCowBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: THEME.radius.sm,
  },
  openCowBtnText: {
    color: '#FFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
});
