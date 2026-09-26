import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { VetCase, Cow, AppLanguage } from '../../types';
import { THEME } from '../../constants/theme';
import { VetConfirmCaseModal } from './VetConfirmCaseModal';

interface VetTriageScreenProps {
  cows: Cow[];
  vetCases: VetCase[];
  language: AppLanguage;
  onSelectCow: (cow: Cow) => void;
  onRefreshCases: () => void;
}

export const VetTriageScreen: React.FC<VetTriageScreenProps> = ({
  cows,
  vetCases,
  language,
  onSelectCow,
  onRefreshCases,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedCaseForModal, setSelectedCaseForModal] = useState<VetCase | null>(null);

  const filters = ['ALL', 'PENDING_REVIEW', 'CONFIRMED_SUBCLINICAL', 'FALSE_POSITIVE'];

  const filteredCases = vetCases.filter(c => {
    if (statusFilter === 'ALL') return true;
    return c.status === statusFilter;
  });

  const getStatusBadge = (status: VetCase['status']) => {
    switch (status) {
      case 'PENDING_REVIEW':
        return { label: 'Pending Review', bg: THEME.colors.riskHighBg, text: THEME.colors.riskHighText };
      case 'CONFIRMED_SUBCLINICAL':
        return { label: 'Confirmed Subclinical', bg: THEME.colors.riskModerateBg, text: THEME.colors.riskModerateText };
      case 'CONFIRMED_CLINICAL':
        return { label: 'Confirmed Acute', bg: THEME.colors.riskHighBg, text: THEME.colors.riskHighText };
      case 'FALSE_POSITIVE':
        return { label: 'False Positive', bg: THEME.colors.riskLowBg, text: THEME.colors.riskLowText };
      case 'RESOLVED':
        return { label: 'Resolved (Healed)', bg: THEME.colors.riskHealthyBg, text: THEME.colors.riskLowText };
    }
  };

  const renderCaseItem = ({ item }: { item: VetCase }) => {
    const statusInfo = getStatusBadge(item.status);
    const relatedCow = cows.find(c => c.id === item.cowId);

    return (
      <View style={styles.caseCard}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.caseId}>{item.id}</Text>
            <Text style={styles.cowTitle}>Cow #{item.cowId} · {item.cowName}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
            <Text style={[styles.statusText, { color: statusInfo.text }]}>{statusInfo.label}</Text>
          </View>
        </View>

        <View style={styles.farmMeta}>
          <Text style={styles.farmText}>🏡 {item.farmName} ({item.district})</Text>
          <Text style={styles.timeText}>Reported: {item.submittedAt}</Text>
        </View>

        <View style={styles.quarterBadgeRow}>
          <Text style={styles.qText}>
            Affected Quarter: <Text style={{ fontWeight: '800', color: THEME.colors.riskHighText }}>{item.affectedQuarter}</Text>
          </Text>
          <Text style={styles.qText}>Risk Score: <Text style={{ fontWeight: '800' }}>{item.riskScore}%</Text></Text>
        </View>

        {item.treatmentRegimen && (
          <View style={styles.treatmentBox}>
            <Text style={styles.treatmentLabel}>PRESCRIBED TARGETED THERAPY:</Text>
            <Text style={styles.treatmentVal}>{item.treatmentRegimen}</Text>
            {item.pathogenIsolated && (
              <Text style={styles.pathogenVal}>Pathogen: {item.pathogenIsolated}</Text>
            )}
            {item.withholdingDays !== undefined && (
              <Text style={styles.withholdVal}>Withholding Period: {item.withholdingDays} days</Text>
            )}
          </View>
        )}

        {item.vetNotes && (
          <Text style={styles.notesText}>“{item.vetNotes}”</Text>
        )}

        <View style={styles.cardActions}>
          {relatedCow && (
            <TouchableOpacity
              style={styles.inspectBtn}
              onPress={() => onSelectCow(relatedCow)}
            >
              <Text style={styles.inspectText}>Inspect Sensor Signals →</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.diagBtn}
            onPress={() => setSelectedCaseForModal(item)}
          >
            <Text style={styles.diagText}>
              {item.status === 'PENDING_REVIEW' ? 'Confirm Diagnosis ✓' : 'Update Record ✎'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.title}>Veterinary Triage & Case Log</Text>
        <Text style={styles.sub}>Ground-truth validation across participating cooperative farms</Text>
      </View>

      {/* Filter Chips */}
      <View style={styles.filtersRow}>
        {filters.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, statusFilter === f && styles.filterChipActive]}
            onPress={() => setStatusFilter(f)}
          >
            <Text style={[styles.filterText, statusFilter === f && styles.filterTextActive]}>
              {f === 'ALL' ? 'All Cases' : f === 'PENDING_REVIEW' ? 'Pending' : f === 'CONFIRMED_SUBCLINICAL' ? 'Confirmed' : 'False +'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filteredCases}
        keyExtractor={item => item.id}
        renderItem={renderCaseItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <VetConfirmCaseModal
        visible={!!selectedCaseForModal}
        vetCase={selectedCaseForModal}
        onClose={() => setSelectedCaseForModal(null)}
        onCaseUpdated={onRefreshCases}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.creamBase,
  },
  topBar: {
    padding: THEME.spacing.md,
    backgroundColor: THEME.colors.primaryDark,
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFF',
  },
  sub: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  filtersRow: {
    flexDirection: 'row',
    padding: THEME.spacing.md,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.creamCard,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
  },
  filterChipActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  filterText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
  },
  filterTextActive: {
    color: '#FFF',
  },
  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 28,
    gap: 14,
  },
  caseCard: {
    backgroundColor: THEME.colors.creamCard,
    borderRadius: THEME.radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
    gap: 8,
    ...THEME.shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  caseId: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.goldAccent,
  },
  cowTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.sm,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  farmMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  farmText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    fontWeight: '600',
  },
  timeText: {
    fontSize: 10,
    color: THEME.colors.textMuted,
  },
  quarterBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.creamCardSubtle,
    padding: 8,
    borderRadius: THEME.radius.sm,
  },
  qText: {
    fontSize: 11,
    color: THEME.colors.textPrimary,
  },
  treatmentBox: {
    backgroundColor: THEME.colors.primarySurface,
    padding: 10,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.primaryBorder,
  },
  treatmentLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    color: THEME.colors.primaryMedium,
    letterSpacing: 0.5,
  },
  treatmentVal: {
    fontSize: 11.5,
    fontWeight: '700',
    color: THEME.colors.primaryDark,
    marginTop: 2,
  },
  pathogenVal: {
    fontSize: 10.5,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  withholdVal: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.riskHighText,
    marginTop: 2,
  },
  notesText: {
    fontSize: 11,
    fontStyle: 'italic',
    color: THEME.colors.textSecondary,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  inspectBtn: {
    paddingVertical: 8,
  },
  inspectText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.primaryMedium,
  },
  diagBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: THEME.radius.sm,
  },
  diagText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
});
