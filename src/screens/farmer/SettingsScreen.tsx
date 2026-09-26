import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, TextInput, StyleSheet, Alert } from 'react-native';
import { AppLanguage, UserRole } from '../../types';
import { THEME } from '../../constants/theme';
import { mockApiService } from '../../services/mockApiService';

interface SettingsScreenProps {
  language: AppLanguage;
  currentRole: UserRole;
  onLanguageChange: (lang: AppLanguage) => void;
  onRoleChange: (role: UserRole) => void;
  onResetDemo: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  language,
  currentRole,
  onLanguageChange,
  onRoleChange,
  onResetDemo,
}) => {
  const [smsFallbackEnabled, setSmsFallbackEnabled] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('+91 98301 24590');
  const [escalationThreshold, setEscalationThreshold] = useState('70%');

  const offlineStatus = mockApiService.getOfflineStatus();
  const gateway = mockApiService.getGatewayStatus();

  const handleSync = async () => {
    const res = await mockApiService.triggerSyncNow();
    Alert.alert('Sync Completed', `Successfully synchronized ${res.syncedItems} local records with cloud.`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {/* Farm Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={{ fontSize: 24 }}>🌾</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.farmName}>Das Dairy Farm</Text>
          <Text style={styles.farmSub}>Farmer: Arun Das · Nadia District, West Bengal</Text>
          <Text style={styles.farmMeta}>20 Monitored Cows · Station ID: ESP32-C3-KR01</Text>
        </View>
      </View>

      {/* Language Section */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>App Language / भाषा / ভাষা</Text>
        <Text style={styles.sectionSubtitle}>Select interface and SMS alert language</Text>

        <View style={styles.langGrid}>
          <TouchableOpacity
            style={[styles.langCard, language === 'en' && styles.langCardActive]}
            onPress={() => onLanguageChange('en')}
          >
            <Text style={styles.langEmoji}>🇬🇧</Text>
            <Text style={[styles.langText, language === 'en' && styles.langTextActive]}>English</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.langCard, language === 'hi' && styles.langCardActive]}
            onPress={() => onLanguageChange('hi')}
          >
            <Text style={styles.langEmoji}>🇮🇳</Text>
            <Text style={[styles.langText, language === 'hi' && styles.langTextActive]}>हिन्दी (Hindi)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.langCard, language === 'bn' && styles.langCardActive]}
            onPress={() => onLanguageChange('bn')}
          >
            <Text style={styles.langEmoji}>🌾</Text>
            <Text style={[styles.langText, language === 'bn' && styles.langTextActive]}>বাংলা (Bengali)</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Offline Sync & Storage */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Offline-First Engine & SD Buffer</Text>
        <Text style={styles.sectionSubtitle}>
          Local SQLite caching ensures 100% operation during rural cellular dead zones.
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Connection Status:</Text>
          <Text style={[styles.infoVal, { color: offlineStatus.isOffline ? THEME.colors.riskModerate : THEME.colors.riskLowText }]}>
            {offlineStatus.isOffline ? 'Offline (GSM Fallback Active)' : 'Live BLE / LoRa + MQTT'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Buffered Records:</Text>
          <Text style={styles.infoVal}>{offlineStatus.pendingSyncCount} records on SD card</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Last Cloud Handshake:</Text>
          <Text style={styles.infoVal}>{offlineStatus.lastSync}</Text>
        </View>

        <TouchableOpacity style={styles.syncBtn} activeOpacity={0.8} onPress={handleSync}>
          <Text style={styles.syncBtnText}>Force Cloud Sync Now</Text>
        </TouchableOpacity>
      </View>

      {/* SMS Fallback Notification Settings */}
      <View style={styles.sectionCard}>
        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>Automated GSM/SMS Fallback</Text>
            <Text style={styles.sectionSubtitle}>Send critical alerts when internet is unavailable</Text>
          </View>
          <Switch
            value={smsFallbackEnabled}
            onValueChange={setSmsFallbackEnabled}
            trackColor={{ false: '#D1D5DB', true: THEME.colors.primary }}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>FARMER MOBILE NUMBER FOR SMS ALERTS</Text>
          <TextInput
            style={styles.textInput}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>
      </View>

      {/* Edge Gateway Hardware Diagnostics */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Sensor Hardware Diagnostics</Text>
        <Text style={styles.sectionSubtitle}>Station KR-01 telemetry specifications</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Microcontroller:</Text>
          <Text style={styles.infoVal}>ESP32-C3 RISC-V 160MHz</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Thermal Sensor:</Text>
          <Text style={styles.infoVal}>MLX90640 32×24 Far-IR Array</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Conductivity Probe:</Text>
          <Text style={styles.infoVal}>Temp-compensated 4-pole EC</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Battery / Solar:</Text>
          <Text style={styles.infoVal}>LiFePO4 3.2V · 94% (6–12 mo/charge)</Text>
        </View>
      </View>

      {/* Demo Controls for Judges */}
      <View style={styles.demoCard}>
        <Text style={styles.demoTitle}>★ SIH 2026 Judge Demo Controls</Text>
        <Text style={styles.demoSub}>
          Reset all cows, alerts, and vet diagnostic cases to initial seeded state for demonstration.
        </Text>

        <TouchableOpacity style={styles.resetBtn} activeOpacity={0.8} onPress={onResetDemo}>
          <Text style={styles.resetBtnText}>Reset Demo to Initial Seeded State</Text>
        </TouchableOpacity>
      </View>

      {/* Hackathon Credentials Card */}
      <View style={styles.sihCard}>
        <Text style={styles.sihTitle}>SMART INDIA HACKATHON 2026</Text>
        <Text style={styles.sihItem}>Problem Statement ID: <Text style={{ fontWeight: '800' }}>SIH26109</Text></Text>
        <Text style={styles.sihItem}>Team Name: <Text style={{ fontWeight: '800' }}>Dropouts</Text> · Team ID: <Text style={{ fontWeight: '800' }}>134847</Text></Text>
        <Text style={styles.sihItem}>Theme: Agriculture, FoodTech & Rural Development</Text>
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primaryDark,
    borderRadius: THEME.radius.xl,
    padding: 16,
    gap: 14,
    ...THEME.shadows.cardElevated,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: THEME.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: THEME.colors.goldBorder,
  },
  farmName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFF',
  },
  farmSub: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  farmMeta: {
    fontSize: 10,
    color: THEME.colors.goldAccent,
    marginTop: 2,
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: THEME.colors.creamCard,
    borderRadius: THEME.radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
    gap: 8,
    ...THEME.shadows.card,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    lineHeight: 15,
  },
  langGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  langCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.creamCardSubtle,
    borderWidth: 1.5,
    borderColor: THEME.colors.creamBorder,
  },
  langCardActive: {
    backgroundColor: THEME.colors.primarySurface,
    borderColor: THEME.colors.primaryMedium,
  },
  langEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  langText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
  },
  langTextActive: {
    color: THEME.colors.primaryDark,
    fontWeight: '800',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.divider,
  },
  infoKey: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
  },
  infoVal: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  syncBtn: {
    backgroundColor: THEME.colors.primarySurface,
    paddingVertical: 10,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.primaryBorder,
    marginTop: 6,
  },
  syncBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.primaryMedium,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputGroup: {
    marginTop: 8,
  },
  inputLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: THEME.colors.textMuted,
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: THEME.colors.creamCardSubtle,
    borderRadius: THEME.radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
    fontSize: 13,
    color: THEME.colors.textPrimary,
  },
  demoCard: {
    backgroundColor: THEME.colors.goldLight,
    padding: 14,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.goldBorder,
    gap: 6,
  },
  demoTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
  },
  demoSub: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    lineHeight: 15,
  },
  resetBtn: {
    backgroundColor: THEME.colors.primaryDark,
    paddingVertical: 12,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    marginTop: 4,
  },
  resetBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  sihCard: {
    backgroundColor: THEME.colors.creamCardSubtle,
    borderRadius: THEME.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
    gap: 4,
  },
  sihTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: THEME.colors.primaryDark,
    letterSpacing: 0.5,
  },
  sihItem: {
    fontSize: 10.5,
    color: THEME.colors.textSecondary,
  },
});
