import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';
import { mockApiService } from '../services/mockApiService';

interface DemoStoryModalProps {
  visible: boolean;
  onClose: () => void;
  onNavigateToStep: (stepNumber: number) => void;
}

export const DemoStoryModal: React.FC<DemoStoryModalProps> = ({
  visible,
  onClose,
  onNavigateToStep,
}) => {
  const steps = [
    {
      num: 1,
      title: 'Farmer Dashboard Overview',
      subtitle: 'Sense & Edge Monitoring',
      description: 'See 20 cows monitored, ESP32-C3 status, 2 High Risk cows highlighted (Ganga & Nandini).',
      target: 'Dashboard Screen',
    },
    {
      num: 2,
      title: 'High-Risk Cow Triage (#42 Ganga)',
      subtitle: 'Sense → Learn Individual Baseline',
      description: 'Inspect Cow #42 Ganga (Sahiwal). 82% Risk. Observe Left Rear (LR) quarter tube heat differential (+1.8°C).',
      target: 'Cow Details Screen',
    },
    {
      num: 3,
      title: 'Explainable AI (SHAP Drivers)',
      subtitle: 'Why is she at risk?',
      description: 'Review physical drivers: SCC rise (+38%), tube heat (+31%), rumination drop (-18%), milk EC slope (+12%).',
      target: 'SHAP Drivers Screen',
    },
    {
      num: 4,
      title: '14-Day Risk Trajectory Forecast',
      subtitle: 'Early Forecast Lead-Time',
      description: 'Review XGBoost multi-target curve showing infection flagged at Day -10 before clinical swelling.',
      target: '14-Day Forecast View',
    },
    {
      num: 5,
      title: 'CMT Camera Scan (₹3 on-device AI)',
      subtitle: 'Edge CNN Gel Inference',
      description: 'Simulate California Mastitis Test photo capture. TFLite model detects gel viscosity → Band 2+ (1.85M SCC).',
      target: 'CMT Camera Screen',
    },
    {
      num: 6,
      title: 'Targeted Action Plan & SMS Fallback',
      subtitle: 'Act · What should I do today?',
      description: 'Separate LR milk, apply iodine teat dip, book vet visit, and test simulated GSM/SMS emergency alert.',
      target: 'Action Plan Screen',
    },
    {
      num: 7,
      title: 'Veterinary Outcome Confirmation',
      subtitle: 'Continuous ML Learning Loop',
      description: 'Switch to Dr. Meera Roy’s Vet Command, confirm clinical diagnosis, and submit outcome as training label.',
      target: 'Vet Command Screen',
    },
  ];

  const handleReset = () => {
    mockApiService.resetDemoData();
    onNavigateToStep(1);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <View style={styles.titleRow}>
                <Text style={styles.sheetTitle}>SIH 2026 Demo Story</Text>
                <View style={styles.pill}>
                  <Text style={styles.pillText}>SIH26109</Text>
                </View>
              </View>
              <Text style={styles.sheetSubtitle}>
                Guided journey: Sense → Edge → Learn → Forecast → Explain → Act
              </Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Research Impact Card */}
          <View style={styles.researchCard}>
            <Text style={styles.researchTitle}>🔬 The Core Innovation & Proof</Text>
            <Text style={styles.researchBody}>
              ICAR-NDRI Karnal found thermography flags infection from <Text style={{ fontWeight: '800' }}>Day −10 (r = 0.84)</Text>. KSHEER-RAKSHAK pairs milk-tube thermal array with ₹3 CMT camera AI and an individual baseline drift engine to save <Text style={{ fontWeight: '800' }}>₹1,390 per cow</Text> every lactation!
            </Text>
          </View>

          {/* Stepper list */}
          <ScrollView style={styles.stepList} showsVerticalScrollIndicator={false}>
            {steps.map(s => (
              <TouchableOpacity
                key={s.num}
                style={styles.stepCard}
                activeOpacity={0.8}
                onPress={() => {
                  onNavigateToStep(s.num);
                  onClose();
                }}
              >
                <View style={styles.stepNumberBadge}>
                  <Text style={styles.stepNum}>{s.num}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.stepTopRow}>
                    <Text style={styles.stepTitle}>{s.title}</Text>
                    <Text style={styles.stepActionHint}>Jump →</Text>
                  </View>
                  <Text style={styles.stepSubtitle}>{s.subtitle}</Text>
                  <Text style={styles.stepDesc}>{s.description}</Text>
                </View>
              </TouchableOpacity>
            ))}

            <View style={styles.footerSpacing} />
          </ScrollView>

          {/* Footer Reset & Close */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <Text style={styles.resetText}>↺ Reset Demo Data</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryBtn} onPress={onClose}>
              <Text style={styles.primaryBtnText}>Continue App</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 40, 30, 0.7)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: THEME.colors.creamBase,
    borderTopLeftRadius: THEME.radius.xl,
    borderTopRightRadius: THEME.radius.xl,
    paddingTop: 16,
    paddingHorizontal: 16,
    maxHeight: '90%',
    ...THEME.shadows.cardElevated,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.creamBorder,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
  },
  pill: {
    backgroundColor: THEME.colors.goldLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: THEME.colors.goldBorder,
  },
  pillText: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.goldAccent,
  },
  sheetSubtitle: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: THEME.colors.creamBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 14,
    color: THEME.colors.textPrimary,
    fontWeight: '700',
  },
  researchCard: {
    backgroundColor: THEME.colors.primarySurface,
    padding: 10,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.primaryBorder,
    marginBottom: 12,
  },
  researchTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.primaryDark,
    marginBottom: 3,
  },
  researchBody: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    lineHeight: 15,
  },
  stepList: {
    maxHeight: 380,
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.creamCard,
    padding: 12,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
    marginBottom: 10,
    gap: 12,
    ...THEME.shadows.card,
  },
  stepNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
  },
  stepTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  stepActionHint: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.colors.primaryMedium,
  },
  stepSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.goldAccent,
    marginTop: 1,
  },
  stepDesc: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 4,
    lineHeight: 15,
  },
  footerSpacing: {
    height: 16,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.creamBorder,
  },
  resetBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.creamCardSubtle,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
    alignItems: 'center',
  },
  resetText: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  primaryBtn: {
    flex: 1.2,
    paddingVertical: 12,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFF',
  },
});
