import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { UserRole } from '../types';
import { THEME } from '../constants/theme';

export type ScreenTab =
  | 'farmer_dashboard'
  | 'farmer_herd'
  | 'farmer_cmt'
  | 'farmer_alerts'
  | 'farmer_analytics'
  | 'farmer_settings'
  | 'vet_dashboard'
  | 'vet_triage'
  | 'vet_alerts'
  | 'vet_analytics'
  | 'coop_dashboard'
  | 'coop_hotspots'
  | 'coop_analytics'
  | 'coop_alerts';

interface BottomNavProps {
  currentRole: UserRole;
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
  unreadAlertsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentRole,
  currentTab,
  onSelectTab,
  unreadAlertsCount = 2,
}) => {
  const getTabsForRole = () => {
    switch (currentRole) {
      case 'FARMER':
        return [
          { key: 'farmer_dashboard', label: 'Home', icon: '🏠' },
          { key: 'farmer_herd', label: 'Herd', icon: '🐄' },
          { key: 'farmer_cmt', label: 'CMT Scan', icon: '📷' },
          { key: 'farmer_alerts', label: 'Alerts', icon: '🔔', badge: unreadAlertsCount },
          { key: 'farmer_analytics', label: 'Trends', icon: '📈' },
          { key: 'farmer_settings', label: 'More', icon: '⚙️' },
        ];
      case 'VET':
        return [
          { key: 'vet_dashboard', label: 'Command', icon: '🩺' },
          { key: 'vet_triage', label: 'Triage Queue', icon: '📋', badge: 2 },
          { key: 'vet_alerts', label: 'Alerts', icon: '🔔', badge: unreadAlertsCount },
          { key: 'vet_analytics', label: 'Efficacy', icon: '📊' },
        ];
      case 'COOPERATIVE':
        return [
          { key: 'coop_dashboard', label: 'Regional', icon: '🏛️' },
          { key: 'coop_hotspots', label: 'GIS Hotspots', icon: '🗺️', badge: 7 },
          { key: 'coop_alerts', label: 'Alerts', icon: '🔔' },
          { key: 'coop_analytics', label: 'Quality', icon: '🥛' },
        ];
    }
  };

  const tabs = getTabsForRole();

  return (
    <View style={styles.container}>
      {tabs.map(tab => {
        const isActive = currentTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabButton, isActive && styles.tabButtonActive]}
            activeOpacity={0.7}
            onPress={() => onSelectTab(tab.key as ScreenTab)}
          >
            <View style={styles.iconContainer}>
              <Text style={[styles.icon, isActive && styles.iconActive]}>{tab.icon}</Text>
              {tab.badge !== undefined && tab.badge > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{tab.badge}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: THEME.colors.creamBorder,
    paddingVertical: 8,
    paddingHorizontal: 6,
    justifyContent: 'space-around',
    alignItems: 'center',
    ...THEME.shadows.cardElevated,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: THEME.radius.sm,
    minWidth: 48,
  },
  tabButtonActive: {
    backgroundColor: THEME.colors.primarySurface,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 2,
  },
  icon: {
    fontSize: 20,
    opacity: 0.7,
  },
  iconActive: {
    opacity: 1,
    transform: [{ scale: 1.08 }],
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: THEME.colors.riskHigh,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: THEME.colors.textMuted,
  },
  labelActive: {
    color: THEME.colors.primaryDark,
    fontWeight: '800',
  },
});
