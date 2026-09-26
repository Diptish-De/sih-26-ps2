import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Cow, AppLanguage } from '../../types';
import { THEME } from '../../constants/theme';
import { TRANSLATIONS } from '../../constants/i18n';
import { mockApiService } from '../../services/mockApiService';

interface CmtCameraScreenProps {
  cows: Cow[];
  language: AppLanguage;
  onBack: () => void;
  onResultSaved?: (cowId: number) => void;
}

export const CmtCameraScreen: React.FC<CmtCameraScreenProps> = ({
  cows,
  language,
  onBack,
  onResultSaved,
}) => {
  const t = TRANSLATIONS[language];
  const [selectedCowId, setSelectedCowId] = useState<number>(42);
  const [selectedQuarter, setSelectedQuarter] = useState<'LF' | 'RF' | 'LR' | 'RR'>('LR');
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<{
    sccBand: 'Negative' | 'Trace' | '1+' | '2+' | '3+';
    estimatedScc: number;
    confidence: number;
    riskEscalation: boolean;
    reason: string;
  } | null>(null);

  const selectedCow = cows.find(c => c.id === selectedCowId) || cows[0];

  const handleCapture = async () => {
    setIsCapturing(true);
    setScanResult(null);

    const result = await mockApiService.simulateCmtInference(selectedCowId, selectedQuarter);
    setIsCapturing(false);
    setScanResult(result);
  };

  const handleSaveToRecord = () => {
    if (onResultSaved) {
      onResultSaved(selectedCowId);
    }
    onBack();
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleGroup}>
          <Text style={styles.title}>{t.takeCmtPhoto}</Text>
          <Text style={styles.costBadge}>₹3 Test · TFLite Edge Model</Text>
        </View>
      </View>

      {/* Target Cow & Quarter Selectors */}
      <View style={styles.selectorBar}>
        <View style={styles.selectorGroup}>
          <Text style={styles.selectorLabel}>COW:</Text>
          <Text style={styles.selectorValue}>#{selectedCow.id} {selectedCow.name}</Text>
        </View>
        <View style={styles.quarterTabs}>
          {(['LF', 'RF', 'LR', 'RR'] as const).map(q => (
            <TouchableOpacity
              key={q}
              style={[styles.qTab, selectedQuarter === q && styles.qTabActive]}
              onPress={() => setSelectedQuarter(q)}
            >
              <Text style={[styles.qTabText, selectedQuarter === q && styles.qTabTextActive]}>{q}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Camera Viewfinder Overlay */}
      <View style={styles.viewfinderContainer}>
        {/* Simulated Camera Dark Canvas */}
        <View style={styles.cameraCanvas}>
          {/* Guide Overlay Corners */}
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />

          {/* 4-Well CMT Paddle Outline */}
          <View style={styles.paddleGrid}>
            <View style={[styles.well, selectedQuarter === 'LF' && styles.wellActive]}>
              <Text style={styles.wellLabel}>LF</Text>
              <View style={styles.liquidFluid} />
            </View>
            <View style={[styles.well, selectedQuarter === 'RF' && styles.wellActive]}>
              <Text style={styles.wellLabel}>RF</Text>
              <View style={styles.liquidFluid} />
            </View>
            <View style={[styles.well, selectedQuarter === 'LR' && styles.wellActive, styles.wellHighViscosity]}>
              <Text style={[styles.wellLabel, { color: '#FFF' }]}>LR</Text>
              <View style={styles.thickGelReaction}>
                <Text style={styles.gelText}>Gel Forming</Text>
              </View>
            </View>
            <View style={[styles.well, selectedQuarter === 'RR' && styles.wellActive]}>
              <Text style={styles.wellLabel}>RR</Text>
              <View style={styles.liquidFluid} />
            </View>
          </View>

          {/* Status Instruction inside viewfinder */}
          <View style={styles.viewfinderPrompt}>
            <Text style={styles.promptText}>
              {isCapturing ? t.analyzingSample : t.alignCmtFrame}
            </Text>
          </View>

          {/* Edge TFLite Vision Tag */}
          <View style={styles.aiTag}>
            <Text style={styles.aiTagText}>TFLite Edge CNN · 4-Quarter Detection</Text>
          </View>
        </View>
      </View>

      {/* Capture Button or AI Analysis Spinner */}
      <View style={styles.controlsArea}>
        {isCapturing ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={THEME.colors.primary} />
            <Text style={styles.loadingText}>Analyzing milk gel viscosity on edge neural net...</Text>
          </View>
        ) : !scanResult ? (
          <TouchableOpacity style={styles.captureBtn} activeOpacity={0.85} onPress={handleCapture}>
            <View style={styles.captureInnerCircle}>
              <Text style={styles.captureIcon}>📸</Text>
            </View>
            <Text style={styles.captureBtnText}>{t.capturePaddle}</Text>
          </TouchableOpacity>
        ) : (
          /* Scan Result Card */
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <View>
                <Text style={styles.resultTitle}>CMT AI Classification Result</Text>
                <Text style={styles.resultSub}>Quarter: {selectedQuarter} ({selectedCow.name})</Text>
              </View>
              <View style={styles.confBadge}>
                <Text style={styles.confText}>{scanResult.confidence}% Conf.</Text>
              </View>
            </View>

            <View style={styles.sccCallout}>
              <Text style={styles.sccBandLarge}>SCC Band {scanResult.sccBand}</Text>
              <Text style={styles.sccCount}>
                Est. {(scanResult.estimatedScc / 100000).toFixed(1)} Lakh cells/mL
              </Text>
              <Text style={styles.sccRuleNotice}>
                ⚠️ Escalation rule triggered: SCC &gt; 4.0 Lakh threshold crossed
              </Text>
            </View>

            <Text style={styles.resultReason}>{scanResult.reason}</Text>

            <View style={styles.resultBtnRow}>
              <TouchableOpacity
                style={styles.retakeBtn}
                onPress={() => setScanResult(null)}
              >
                <Text style={styles.retakeText}>Retake Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveToRecord}
              >
                <Text style={styles.saveText}>{t.saveToCow}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1A15',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: THEME.radius.sm,
  },
  backBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  headerTitleGroup: {
    alignItems: 'flex-end',
  },
  title: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '900',
  },
  costBadge: {
    color: THEME.colors.goldAccent,
    fontSize: 10,
    fontWeight: '700',
  },
  selectorBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 12,
    borderRadius: THEME.radius.md,
    marginBottom: 8,
  },
  selectorGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  selectorLabel: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  selectorValue: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  quarterTabs: {
    flexDirection: 'row',
    gap: 6,
  },
  qTab: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  qTabActive: {
    backgroundColor: THEME.colors.goldAccent,
  },
  qTabText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  qTabTextActive: {
    color: '#000',
  },
  viewfinderContainer: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  cameraCanvas: {
    aspectRatio: 1,
    backgroundColor: '#06100B',
    borderRadius: THEME.radius.xl,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: THEME.colors.goldAccent,
  },
  cornerTL: { top: 16, left: 16, borderTopWidth: 3, borderLeftWidth: 3 },
  cornerTR: { top: 16, right: 16, borderTopWidth: 3, borderRightWidth: 3 },
  cornerBL: { bottom: 16, left: 16, borderBottomWidth: 3, borderLeftWidth: 3 },
  cornerBR: { bottom: 16, right: 16, borderBottomWidth: 3, borderRightWidth: 3 },
  paddleGrid: {
    width: '74%',
    height: '74%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    alignContent: 'center',
  },
  well: {
    width: '45%',
    height: '45%',
    borderRadius: THEME.radius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  wellActive: {
    borderColor: THEME.colors.goldAccent,
  },
  wellHighViscosity: {
    backgroundColor: 'rgba(217, 47, 47, 0.25)',
    borderColor: THEME.colors.riskHigh,
  },
  wellLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: THEME.colors.textMuted,
    marginBottom: 4,
  },
  liquidFluid: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  thickGelReaction: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: THEME.colors.riskHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gelText: {
    fontSize: 7,
    fontWeight: '800',
    color: '#FFF',
    textAlign: 'center',
  },
  viewfinderPrompt: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.radius.full,
  },
  promptText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  aiTag: {
    position: 'absolute',
    top: 20,
    backgroundColor: 'rgba(201, 151, 38, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.goldBorder,
  },
  aiTagText: {
    color: THEME.colors.goldAccent,
    fontSize: 9,
    fontWeight: '800',
  },
  controlsArea: {
    padding: 16,
    backgroundColor: THEME.colors.creamCard,
    borderTopLeftRadius: THEME.radius.xl,
    borderTopRightRadius: THEME.radius.xl,
  },
  captureBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.primary,
    paddingVertical: 14,
    borderRadius: THEME.radius.lg,
    gap: 10,
  },
  captureInnerCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureIcon: {
    fontSize: 16,
  },
  captureBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
  },
  loadingBox: {
    alignItems: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    color: THEME.colors.textPrimary,
    fontWeight: '600',
  },
  resultCard: {
    gap: 8,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
  },
  resultSub: {
    fontSize: 11,
    color: THEME.colors.textMuted,
  },
  confBadge: {
    backgroundColor: THEME.colors.primarySurface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.primaryBorder,
  },
  confText: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.colors.primaryDark,
  },
  sccCallout: {
    backgroundColor: THEME.colors.riskHighBg,
    padding: 12,
    borderRadius: THEME.radius.md,
    borderWidth: 1.5,
    borderColor: THEME.colors.riskHighBorder,
  },
  sccBandLarge: {
    fontSize: 16,
    fontWeight: '900',
    color: THEME.colors.riskHighText,
  },
  sccCount: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginTop: 2,
  },
  sccRuleNotice: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.riskHighText,
    marginTop: 4,
  },
  resultReason: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    lineHeight: 15,
  },
  resultBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  retakeBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.creamCardSubtle,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
  },
  retakeText: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  saveBtn: {
    flex: 1.5,
    paddingVertical: 12,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
  },
  saveText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFF',
  },
});
