import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { UserRole, AppLanguage } from '../types';
import { THEME } from '../constants/theme';
import { mockApiService } from '../services/mockApiService';

interface HeaderProps {
  currentRole: UserRole;
  currentLanguage: AppLanguage;
  onRoleChange: (role: UserRole) => void;
  onLanguageChange: (lang: AppLanguage) => void;
  onOpenDemoStory: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  currentLanguage,
  onRoleChange,
  onLanguageChange,
  onOpenDemoStory,
}) => {
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [langModalVisible, setLangModalVisible] = useState(false);

  const offlineStatus = mockApiService.getOfflineStatus();
  const isOffline = offlineStatus.isOffline;

  const handleToggleOffline = () => {
    mockApiService.toggleOfflineMode();
  };

  const getRoleTitle = () => {
    switch (currentRole) {
      case 'FARMER':
        return '👨‍🌾 Farmer View';
      case 'VET':
        return '🩺 Vet Command';
      case 'COOPERATIVE':
        return '🏛️ Cooperative / DAHD';
    }
  };

  const getLangTitle = () => {
    switch (currentLanguage) {
      case 'en':
        return 'EN';
      case 'hi':
        return 'हिन्दी';
      case 'bn':
        return 'বাংলা';
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Banner: App Title & Actions */}
      <View style={styles.topRow}>
        <View style={styles.brandGroup}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoIcon}>🥛</Text>
          </View>
          <View>
            <View style={styles.titleWithBadge}>
              <Text style={styles.appTitle}>KSHEER-RAKSHAK</Text>
              <View style={styles.sihBadge}>
                <Text style={styles.sihText}>SIH 2026</Text>
              </View>
            </View>
            <Text style={styles.appSubtitle}>Early Bovine Mastitis Forecasting</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          {/* Demo Story Stepper Button */}
          <TouchableOpacity
            style={styles.demoButton}
            activeOpacity={0.8}
            onPress={onOpenDemoStory}
          >
            <Text style={styles.demoStar}>★</Text>
            <Text style={styles.demoText}>Demo</Text>
          </TouchableOpacity>

          {/* Language Selector */}
          <TouchableOpacity
            style={styles.langButton}
            activeOpacity={0.8}
            onPress={() => setLangModalVisible(true)}
          >
            <Text style={styles.langText}>{getLangTitle()} ▾</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Role & Offline Bar */}
      <View style={styles.subBar}>
        <TouchableOpacity
          style={styles.roleSelector}
          activeOpacity={0.8}
          onPress={() => setRoleModalVisible(true)}
        >
          <Text style={styles.roleText}>{getRoleTitle()}</Text>
          <Text style={styles.roleSwitchHint}>Switch ▾</Text>
        </TouchableOpacity>

        {/* Offline / Online toggle pill */}
        <TouchableOpacity
          style={[styles.offlinePill, isOffline ? styles.offlinePillActive : styles.onlinePill]}
          activeOpacity={0.8}
          onPress={handleToggleOffline}
        >
          <View style={[styles.statusDot, isOffline ? styles.dotOffline : styles.dotOnline]} />
          <Text style={[styles.offlineText, isOffline && styles.offlineTextActive]}>
            {isOffline ? `Offline (${offlineStatus.pendingSyncCount} SD)` : 'LoRa/Cloud Live'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Role Selection Modal */}
      <Modal
        visible={roleModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRoleModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setRoleModalVisible(false)}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select SIH Demo Role</Text>
            <Text style={styles.modalSubtitle}>
              Experience the role-specific dashboards tailored for each stakeholder:
            </Text>

            <TouchableOpacity
              style={[styles.roleOption, currentRole === 'FARMER' && styles.roleOptionActive]}
              onPress={() => {
                onRoleChange('FARMER');
                setRoleModalVisible(false);
              }}
            >
              <Text style={styles.roleEmoji}>👨‍🌾</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.roleOptionTitle}>Farmer (Smallholder)</Text>
                <Text style={styles.roleOptionDesc}>
                  Herd health, early risk alerts, 4-quarter udder heat, CMT camera scan, actionable steps in local language.
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleOption, currentRole === 'VET' && styles.roleOptionActive]}
              onPress={() => {
                onRoleChange('VET');
                setRoleModalVisible(false);
              }}
            >
              <Text style={styles.roleEmoji}>🩺</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.roleOptionTitle}>Veterinarian (Command)</Text>
                <Text style={styles.roleOptionDesc}>
                  Triage queue, explainable SHAP diagnostics, case confirmation, outcome labels for continuous ML training.
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleOption, currentRole === 'COOPERATIVE' && styles.roleOptionActive]}
              onPress={() => {
                onRoleChange('COOPERATIVE');
                setRoleModalVisible(false);
              }}
            >
              <Text style={styles.roleEmoji}>🏛️</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.roleOptionTitle}>Cooperative / DAHD</Text>
                <Text style={styles.roleOptionDesc}>
                  Regional Herd Risk Index (0–100), district GIS hotspot map, bulk tank SCC monitoring, proactive dispatch.
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Language Selection Modal */}
      <Modal
        visible={langModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLangModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setLangModalVisible(false)}
        >
          <View style={styles.modalCardSmall}>
            <Text style={styles.modalTitle}>Choose Language / भाषा</Text>

            <TouchableOpacity
              style={[styles.langOption, currentLanguage === 'en' && styles.langOptionActive]}
              onPress={() => {
                onLanguageChange('en');
                setLangModalVisible(false);
              }}
            >
              <Text style={styles.langName}>English (Default)</Text>
              {currentLanguage === 'en' && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.langOption, currentLanguage === 'hi' && styles.langOptionActive]}
              onPress={() => {
                onLanguageChange('hi');
                setLangModalVisible(false);
              }}
            >
              <Text style={styles.langName}>हिन्दी (Hindi)</Text>
              {currentLanguage === 'hi' && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.langOption, currentLanguage === 'bn' && styles.langOptionActive]}
              onPress={() => {
                onLanguageChange('bn');
                setLangModalVisible(false);
              }}
            >
              <Text style={styles.langName}>বাংলা (Bengali)</Text>
              {currentLanguage === 'bn' && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.primaryDark,
    paddingTop: 12,
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: THEME.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.goldBorder,
  },
  logoIcon: {
    fontSize: 20,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  appTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  sihBadge: {
    backgroundColor: THEME.colors.goldAccent,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  sihText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#000',
  },
  appSubtitle: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.goldLight,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.goldBorder,
    gap: 4,
  },
  demoStar: {
    color: THEME.colors.goldAccent,
    fontSize: 12,
    fontWeight: '900',
  },
  demoText: {
    color: THEME.colors.primaryDark,
    fontSize: 11,
    fontWeight: '800',
  },
  langButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  langText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  subBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  roleSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.radius.sm,
    gap: 6,
  },
  roleText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  roleSwitchHint: {
    color: THEME.colors.goldAccent,
    fontSize: 10,
    fontWeight: '600',
  },
  offlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    gap: 5,
  },
  onlinePill: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  offlinePillActive: {
    backgroundColor: 'rgba(217, 119, 6, 0.2)',
    borderColor: 'rgba(217, 119, 6, 0.5)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotOnline: {
    backgroundColor: THEME.colors.riskHealthy,
  },
  dotOffline: {
    backgroundColor: THEME.colors.riskModerate,
  },
  offlineText: {
    fontSize: 10,
    color: '#A7F3D0',
    fontWeight: '700',
  },
  offlineTextActive: {
    color: '#FDE68A',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: THEME.colors.creamCard,
    borderRadius: THEME.radius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
    ...THEME.shadows.cardElevated,
  },
  modalCardSmall: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: THEME.colors.creamCard,
    borderRadius: THEME.radius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
    ...THEME.shadows.cardElevated,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginBottom: 16,
    lineHeight: 16,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: THEME.colors.creamCardSubtle,
    padding: 12,
    borderRadius: THEME.radius.md,
    borderWidth: 1.5,
    borderColor: THEME.colors.creamBorder,
    marginBottom: 10,
    gap: 12,
  },
  roleOptionActive: {
    borderColor: THEME.colors.primaryMedium,
    backgroundColor: THEME.colors.primarySurface,
  },
  roleEmoji: {
    fontSize: 24,
  },
  roleOptionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  roleOptionDesc: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  langOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: THEME.radius.md,
    marginBottom: 8,
    backgroundColor: THEME.colors.creamCardSubtle,
  },
  langOptionActive: {
    backgroundColor: THEME.colors.primarySurface,
    borderWidth: 1,
    borderColor: THEME.colors.primaryBorder,
  },
  langName: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  checkmark: {
    fontSize: 16,
    fontWeight: '900',
    color: THEME.colors.primaryMedium,
  },
});
