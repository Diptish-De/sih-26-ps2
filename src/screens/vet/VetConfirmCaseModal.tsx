import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import { VetCase } from '../../types';
import { THEME } from '../../constants/theme';
import { mockApiService } from '../../services/mockApiService';

interface VetConfirmCaseModalProps {
  visible: boolean;
  vetCase: VetCase | null;
  onClose: () => void;
  onCaseUpdated: () => void;
}

export const VetConfirmCaseModal: React.FC<VetConfirmCaseModalProps> = ({
  visible,
  vetCase,
  onClose,
  onCaseUpdated,
}) => {
  if (!vetCase) return null;

  const [diagnosisType, setDiagnosisType] = useState<'CONFIRMED_SUBCLINICAL' | 'CONFIRMED_CLINICAL' | 'FALSE_POSITIVE'>('CONFIRMED_SUBCLINICAL');
  const [pathogen, setPathogen] = useState('Staphylococcus aureus');
  const [treatment, setTreatment] = useState('Targeted 1-quarter Cloxacillin + Herbal Dip');
  const [withholdingDays, setWithholdingDays] = useState('3');
  const [notes, setNotes] = useState('Early detection at Day -8. Udder intact without systemic fever. Targeted 1-quarter cure.');

  const handleConfirm = () => {
    mockApiService.confirmVetDiagnosis(vetCase.id, {
      status: diagnosisType,
      pathogen,
      treatment,
      withholdingDays: parseInt(withholdingDays) || 0,
      vetNotes: notes,
    });

    Alert.alert(
      'Outcome Logged into MLflow',
      `Case ${vetCase.id} confirmed. Outcome ground-truth label appended to training dataset for continuous learning.`,
      [{ text: 'OK', onPress: () => { onCaseUpdated(); onClose(); } }]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Veterinary Outcome Confirmation</Text>
              <Text style={styles.sub}>Case: {vetCase.id} · Cow #{vetCase.cowId} {vetCase.cowName}</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Feedback Loop Explanation */}
            <View style={styles.loopNotice}>
              <Text style={styles.loopTitle}>🔄 Continuous Learning Loop</Text>
              <Text style={styles.loopBody}>
                Your veterinary confirmation serves as a supervised ML ground-truth label in MLflow to refine future XGBoost predictions.
              </Text>
            </View>

            {/* Diagnosis Type Selection */}
            <Text style={styles.label}>CLINICAL DIAGNOSIS</Text>
            <View style={styles.diagRow}>
              <TouchableOpacity
                style={[styles.diagBtn, diagnosisType === 'CONFIRMED_SUBCLINICAL' && styles.diagBtnActive]}
                onPress={() => setDiagnosisType('CONFIRMED_SUBCLINICAL')}
              >
                <Text style={[styles.diagText, diagnosisType === 'CONFIRMED_SUBCLINICAL' && styles.diagTextActive]}>
                  Subclinical Mastitis
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.diagBtn, diagnosisType === 'CONFIRMED_CLINICAL' && styles.diagBtnActive]}
                onPress={() => setDiagnosisType('CONFIRMED_CLINICAL')}
              >
                <Text style={[styles.diagText, diagnosisType === 'CONFIRMED_CLINICAL' && styles.diagTextActive]}>
                  Clinical (Acute)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.diagBtn, diagnosisType === 'FALSE_POSITIVE' && styles.diagBtnActive]}
                onPress={() => setDiagnosisType('FALSE_POSITIVE')}
              >
                <Text style={[styles.diagText, diagnosisType === 'FALSE_POSITIVE' && styles.diagTextActive]}>
                  False Positive
                </Text>
              </TouchableOpacity>
            </View>

            {/* Pathogen Isolated */}
            <Text style={styles.label}>ISOLATED PATHOGEN (OR CULTURE RESULT)</Text>
            <TextInput
              style={styles.input}
              value={pathogen}
              onChangeText={setPathogen}
              placeholder="e.g. S. aureus, Strep. uberis, E. coli"
            />

            {/* Treatment Regimen */}
            <Text style={styles.label}>TARGETED THERAPY REGIMEN (AMR MITIGATION)</Text>
            <TextInput
              style={styles.input}
              value={treatment}
              onChangeText={setTreatment}
              placeholder="e.g. Selective intramammary infusion for affected quarter only"
            />

            {/* Withholding Period */}
            <Text style={styles.label}>MILK WITHHOLDING PERIOD (DAYS)</Text>
            <TextInput
              style={styles.input}
              value={withholdingDays}
              onChangeText={setWithholdingDays}
              keyboardType="number-pad"
              placeholder="3"
            />

            {/* Clinical Notes */}
            <Text style={styles.label}>CLINICAL NOTES</Text>
            <TextInput
              style={[styles.input, { height: 60 }]}
              value={notes}
              onChangeText={setNotes}
              multiline
              placeholder="Notes on recovery timeline and quarter response"
            />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.submitBtn} activeOpacity={0.85} onPress={handleConfirm}>
              <Text style={styles.submitBtnText}>Confirm Diagnosis & Submit ML Label ✓</Text>
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
    maxHeight: '92%',
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
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
  },
  sub: {
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
  body: {
    maxHeight: 440,
  },
  loopNotice: {
    backgroundColor: THEME.colors.primarySurface,
    padding: 10,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.primaryBorder,
    marginBottom: 12,
  },
  loopTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.primaryDark,
    marginBottom: 2,
  },
  loopBody: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    lineHeight: 15,
  },
  label: {
    fontSize: 9,
    fontWeight: '800',
    color: THEME.colors.textMuted,
    marginTop: 8,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  diagRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  diagBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: THEME.radius.sm,
    backgroundColor: THEME.colors.creamCard,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
    alignItems: 'center',
  },
  diagBtnActive: {
    backgroundColor: THEME.colors.primaryDark,
    borderColor: THEME.colors.primaryDark,
  },
  diagText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
    textAlign: 'center',
  },
  diagTextActive: {
    color: '#FFF',
  },
  input: {
    backgroundColor: THEME.colors.creamCard,
    borderRadius: THEME.radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
    fontSize: 12,
    color: THEME.colors.textPrimary,
  },
  footer: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.creamBorder,
  },
  submitBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 14,
    borderRadius: THEME.radius.lg,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
